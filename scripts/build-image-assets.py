#!/usr/bin/env python3
"""
Derive every image asset in the site from the two source photographs.

Run from the repository root:

    python3 scripts/build-image-assets.py

Why this exists: the portrait and the header image have already been replaced
once, and doing that by hand means touching a dozen files that must stay
consistent — the hero portrait, the header avatar, the PWA icon set, the social
share card, and a second copy of each in the classic build. This script is the
single place that knows how they relate, so swapping a source photo is one edit
plus one command.

Sources (private/, git-ignored — never published):

    private/pictures. /profile picture /profile-pic (3).png    headshot
    private/pictures. /header icon pic /d932695e-*.jpeg         header image

(both folder names end in a space, which is why the paths look padded)

Generated (public/, published; mirrored into portfolio/assets/ for /classic/):

    profile.png         512x512   hero portrait, transparency preserved
    avatar.png          512x512   header avatar, square crop of the header photo
    og-card.png        1200x630   share card — portrait swapped in place
    icons/favicon-16/32/48.png
    icons/apple-touch-icon.png    180x180
    icons/icon-192.png, icon-512.png
    icons/icon-maskable-512.png   subject inset into the Android safe zone
    favicon.ico         16/32/48 in one file
"""

from pathlib import Path
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
CLASSIC = ROOT / "portfolio" / "assets"

# Note the trailing spaces — they are part of the folder names as supplied.
PORTRAIT_SRC = (
    ROOT / "private" / "pictures. " / "profile picture " / "profile-pic (3).png"
)
HEADER_SRC = (
    ROOT / "private" / "pictures. " / "header icon pic "
    / "d932695e-9bc6-415d-a528-61acab2f9954.jpeg"
)

# Palette shared with src/index.css, so the icons stay on-brand.
VOID = (4, 18, 12)
EMERALD = (13, 43, 31)
GOLD = (201, 168, 76)

# Where the portrait sits inside the existing share card, and how big it is.
# Measured from the card itself, so the gold ring around it stays untouched.
OG_PORTRAIT_BOX = (118, 199, 232, 232)
OG_SIZE = (1200, 630)


def premultiply(im: Image.Image) -> np.ndarray:
    """RGB scaled by its own alpha, so transparent pixels stop bleeding."""
    px = np.asarray(im.convert("RGBA")).astype(np.float32)
    a = px[:, :, 3:4] / 255.0
    return np.concatenate([px[:, :, :3] * a, px[:, :, 3:4]], axis=2)


def resize_premultiplied(pm: np.ndarray, size: tuple[int, int]) -> Image.Image:
    """
    Resize premultiplied RGBA.

    A straight resize of an RGBA image averages the RGB of fully transparent
    pixels into the visible edge; on a circular cut-out that draws a dark or
    coloured fringe around the subject. Premultiplying first removes it.
    """
    w, h = size
    rgb = Image.fromarray(np.clip(pm[:, :, :3], 0, 255).astype(np.uint8), "RGB")
    alpha = Image.fromarray(pm[:, :, 3].astype(np.uint8), "L")

    r = np.asarray(rgb.resize(size, Image.LANCZOS)).astype(np.float32)
    a = np.asarray(alpha.resize(size, Image.LANCZOS)).astype(np.float32)

    out = np.zeros((h, w, 4), np.uint8)
    out[:, :, :3] = np.clip(r / np.clip(a / 255.0, 1e-6, None)[:, :, None], 0, 255).astype(np.uint8)
    out[:, :, 3] = a.astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def radical_wash(size: int) -> Image.Image:
    """Emerald at the centre fading to the site's near-black at the edge."""
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    r = np.clip(np.sqrt((xx - size / 2) ** 2 + (yy - size / 2) ** 2) / (size * 0.78), 0, 1)
    t = r[:, :, None]
    bg = np.array(VOID, np.float32) * t + np.array(EMERALD, np.float32) * (1 - t)
    return Image.fromarray(bg.astype(np.uint8), "RGB")


def plate(premul: np.ndarray, size: int, inset: float, ring: bool = True) -> Image.Image:
    """A dark emerald tile with the portrait centred inside a gold ring."""
    canvas = radical_wash(size)

    inner = max(1, int(round(size * inset)))
    disc = resize_premultiplied(premul, (inner, inner))
    canvas.paste(disc, ((size - inner) // 2, (size - inner) // 2), disc)

    if ring:
        d = ImageDraw.Draw(canvas)
        r = inner / 2 + max(0.5, size * 0.010)
        d.ellipse(
            [size / 2 - r, size / 2 - r, size / 2 + r, size / 2 + r],
            outline=GOLD,
            width=max(1, int(round(size * 0.022))),
        )
    return canvas


def square_crop(im: Image.Image, anchor: float) -> Image.Image:
    """
    Largest centred square from a non-square photo.

    `anchor` picks the vertical window: 0.0 keeps the top edge, 1.0 the bottom.
    A portrait's subject sits above centre, so a small value is the safe choice.
    """
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = int((h - side) * anchor)
    return im.crop((left, top, left + side, top + side))


def write_pair(name: str, image: Image.Image, subdir: str = "") -> None:
    """Save into public/ and mirror into portfolio/assets/ for /classic/."""
    for base in (PUBLIC, CLASSIC):
        target = base / subdir
        target.mkdir(parents=True, exist_ok=True)
        image.save(target / name, optimize=True)


def main() -> None:
    for path in (PORTRAIT_SRC, HEADER_SRC):
        if not path.exists():
            sys.exit(f"missing source image: {path}")

    portrait = Image.open(PORTRAIT_SRC).convert("RGBA")
    header = Image.open(HEADER_SRC).convert("RGB")
    print(f"portrait source : {portrait.size[0]}x{portrait.size[1]}")
    print(f"header source   : {header.size[0]}x{header.size[1]}")

    premul = premultiply(portrait)

    # ── 1. hero portrait: keep the transparency, both builds ────────────────
    write_pair("profile.png", resize_premultiplied(premul, (512, 512)))
    print("wrote profile.png  512x512 (both builds, transparency kept)")

    # ── 2. header avatar: square crop of the header photo ───────────────────
    avatar = square_crop(header, anchor=0.12).resize((512, 512), Image.LANCZOS)
    write_pair("avatar.png", avatar)
    print("wrote avatar.png   512x512 (both builds)")

    # ── 3. share card: swap the portrait, keep the existing design ──────────
    card_path = PUBLIC / "og-card.png"
    if not card_path.exists():
        print("!! no og-card.png to update — skipped")
    elif Image.open(card_path).size != OG_SIZE:
        print(f"!! og-card is {Image.open(card_path).size}, expected {OG_SIZE} — skipped")
    else:
        card = Image.open(card_path).convert("RGB")
        x, y, w, h = OG_PORTRAIT_BOX
        disc = resize_premultiplied(premul, (w, h))
        card.paste(disc, (x, y), disc)
        write_pair("og-card.png", card)
        print(f"wrote og-card.png  portrait replaced at {x},{y} ({w}x{h})")

    # ── 4. icon set ─────────────────────────────────────────────────────────
    for size, inset, name in (
        (192, 0.86, "icon-192.png"),
        (512, 0.86, "icon-512.png"),
        (180, 0.90, "apple-touch-icon.png"),
    ):
        write_pair(name, plate(premul, size, inset), subdir="icons")
        print(f"wrote icons/{name}")

    # A maskable icon gets cropped to a circle or squircle by the launcher, so
    # the subject has to stay inside the middle 80% of the tile.
    write_pair("icon-maskable-512.png", plate(premul, 512, 0.70), subdir="icons")
    print("wrote icons/icon-maskable-512.png (subject inside the safe zone)")

    for size in (16, 32, 48):
        write_pair(f"favicon-{size}.png", plate(premul, size, 0.84), subdir="icons")
    print("wrote icons/favicon-16/32/48.png")

    plate(premul, 48, 0.84).save(
        PUBLIC / "favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)]
    )
    print("wrote favicon.ico (16/32/48)")


if __name__ == "__main__":
    main()
