# Plan: Futurist-2080 Portfolio — N. Akshit Vinay (Remote Sensing / GIS / Agriculture)

## Context

The user wants a "best portfolio ever" — a fully animated, futuristic ("2080 perspective") personal
portfolio expressing an agriculture + remote sensing + GIS identity. Requirements gathered from the
brief and the attached reference material (`src/imports/`, a complete vanilla HTML/CSS/JS version):

- Full multi-section site: hero, about, education, experience, certifications, projects, skills, contact.
- Heavy animation and visual effects (orbital constellation, boot sequence, glitch, marquee, scroll reveals).
- Live GitHub activity feed; a LinkedIn feed + LinkedIn icon that links out to the profile.
- Owner **admin mode** behind a PIN: double-click any text/image/logo to edit it in place; editable
  profile photo, certificates, and all section content.
- A **secured certificate viewer**: click a certificate, view it in a locked overlay with anti-capture
  deterrents.
- Runs 24/7 for all visitors (static hosting on an edge CDN / GitHub Pages).
- Strong SEO / shareability for visibility.

The project is a **clean React 19 + Vite + Tailwind v4** scaffold (empty `App.tsx`, single Tailwind
import, no components/router/tokens). The `src/imports/` files are the vanilla reference — we mine them
for **content and structure**, but the deliverable is idiomatic React, not the pasted HTML/JS.

### Honest constraints (built into this plan, deviating from the attached spec)

1. **True screenshot/crop/screen-record blocking is impossible in a browser.** We ship *deterrence +
   traceability*, not real DRM. We deliberately DROP from the spec: 60 Hz scanline interlacing (reads
   as broken flicker, doesn't stop modern capture) and global `HTMLCanvasElement.prototype` overrides
   (would break our own canvas backgrounds). Copy in the viewer will be honest about this.
2. **LinkedIn has no public posts API** and blocks scraping. GitHub feed = real live API. LinkedIn
   feed = admin-curated entries; the icon links to the profile. No claim of "auto-synced LinkedIn posts."
3. **Persistence = localStorage + JSON export/import** (matches the attached spec's client-side CMS).
   Edits live in the owner's browser and can be exported/re-imported to publish. Supabase is noted as a
   future upgrade but out of scope here to keep it backend-free and 24/7-static.

## Design direction

Invoke the `aesthetic-stance` skill first, then call `create_make_theme` with a 1–2 sentence brief
(futuristic geospatial "orbital telemetry" portfolio, deep-emerald + burnished-gold + sage). Lock the
"Emerald Executive" palette from the reference as the token base:

- `--void #020a07`, `--primary #0d2b1f`, `--primary-light #2d6a4f`, `--accent/gold #c9a84c`,
  `--sage #52b788`, neon accent `#00ffc8`.
- Fonts (Google, wired via CSS `@import` in `src/index.css`): display serif **Playfair Display**,
  UI sans **Outfit**, mono **JetBrains Mono**. Define as Tailwind v4 `@theme` tokens + CSS variables.

## Dependencies to add

- `motion` (Framer Motion v11+, `motion/react`) — scroll reveals, orbital/transition animation.
- `lucide-react` — icons (replaces Font Awesome from the reference; no CDN dependency).
- Certificate/admin data persistence: browser `localStorage` (no package).

## Architecture

Single-page app (anchor-scroll sections; no router needed). Content is data-driven so admin editing
and export work uniformly.

```
src/
  App.tsx                     # composes sections + global providers/overlays
  index.css                   # Tailwind import, @theme tokens, font @imports, keyframes
  data/portfolio.ts           # DEFAULT content (name, bio, education, experience, certs, projects, skills, socials)
  content/PortfolioContext.tsx# React context: merges defaults + localStorage overrides; admin state; save/export/import
  components/
    BootSequence.tsx          # one-time terminal boot loader (skippable, hard timeout)
    Atmosphere.tsx            # vignette + subtle scanlines + scroll progress bar (CSS/canvas, respects reduced-motion)
    Navbar.tsx                # sticky nav, anchor links, admin lock button, "Download CV"
    Hero.tsx                  # name (glitch), typed roles, stats, CTAs, orbital constellation w/ profile photo
    Marquee.tsx               # scrolling keyword band
    About.tsx  Education.tsx  Experience.tsx  Skills.tsx  Contact.tsx
    Certifications.tsx        # cert cards -> open SecureCertViewer
    LiveFeeds.tsx             # GitHub (live API) + LinkedIn (curated) panels
    SecureCertViewer.tsx      # locked overlay: watermark, deterrents, honest note
    admin/
      AdminGate.tsx           # PIN modal (PIN stored hashed in localStorage; default provided)
      AdminBar.tsx            # toggle inline-edit, open editor drawer, export/import JSON, logout
      Editable.tsx            # wrapper: double-click -> contentEditable text OR image file picker (admin only)
      EditorDrawer.tsx        # structured forms for adding/removing certs, projects, feed items, photo
  hooks/
    useReveal.ts              # IntersectionObserver reveal (or motion whileInView)
    useGitHubFeed.ts          # fetch https://api.github.com/users/{user}/events/public
```

### Content & editing model (the core of "double-click to edit")

- All displayed content flows from `PortfolioContext`, seeded by `data/portfolio.ts` and overlaid with
  `localStorage["portfolio_overrides"]`.
- `<Editable field="hero.name">` / `<Editable image field="profile.photo">` wrap editable nodes. When
  admin mode is ON, double-click makes text `contentEditable` (save on blur) or opens a file picker for
  images (stored as data URL). Both write back into context -> localStorage. Non-admins never get handlers.
- **Export/Import**: AdminBar "Export" downloads the overrides+content as a JSON file; "Import" reloads
  it. This is how the owner publishes changes to the live static site (edit locally -> export -> commit
  JSON / redeploy). Documented in the summary.
- PIN gate: default PIN in code, stored (hashed) after first set; `sessionStorage` marks an unlocked
  session. Reuse the reference's `portfolio_admin_auth` concept.

### Secure certificate viewer (honest deterrence)

Full-screen overlay showing the certificate image (uploaded by admin) or a rendered canvas fallback,
with:
- Diagonal tiled watermark: owner name + viewer timestamp + random session ID (traceability).
- `user-select:none`, `-webkit-touch-callout:none`, blocked `contextmenu` / `copy` / `cut` / `dragstart`.
- Blur the content on `blur` / `visibilitychange` (deters snip overlays & tab-away captures).
- `@media print { body { display:none } }` to defeat Ctrl+P / print-to-PDF.
- A small, honest footer line: watermarked & traced; a camera can still photograph any screen.
- Do NOT override canvas prototypes globally. Do NOT interlace.

### Animation inventory (motion + CSS, all `prefers-reduced-motion` aware)

Boot terminal; hero name glitch; typed role cycle; dual-orbit constellation with counter-rotating,
legible badges; keyword marquee; magnetic buttons; section scroll-reveals; live "pulse" dots; scroll
progress bar; hover lifts on cards.

## SEO / visibility (24/7 + attraction — the coach deliverable)

- `index.html` head: title, meta description, Open Graph + Twitter card tags, `theme-color #0d2b1f`,
  canonical URL, JSON-LD `Person` schema (name, jobTitle, alumniOf, sameAs: GitHub/LinkedIn).
- Keep/port `robots.txt` + `sitemap.xml` from `src/imports/`.
- Optional PWA service worker (`sw.js` exists in imports) for offline/repeat-visit speed — include if
  it doesn't fight Vite's build; otherwise defer.
- Deployment guidance (summary, not code): GitHub Pages or Cloudflare/Vercel/Netlify static hosting;
  add OG preview image; pin link in LinkedIn Featured + GitHub profile README; Google Search Console.

## Files to create / modify

- **Modify**: `src/App.tsx` (compose app), `src/index.css` (tokens/fonts/keyframes), `index.html`
  (SEO/meta/JSON-LD), `package.json` (add `motion`, `lucide-react`).
- **Create**: everything under `src/components`, `src/content`, `src/data`, `src/hooks` above.
- **Reuse for content**: `src/imports/index.html` (copy for bio, education, experience, cert titles,
  stats like M.Sc CGPA 10.0, CSIR-NGRI), `src/imports/robots.txt` + `sitemap.xml`.

## Verification

1. `pnpm dev` already runs on `$PORT`; open preview and confirm no console errors.
2. Manual pass: boot sequence -> skip works; all sections render with content; orbital badges stay
   horizontal & legible; scroll reveals fire; reduced-motion disables heavy effects.
3. GitHub feed: set the real username; confirm live events load and the empty/error states render.
4. Admin flow: enter PIN -> toggle inline edit -> double-click a heading (edit + persist across reload)
   -> double-click the profile photo (replace) -> Export JSON -> clear storage -> Import JSON (restored).
5. Certificate viewer: opens locked; right-click/copy blocked; blur-on-tab-away; print yields blank;
   watermark shows session id + timestamp.
6. LinkedIn icon links out to the profile in a new tab.
7. Lighthouse quick check for SEO tags / meta presence.

## Open follow-ups to confirm during/after build

- Real GitHub username + LinkedIn URL (brief shows `akshitvinay` and a LinkedIn slug — confirm).
- Actual certificate image files vs. rendered placeholders.
- Whether to include the PWA service worker now or later.
