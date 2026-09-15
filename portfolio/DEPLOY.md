# Deploying the portfolio

The site is completely static — HTML, a few CSS/JS files, and an `assets/`
folder. No build step, no database, no server to keep alive. That is exactly
why it can stay up 24/7 for free.

**Publish only the `portfolio/` folder.** The repository root also holds your
resume PDFs and extracted images — those should never be public. The workflow
below already publishes only `portfolio/`.

---

## Where you stand right now

| Thing | Status |
|---|---|
| GitHub account | ✅ verified — [`virahitvin8`](https://github.com/virahitvin8), 11 public repos |
| Live commit feed | ✅ wired (`GH_USER` in `futurist.js`) |
| Social share card | ✅ `assets/og-card.png`, 1200×630 |
| Favicon + PWA icons | ✅ full set in `assets/icons/` |
| Canonical host | `https://virahitvin8.github.io/` |
| Certificate scans | ⬜ drop them in `assets/certs/` |

---

## Option 1 — GitHub Pages (free, automated, recommended)

A workflow ships at `.github/workflows/deploy-pages.yml`. It publishes
`portfolio/` every time you push to `main`.

1. Create a repo on GitHub and push this project to it.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push any change under `portfolio/`, or run the workflow from the **Actions** tab.

**Your URL depends on what you name the repo:**

| Repo name | Site URL |
|---|---|
| `virahitvin8.github.io` | `https://virahitvin8.github.io/` ← matches what's configured now |
| anything else (e.g. `portfolio`) | `https://virahitvin8.github.io/portfolio/` |

If you pick the second option, tell the script about the subpath:

```bash
cd portfolio
./set-domain.sh https://virahitvin8.github.io/portfolio
```

Every future edit becomes a deploy with a single push.

## Option 2 — Cloudflare Pages (fastest global delivery)

1. <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages**.
2. Connect the GitHub repo.
3. **Build command:** leave empty. **Build output directory:** `portfolio`.
4. Deploy — you get a free `*.pages.dev` URL and unlimited bandwidth.

Best choice if you expect heavy international traffic: Cloudflare serves from
hundreds of edge locations.

## Option 3 — Vercel or Netlify

- **Vercel:** import the repo, **Root Directory** = `portfolio`, framework preset
  **Other**, no build command.
- **Netlify:** connect the repo with **Base directory** `portfolio` and publish
  directory `portfolio`.

## Option 4 — the 30-second version

Drag the `portfolio` folder onto <https://app.netlify.com/drop>. Live HTTPS URL
immediately — good for showing someone right now, not for a permanent address.

---

## Want a real-looking domain instead of `*.github.io`?

You have two paths. Both are one command once you own the name.

### A. Free subdomain (DigitalPlat FreeDomain)

The project you found, [DigitalPlatDev/FreeDomain](https://github.com/DigitalPlatDev/FreeDomain),
is real and active — it hands out free subdomains under `.dpdns.org` and
`.us.kg`, reviewed manually by a small volunteer team and widely used. It gives
you a genuine-looking address for nothing.

**The tradeoff, stated plainly:** it's a community-run service, not a registrar
you're paying. Subdomains are manually approved, and the project's own operators
have documented revocation risk and a changing TLD lineup (the previous `.us.kg`
signup channel was closed and later reopened). For a student portfolio that's a
reasonable risk; for a link printed on a resume, weigh it.

1. Register a subdomain at <https://domain.digitalplat.org>.
2. In GitHub → **Settings → Pages → Custom domain**, enter it.
3. Add the DNS records **DigitalPlat tells you to** (usually a CNAME to
   `virahitvin8.github.io`).
4. Wait for the certificate, then run:

```bash
cd portfolio
./set-domain.sh https://akshitvinay.dpdns.org
```

`set-domain.sh` also writes the `CNAME` file GitHub Pages requires — without it
your next deploy silently drops back to `*.github.io`.

### B. A paid domain (about the price of one coffee a year)

`.com` / `.dev` / `.in` typically run ₹700–1200/year. This is the only option
that is truly yours forever, works in every email signature, and never depends
on a volunteer team. If the portfolio is going on job applications, this is the
one worth doing.

Either way, `set-domain.sh` handles the switch. It detects the host currently
baked in, so you can change your mind as many times as you like:

```bash
cd portfolio
chmod +x set-domain.sh
./set-domain.sh https://your-real-domain.com
```

---

## Before you share the link

### 1. Connect the live feeds

The GitHub feed is **already wired to `virahitvin8`** and verified working. To
change it, or to edit the LinkedIn signals: open the site → 🔒 in the footer →
PIN `2080` → **2080 Core**.

Two things worth knowing about that panel:

- **It shows your repositories, not just your activity.** Your recent public
  events are all stars, which read as *consuming* rather than building — so the
  panel leads with your four most recently pushed repos (`photolink`,
  `crafty-gis`, `agri_gis_studio`, `farmhealth`) and lists stars underneath.
  Forks are filtered out so other people's code never leads.
- **It is cached for 10 minutes per visitor session.** GitHub's key-less API
  allows 60 requests/hour per IP and the panel needs three of them, so without
  caching roughly 20 page views would exhaust an hour for everyone on that
  network. The first load costs 3 requests; every load after that costs 0.

The moment you push this portfolio repo, real commit events start appearing in
the activity list alongside the stars.

### 2. Add your certificate scans

Drop them into `assets/certs/` named after each certificate — see
`assets/certs/README.md` for the exact slugs — or upload them one at a time from
**2080 Core → Certificate Scans**.

### 3. Get found by Google

1. <https://search.google.com/search-console> → add your domain → verify.
2. **Sitemaps** → submit `sitemap.xml`.
3. **URL Inspection** → paste your URL → **Request indexing**.

The page ships a JSON-LD `Person` schema with your GitHub and LinkedIn in
`sameAs`, which is what lets Google show a proper knowledge panel for your name
rather than a generic blue link.

### 4. Make the social preview look good

Paste your URL into <https://www.linkedin.com/post-inspector/> to force LinkedIn
to re-scrape. Do this after every major change — otherwise LinkedIn keeps
serving its cached card. The same applies to WhatsApp and X.

The card is `assets/og-card.png` (1200×630, the size every platform expects).
Regenerate it if your title or photo changes.

---

## Replacing a deploy (how your edits actually go live)

Admin-mode edits save to **your own browser's storage**. Visitors will not see
them until you bake them in:

1. Edit anything in admin mode (drawer or double-click).
2. Click **Save & Export Site** — this downloads a fresh `index.html`.
3. Replace `portfolio/index.html` with that file.
4. Push / re-deploy.

Step 1–2 are needed for content changes. Certificate additions and deletions
persist in your browser too, so export after those as well.

---

## Keeping it fast

- `assets/profile.png` is now **512×512**. Be aware the source photograph is
  only 167×167 original pixels, so this is a high-quality upscale — it looks
  crisp at every size the site uses, but soft if someone opens the file at full
  resolution. A larger original photo is still the single biggest visual upgrade
  available to you.
- Keep `assets/cv.pdf` under about 2 MB so the Download CV button feels instant.
- `sw.js` caches everything for repeat visitors, so the second visit loads from
  disk. Bump `VERSION` in `sw.js` to force a refresh after big changes.
