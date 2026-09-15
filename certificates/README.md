# Put your certificate scans here

Drop the image files into **this folder**. That is the only step — the site picks
them up automatically.

```bash
cp ~/Downloads/your-scans/*.png certificates/
npm run dev          # or: npm run build
```

You can also add them through GitHub's web interface: open this folder, choose
**Add file → Upload files**, and drag them in. Either way works.

## What to name each file

Name the file after the certificate, all lowercase with dashes. The table shows
the exact name for each of the five certificates on the site:

| Certificate on the site | File name |
| --- | --- |
| Next Generation for Remote Sensing Data Analytics & Multi Domain Applications | `next-gen-remote-sensing-analytics.jpg` |
| Applications of Remote Sensing & GIS in Earth Surface Process | `csir-ngri-remote-sensing-gis.jpg` |
| Sid's Farm Internship | `sids-farm-internship.jpg` |
| Hydroponics Systems | `itm-hydroponics-systems.jpg` |
| Organic Farming | `angrau-organic-farming.jpg` |

The site also shows **Drone Technology in Agriculture**, **Mushroom Cultivation**, and **Agro-Industrial Attachment (NSL Sugars)**,
but those cards are marked *On request*: the training/internship was completed, but the
certificate was never issued or is not published. They deliberately need **no file here** —
they link to the contact section instead of opening the viewer, so there is
nothing to scan and nothing for the drop-in check to report as missing.

`.jpg`, `.jpeg` and `.webp` work as well as `.png`.

**You do not have to be precise about capital letters or spaces.** A file named
`Organic Farming.PNG` is turned into `organic-farming.png` for you. What does
matter is the words: a file whose name matches none of the five is left alone and
reported, with the closest spelling suggested, rather than silently doing
nothing.

```bash
npm run certs        # just the check, without starting the dev server
```

## Making them small enough to send

A certificate photographed on a phone is 4-5 MB, and the viewer never shows one
wider than about 1200 px. Shrink them once:

```bash
npm run certs:optimise
```

That rewrites the files in this folder down to 1800 px on the long edge — a
5 MB photograph lands around 300 KB — and copies the untouched original into
`private/certificate-originals/` **before** touching anything, so the full-size
version is never lost. Re-running it changes nothing.

It deliberately leaves a file alone when re-encoding would not actually make it
smaller: a JPEG loses a generation of quality every time it is saved, so doing
that for no saving is worse than doing nothing.

## What happens to them

1. `npm run dev` / `npm run build` copies this folder into the location the site
   serves (that is why there is no second copy to keep in step).
2. On deploy, the same files are mirrored into the classic build too, so `/` and
   `/classic/` both show them.
3. A certificate **without** a scan is not an error. Its card opens a generated
   "certificate of record" instead, so the viewer is never broken. If a scan is
   never coming, mark that certificate `onRequest: true` in
   `src/data/portfolio.ts` instead — the card then asks visitors to request it.


## Please read this bit

A scan committed to a public repository is **permanently public** — git keeps
history, so deleting the file later does not remove it from the repo's past.

The viewer deters casual copying (watermarking, blocked save/print, blur when you
switch away) and makes any leak traceable to a session ID, but no browser can
stop a camera pointed at a screen. If any certificate carries a number you would
not want indexed — an ID, a roll number, a signature — blur that region before
adding the file, or keep that one certificate unscanned and share it on request.
