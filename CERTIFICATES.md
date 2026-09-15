# Certificate scans

Drop your certificate images in **`public/certs/`**. That is the only folder you
need to touch — the deploy workflow copies it into the classic build, so one set
of files serves both `/` (React) and `/classic/`.

Each file is named after the certificate **slug**:

| Certificate shown on the site | File name to drop in |
| --- | --- |
| Next Generation for Remote Sensing Data Analytics & Multi Domain Applications | `next-generation-for-remote-sensing-data-analytics-and-multi-domain-applications.png` |
| Applications of Remote Sensing & GIS in Earth Surface Process | `applications-of-remote-sensing-and-gis-in-earth-surface-process.png` |
| Organic Farming | `organic-farming.png` |
| Drone Technology in Agriculture | `drone-technology-in-agriculture.png` |
| Hydroponics Systems | `hydroponics-systems.png` |
| Mushroom Cultivation | `mushroom-cultivation.png` |

Extensions are probed in the order `.png` `.jpg` `.jpeg` `.webp`, so a JPEG scan
named exactly as above is found too.

That is the whole workflow:

```bash
cp ~/Downloads/your-scans/*.png public/certs/
cp ~/Downloads/your-scans/*.png portfolio/assets/certs/   # only if you test /classic/ standalone
npm run dev
```

Click any certificate card and the scan opens in the secured viewer.

## Facts worth knowing

- **Nothing breaks while a scan is missing.** The viewer shows a generated
  "certificate of record" instead, so a card is never a broken image.
- **Slugs are explicit, not derived from the title.** They live in
  `src/data/portfolio.ts` (`slug:` on each certification) and in the classic
  build's `data-cert-slug`/card title. Editing a certificate's wording will not
  orphan its file.
- **The folder is a build input, not a runtime upload.** Because the files ship
  with the site, they work offline, load fast, and have no size limit — unlike
  uploading through the admin editor, which stores images in `localStorage`
  (roughly 5 MB total, for all certificates combined).
- **Scans are deliberately full quality.** The viewer renders them into a
  watermarked, non-exportable canvas; it does not downscale them first.

## Other ways to attach a scan

- **Admin editor** — unlock the site, open the Editor drawer, and set a
  certificate's image directly. Stored in the browser as a data URL, so it is
  private to that browser until you export and commit the content JSON.
- **Any path or URL** — a certificate's `image` field in
  `src/data/content.json` accepts a path (`/certs/x.jpg`) or a full `https://`
  URL, and takes precedence over the folder probe.
