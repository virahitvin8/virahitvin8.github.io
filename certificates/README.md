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
the exact name for each of the six certificates on the site:

| Certificate on the site | File name |
| --- | --- |
| Next Generation for Remote Sensing Data Analytics & Multi Domain Applications | `next-generation-for-remote-sensing-data-analytics-and-multi-domain-applications.png` |
| Applications of Remote Sensing & GIS in Earth Surface Process | `applications-of-remote-sensing-and-gis-in-earth-surface-process.png` |
| Organic Farming | `organic-farming.png` |
| Drone Technology in Agriculture | `drone-technology-in-agriculture.png` |
| Hydroponics Systems | `hydroponics-systems.png` |
| Mushroom Cultivation | `mushroom-cultivation.png` |

`.jpg`, `.jpeg` and `.webp` work as well as `.png`.

**You do not have to be precise about capital letters or spaces.** A file named
`Organic Farming.PNG` is turned into `organic-farming.png` for you. What does
matter is the words: a file whose name matches none of the six is left alone and
reported, with the closest spelling suggested, rather than silently doing
nothing.

```bash
npm run certs        # just the check, without starting the dev server
```

## What happens to them

1. `npm run dev` / `npm run build` copies this folder into the location the site
   serves (that is why there is no second copy to keep in step).
2. On deploy, the same files are mirrored into the classic build too, so `/` and
   `/classic/` both show them.
3. A certificate **without** a scan is not an error. Its card opens a generated
   "certificate of record" instead, so the viewer is never broken.

## Please read this bit

A scan committed to a public repository is **permanently public** — git keeps
history, so deleting the file later does not remove it from the repo's past.

The viewer deters casual copying (watermarking, blocked save/print, blur when you
switch away) and makes any leak traceable to a session ID, but no browser can
stop a camera pointed at a screen. If any certificate carries a number you would
not want indexed — an ID, a roll number, a signature — blur that region before
adding the file, or keep that one certificate unscanned and share it on request.
