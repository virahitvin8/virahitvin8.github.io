# N. Akshit Vinay — Portfolio

Two builds of the same portfolio live in this repository, deployed together as
one site.

| Path | Build | Stack | Entry |
|---|---|---|---|
| `/` | **Primary** portfolio | React 19 + Vite 8 + Tailwind v4 | `index.html` → `src/main.tsx` |
| `/classic/` | Archived vanilla build | Plain HTML/CSS/JS, no build step | `portfolio/index.html` |

Both are deployed from one workflow, which builds the React app, copies the
vanilla build in beside it, and publishes only the result — so the résumé PDFs
and planning notes in this repository are never exposed.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:8443 (or $PORT)
```

| Script | What it does |
|---|---|
| `npm run dev` | Copies `certificates/` into place, then starts the dev server |
| `npm run build` | Same, then a production build into `dist/` |
| `npm run certs` | Just the certificate check, without starting the server |
| `npm run certs:optimise` | Shrink certificate scans for the web (keeps the originals) |
| `npm run preview` | Serve the production build locally |
| `npm run format` | Format with oxfmt |
| `npx tsc --noEmit` | Typecheck |

The build is a plain static bundle — no server, no database — which is what lets
it stay up 24/7 for free.

### Running the classic build

```bash
cd portfolio && python3 -m http.server 8000
```

---

## Admin mode

Both builds have owner editing, and both use the **same default PIN: `2080`** —
one value for the whole site.

| Build | Open with | Default PIN |
|---|---|---|
| React (`/`) | Lock button bottom-left, or `Ctrl/⌘ + Shift + A` | `2080` |
| Classic (`/classic/`) | Lock in the footer, or `Ctrl + Shift + A` | `2080` |

Each build stores its PIN under its own browser key, so changing it in one does
not change the other — set both once and they stay out of each other's way.

Once unlocked:

- **Double-click any text** to rewrite it in place; **double-click any image** to
  replace it (profile photo included).
- The **Editor** drawer has structured forms for projects, certifications,
  education, experience and the LinkedIn entries.
- **Export** downloads `portfolio-content.json`; **Import** loads one back.
- **Change the PIN** from inside the drawer.

### How publishing an edit works

Edits save to **your browser's** storage, so visitors do not see them until the
change is published. Two options:

1. **Content only** — edit in admin mode, click **Export**, and save the
downloaded file over `src/data/content.json` (delete its keys you did not mean
to change, leaving `{}` if you changed nothing). Commit and the workflow
redeploys. That file is read at **build time**, so the change is live for every
visitor on the next deploy and no TypeScript edit is needed.
2. **Anything else** — edit the source and push; the workflow redeploys.

The classic build is separate: it exports a complete `index.html` to replace
`portfolio/index.html`.

Precedence is **code defaults → `content.json` → your browser's unpublished
edits**. Diffs are stored rather than a snapshot, and that is deliberate: an
early version persisted the whole dataset on first visit, which froze that
day's defaults in every browser permanently — so a later fix to a default could
never reach anyone who had already opened the site.

---

## Deployment

`.github/workflows/deploy-pages.yml` publishes both builds. One-time setup:

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`, or run the workflow from the **Actions** tab.

Your URL depends on the repository name:

| Repository name | Site URL |
|---|---|
| `virahitvin8.github.io` | `https://virahitvin8.github.io/` ← what the files are configured for |
| anything else | `https://virahitvin8.github.io/<repo>/` |

If you use the second, update the host in these places:

- `index.html` — `canonical`, `og:url`, `og:image`, `twitter:image`
- `public/robots.txt` — the `Sitemap:` line
- `public/sitemap.xml` — every `<loc>`
- `portfolio/index.html`, `portfolio/robots.txt`, `portfolio/sitemap.xml` — for the classic build (or run `cd portfolio && ./set-domain.sh https://your-url`)

### After the first deploy

1. <https://search.google.com/search-console> → verify → submit `sitemap.xml`.
2. Paste your URL into <https://www.linkedin.com/post-inspector/> to force
   LinkedIn to re-scrape the share card.
3. Check <https://pagespeed.web.dev/>.

---

## What is in here

```
index.html                 Vite shell — SEO meta, Open Graph, JSON-LD Person
vite.config.ts             React + Tailwind, with Figma Make's plugins applied
                           only when .figma/make/site.json is present
package.json               Scripts and dependencies (npm is the package manager)
AGENTS.md / CLAUDE.md      Platform guidance for the Figma Make environment
README.md                  This file
src/
  main.tsx                 Entry; registers the service worker in production
  App.tsx                  Composes every section
  index.css                Tailwind import, @theme tokens, keyframes
  data/portfolio.ts        Default content — the code-level seed for the site
  data/content.json        Published content, merged over the defaults at build time
  content/PortfolioContext.tsx   State, storage, admin gate, export/import
  components/              One component per section, plus admin/ and icons
  hooks/                   useReveal, useGitHubFeed (live GitHub, cached),
                           useCertImage (certificate scan resolution)
  assets/cv.pdf            The résumé the Download CV button serves
public/                    Icons, profile.png, avatar.png, og-card.png,
                           manifest, robots, sitemap, sw.js
certificates/              Drop certificate scans here — see its README
scripts/
  build-image-assets.py    Regenerates every image asset from the source photos
  sync-certificates.mjs    Copies certificates/ to where the site serves them
  optimise-certificates.py Shrinks scans for the web; keeps the full-res originals
portfolio/                 The standalone vanilla build, served at /classic/
plans/                     The original build plan (background reading)
private/                   Ignored. Superseded résumés and source documents.
```

`private/` holds the career documents that are **not** part of either build —
older résumés, the source `.docx`, and the source photographs. It is gitignored,
so a public repository will not expose them. Deleting the folder is safe; nothing
imports from it, though `scripts/build-image-assets.py` reads the two source
photos from it and will say so if they are missing.

### Content

Content resolves in three layers, so you can change the site without touching a
component:

1. `src/data/portfolio.ts` — code defaults. Sections, stats, projects,
   certifications, timeline entries and skills are all data.
2. `src/data/content.json` — published overrides, read at build time.
3. Browser storage — the owner's unpublished edits.

### Images

The portrait, the header avatar, the icon set and the share card are all derived
from two source photographs. Regenerate the lot after replacing a source:

```bash
python3 scripts/build-image-assets.py     # needs Pillow
```

It writes `public/` and mirrors the same output into `portfolio/assets/`, so
`/` and `/classic/` cannot drift apart. Resizing is done on premultiplied alpha;
without that, a circular cut-out picks up a dark fringe at its edge.

Two marks, chosen by size. A full head-and-shoulders portrait in a 16px tab icon
gives the face about **three pixels**, which reads as noise — so `favicon-16/32`
(and the 48 inside `favicon.ico`) are cropped tight to the head with no gold
ring, putting the face at roughly half the tile. From 180px up there is room for
the whole circular portrait inside the ring, which is the better-looking mark and
is what a home-screen icon shows. The head crop is located from the photograph
itself rather than hard-coded, so replacing the source does not mis-frame it.

### Live GitHub

`src/hooks/useGitHubFeed.ts` reads `virahitvin8` in two places:

- `Projects` — your six most recently pushed repositories (forks excluded).
- `LiveFeeds` — your latest public activity.

Both are cached for ten minutes in `sessionStorage`. That matters: GitHub's
unauthenticated API allows **60 requests/hour per IP**, and the page needs two,
so without caching a couple of dozen visitors behind one campus or carrier NAT
would exhaust the hour for everyone. The first load costs 2 requests; every
reload costs 0.

LinkedIn has no public posts API and blocks scraping, so those entries are
curated by you and labelled as such. The button links to your profile.

### Certificates

Each certification card opens a locked viewer: a per-session watermark and ID,
a timestamp, blocked right-click/copy/drag, auto-hide when you switch away, and
a print/save block.

There is an **honest note** printed in the viewer, and it is deliberate: no
browser can stop a phone camera pointed at a screen. The goal is that casual
capture is useless and any leak is traceable, not that capture is impossible.
Claiming otherwise would be the one thing that actually damages credibility.

To show a real scan, drop it into **`certificates/`** named after the
certificate's slug — the exact file name for each is in
[`certificates/README.md`](certificates/README.md). A missing scan is a normal
state, not an error: the viewer renders a generated certificate of record
instead, so a card is never a broken image. You can also set `image` on a
certification (a path or a full URL), which takes precedence.

`npm run dev` and `npm run build` copy that folder into place first, so there is
no second copy to keep in step; the deploy workflow then mirrors the same files
into `/classic/`. Names are normalised (`Organic Farming.PNG` →
`organic-farming.png`), and a file whose name matches no certificate is reported
with a suggested spelling rather than silently doing nothing.

A scan photographed on a phone is several megabytes, and the viewer never shows
one wider than about 1200 px — so `npm run certs:optimise` shrinks it to 1800 px
on the long edge at quality 88 with no chroma subsampling (kept, because that is
what smears small type on a document). A 4.8 MB photograph becomes about 300 KB.
It copies the untouched original to `private/certificate-originals/` **before**
writing, and leaves a file alone when a re-encode would not actually save
anything — re-encoding costs a JPEG generation, so doing it for a fraction of a
percent is pure loss.

Three certificates — **Drone Technology in Agriculture**, **Mushroom
Cultivation**, and **Agro-Industrial Attachment (NSL Sugars)** — are marked
`onRequest: true` in `src/data/portfolio.ts`. The training or internship was
completed but the certificate was never issued or published, so those cards say
so and link to the contact section instead of opening the viewer. A card must
never offer to show a document that does not exist.

---

## Known gaps

- **The CV must be updated in two places.** `src/assets/cv.pdf` is bundled by the
  React app; `portfolio/assets/cv.pdf` is the copy the classic build links to.
  Both currently hold the same file, but replacing one does not update the other.
- **Certificate scans are read from a folder, not from the admin editor, for
  anything published.** Uploads through the editor are stored per-browser in
  `localStorage`, which browsers cap around 5 MB in total — fine for a quick
  preview, not for six full scans. Use `certificates/`.
- **The header avatar is a fixed crop.** It is a square window taken from the
  header photograph (`anchor=0.12` in `scripts/build-image-assets.py`). If the
  framing sits badly, change that number and re-run the script.
- **Exported JSON is deliberately hand-editable, so it is easy to break.**
  `content.json` is merged one level deep and unknown sections are ignored with
  a console warning rather than a crash. Renaming a *nested* key silently does
  nothing.

## Housekeeping notes

- **`npm` is the package manager.** The Figma Make platform ships a
  `pnpm-lock.yaml`; since pnpm is not installed here and the CI workflow uses
  `npm ci`, that lockfile was removed to avoid two competing dependency trees.
  If you switch back to pnpm, delete `package-lock.json` at the same time.
- **`src/imports/` no longer exists.** It held a copy of the vanilla build that
  had drifted out of date — including the admin logic from before several bug
  fixes — so it was a misleading reference rather than a useful one.
  `portfolio/` is the single, current source for that build.
- **The classic build's CV was stale.** `portfolio/assets/cv.pdf` was
  byte-identical to the superseded résumé in `private/OLD RESUME/`, so the
  Download CV button on `/classic/` was serving an out-of-date document. It now
  matches `src/assets/cv.pdf`.
