import { useEffect, useState } from 'react';
import type { Certification } from '../data/portfolio';

/**
 * Where certificate scans live when dropped in as files.
 *
 * `public/certs/` is served at the site root by Vite, so this resolves the same
 * way in `npm run dev`, in `npm run preview` and on GitHub Pages. The classic
 * build reads its own `assets/certs/`; the deploy workflow copies this folder
 * across so one set of files serves both.
 */
export const CERT_DIR = '/certs/';

/** Probe order, matching the classic build so the same file wins in both. */
const EXTS = ['png', 'jpg', 'jpeg', 'webp'];

/**
 * Turn a certificate title into a filename stem.
 *
 * Deliberately identical to the classic build's slugify(): a scan named after
 * the certificate resolves in `/` and `/classic/` alike. Used only as a
 * fallback for certificates whose explicit `slug` is not set.
 */
export function slugifyCert(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Resolve `true` only if the browser can actually decode the file. */
function canLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export interface CertImage {
  /** The scan to display, or null when the certificate has none. */
  src: string | null;
  /** True while `public/certs/` is still being probed. */
  pending: boolean;
}

/**
 * Resolve the scan for a certificate.
 *
 * Order: an admin-pinned `image`, then the first matching file in
 * `public/certs/`. Finding nothing is a normal state — the viewer renders a
 * certificate of record instead, so a missing scan never shows a broken image.
 *
 * `pending` matters because the probe is up to four sequential network
 * requests: without it the fallback certificate would flash on screen and then
 * be replaced by the real scan, which reads as a glitch.
 */
export function useCertImage(cert: Certification | null): CertImage {
  const [src, setSrc] = useState<string | null>(cert?.image ?? null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!cert) {
      setSrc(null);
      setPending(false);
      return;
    }
    if (cert.image) {
      setSrc(cert.image);
      setPending(false);
      return;
    }

    const stem = cert.slug || slugifyCert(cert.title);
    if (!stem) {
      setSrc(null);
      setPending(false);
      return;
    }

    let cancelled = false;
    setSrc(null);
    setPending(true);

    (async () => {
      for (const ext of EXTS) {
        const url = `${CERT_DIR}${stem}.${ext}`;
        const ok = await canLoad(url);
        if (cancelled) return;
        if (ok) {
          setSrc(url);
          setPending(false);
          return;
        }
      }
      if (cancelled) return;
      setPending(false); // no scan on disk — the caller renders the fallback
    })();

    return () => {
      cancelled = true;
    };
  }, [cert?.id, cert?.image, cert?.slug, cert?.title]);

  return { src, pending };
}
