#!/usr/bin/env python3
"""
Shrink the certificate scans the site serves, without losing what you keep.

A certificate photographed on a phone arrives at 4-5 MB. The secured viewer
never shows one wider than about 1200 px, so that size is paid for by every
visitor who opens the card, on mobile data, and buys nothing visible.

Two rules this script follows, both learned the hard way:

  1. The full-resolution original is copied to private/certificate-originals/
     (gitignored, never published) BEFORE the file in certificates/ is touched.
     Backing up afterwards backs up the new file — which is not a backup.
  2. A re-encode is only written when it actually makes the file smaller, or
     when the source carries camera metadata that should not be published.
     Re-encoding costs a JPEG generation, so paying it to produce a *larger*
     file is pure loss.

    python3 scripts/optimise-certificates.py            # optimise
    python3 scripts/optimise-certificates.py --check    # report, change nothing

Uses Pillow, the same dependency scripts/build-image-assets.py uses:
    python3 -m pip install pillow
"""

import io
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "certificates"
ORIGINALS = ROOT / "private" / "certificate-originals"

# Long edge of the served copy. The viewer fits the scan to the viewport, whose
# height caps around 800 px; 1800 leaves room to read fine print on a
# high-density display.
MAX_EDGE = 1800

# Quality 88 with no chroma subsampling. Certificates are text on paper, and
# subsampling is what smears small type — the extra bytes are worth it.
QUALITY = 88

# Only rewrite a file for a real saving. Re-encoding a JPEG costs a generation
# of quality, and re-encoding this script's own output at the same quality comes
# back a fraction of a percent smaller — so without a floor the script would
# keep "optimising" its own work forever, degrading scans for no gain.
MIN_GAIN = 0.10

SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
CHECK_ONLY = "--check" in sys.argv


def human(n):
    return f"{n / 1024:.0f} KB" if n < 1024 * 1024 else f"{n / 1048576:.1f} MB"


def keep_original(path):
    """Copy the untouched file aside once. Never overwrites an existing copy."""
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    target = ORIGINALS / path.name
    if target.exists():
        return False
    shutil.copy2(path, target)
    return True


def encode(path):
    """Read a scan and return (JPEG bytes, final size, carried metadata?)."""
    with Image.open(path) as im:
        # Phone cameras record orientation in EXIF; without this a portrait scan
        # is served sideways — and exif_transpose is also what lets us drop the
        # metadata without rotating the picture.
        meta = bool(im.info.get("exif") or im.info.get("icc_profile") or im.info.get("comment"))
        im = ImageOps.exif_transpose(im)
        if im.mode != "RGB":
            im = im.convert("RGB")

        edge = max(im.size)
        if edge > MAX_EDGE:
            scale = MAX_EDGE / edge
            im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)

        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=QUALITY, subsampling=0, optimize=True, progressive=True)
        return buf.getvalue(), im.size, meta


def process(path):
    before = path.stat().st_size
    data, size, meta = encode(path)
    after = len(data)

    worth_it = after <= before * (1 - MIN_GAIN)

    if CHECK_ONLY:
        return {"path": path, "before": before, "after": after, "size": size,
                "wrote": False, "change": worth_it or meta,
                "why": "check", "meta": meta}

    if not worth_it and not meta:
        return {"path": path, "before": before, "after": before, "size": size,
                "wrote": False, "change": False, "why": "kept", "meta": meta}

    # Backup first: after this line the original no longer exists on disk.
    keep_original(path)
    out = path.with_suffix(".jpg")
    out.write_bytes(data)
    if out != path:
        path.unlink()

    return {"path": path, "before": before, "after": after, "size": size,
            "wrote": True, "change": True,
            "why": "metadata" if not worth_it else "smaller", "meta": meta}


def main():
    if not SRC.is_dir():
        sys.exit(f"no {SRC} folder")

    files = [
        p for p in sorted(SRC.iterdir())
        if p.is_file() and p.suffix.lower() in SUFFIXES
    ]
    if not files:
        sys.exit("certificates/ has no images yet — drop your scans in first")

    results = []
    for path in files:
        try:
            results.append(process(path))
        except Exception as err:  # one unreadable file must not stop the rest
            print(f"! {path.name} — could not read it ({err})")

    if not results:
        sys.exit("nothing could be read")

    for r in results:
        note = f"{r['size'][0]}x{r['size'][1]}"
        name = r["path"].name
        if not r["change"]:
            print(f"· {name}  {human(r['before'])}  {note}  — kept as-is, "
                  f"re-encoding would not shrink it")
            continue
        if CHECK_ONLY:
            why = "metadata only" if r["after"] >= r["before"] else f"{human(r['after'])}"
            print(f"→ {name}  {human(r['before'])} → {why}  {note}"
                  + ("  (EXIF stripped)" if r["meta"] else ""))
            continue
        pct = f"{100 - r['after'] / r['before'] * 100:.0f}% smaller"
        why = f"  ({pct})" if r["why"] == "smaller" else f"  (metadata stripped; {pct} — kept for privacy)"
        print(f"✓ {name}  {human(r['before'])} → {human(r['after'])}  {note}{why}")

    if CHECK_ONLY:
        todo = [r for r in results if r["change"]]
        total_b = sum(r["before"] for r in todo)
        total_a = sum(r["after"] for r in todo)
        if not todo:
            print(f"\n--check: nothing written. All {len(results)} scan(s) already optimised.")
        else:
            print(f"\n--check: nothing written. {len(todo)} of {len(results)} would change "
                  f"({human(total_b)} → {human(total_a)}).")
        return

    written = [r for r in results if r["wrote"]]
    if not written:
        print("\nNothing to do — every scan is already smaller than a re-encode would be.")
        return

    total_b = sum(r["before"] for r in written)
    total_a = sum(r["after"] for r in written)
    print(f"\n{len(written)} file(s): {human(total_b)} → {human(total_a)} "
          f"({100 - total_a / total_b * 100:.0f}% smaller).")
    stripped = [r for r in written if r["meta"]]
    if stripped:
        print(f"{len(stripped)} carried camera metadata — location, device, timestamps — now removed.")
    if ORIGINALS.exists():
        print(f"Full-resolution originals kept in {ORIGINALS.relative_to(ROOT)}/")
    print("Next: npm run certs  (copies them into the built site)")


if __name__ == "__main__":
    main()
