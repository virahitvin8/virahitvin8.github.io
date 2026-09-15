# Certificate scans (classic build)

**Do not put files here by hand.** Scans are authored in **`/certificates/`** at
the repository root — see [`certificates/README.md`](../../../certificates/README.md)
for the exact file name of each certificate.

Scans are kept in one place because the two builds would otherwise need two
copies of the same six images, which drift apart. On deploy, the workflow copies
them from the built site into this folder so `/classic/` finds them too.

For a **standalone local test** of just the classic build, copy them across
yourself before serving:

```bash
cp -R ../public/certs/. assets/certs/     # run from portfolio/
python3 -m http.server 8000
```

## How this build finds a scan

For each certificate it tries, in order:

1. `data-cert-img` on the card (an explicit path or `https://` URL)
2. an image uploaded through 🔒 lock → **2080 Core** → *Certificate Scans*
   (stored per-browser in `localStorage`) — note this is private to your browser,
   so export the site to publish it
3. a path saved in **2080 Core** for that certificate
4. this folder, as `<slug>.png`, then `.jpg`, `.jpeg`, `.webp`

Nothing found is a normal state: a generated certificate of record is rendered
instead, so a card is never a broken image.

The slugs are the same ones the React build uses, so **one file serves both**.
The 2080 Core panel reports `scan on disk` when it finds a file here, so what the
panel says and what the viewer shows cannot disagree.
