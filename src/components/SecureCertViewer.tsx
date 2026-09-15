import { useEffect, useMemo, useState } from 'react';
import { usePortfolio } from '../content/PortfolioContext';
import type { Certification } from '../data/portfolio';
import { CERT_DIR, useCertImage } from '../hooks/useCertImage';
import { Shield, X } from './icons';

export function SecureCertViewer({
  cert,
  onClose,
}: {
  cert: Certification | null;
  onClose: () => void;
}) {
  const { data } = usePortfolio();
  const [obscured, setObscured] = useState(false);
  // A scan that exists but cannot be decoded falls back like a missing one,
  // so a corrupt or half-copied file never renders as a broken image.
  const [failed, setFailed] = useState(false);
  const { src, pending } = useCertImage(cert);

  useEffect(() => setFailed(false), [cert?.id]);
  const sessionId = useMemo(
    () => Math.random().toString(36).slice(2, 8).toUpperCase(),
    // regenerate per opened cert
    [cert?.id],
  );
  const stamp = useMemo(() => new Date().toLocaleString(), [cert?.id]);

  useEffect(() => {
    if (!cert) return;
    document.body.classList.add('secure-open');

    const block = (e: Event) => e.preventDefault();
    const onVis = () => setObscured(document.hidden);
    const onBlur = () => setObscured(true);
    const onFocus = () => setObscured(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // best-effort deterrents for print / save
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'PrintScreen') setObscured(true);
    };

    document.addEventListener('contextmenu', block);
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('dragstart', block);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.classList.remove('secure-open');
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('dragstart', block);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('keydown', onKey);
    };
  }, [cert, onClose]);

  if (!cert) return null;

  const watermark = `${data.profile.name} · ${sessionId} · VIEW ONLY`;

  return (
    <div className="secure-lock fixed inset-0 z-[10080] flex items-center justify-center bg-void/95 px-4 backdrop-blur-2xl">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-hair text-mist transition hover:border-neon hover:text-neon"
        aria-label="Close"
      >
        <X />
      </button>

      <div className="relative w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-center gap-2 text-sage-light">
          <Shield width={16} height={16} />
          <span className="hud-label !text-sage-light">Protected Credential</span>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl border border-neon/25 bg-abyss transition-all duration-300 ${
            obscured ? 'blur-3xl grayscale' : ''
          }`}
        >
          {/* watermark tiles */}
          <div
            className="pointer-events-none absolute inset-0 z-10 flex flex-wrap content-center gap-y-20 opacity-[0.16]"
            style={{ transform: 'rotate(-24deg) scale(1.4)' }}
          >
            {Array.from({ length: 26 }).map((_, i) => (
              <span key={i} className="whitespace-nowrap px-6 font-mono text-xs tracking-widest text-neon">
                {watermark}
              </span>
            ))}
          </div>

          {src && !failed ? (
            <img
              src={src}
              alt={`${cert.title} — ${cert.issuer}`}
              draggable={false}
              onError={() => setFailed(true)}
              /* A certificate photographed on a phone is portrait. Sizing by
                 width alone made it taller than the viewport, with body
                 scrolling locked, so the bottom was unreachable. */
              className="relative z-0 mx-auto block max-h-[calc(100dvh-9rem)] w-auto max-w-full select-none object-contain"
            />
          ) : (
            <div className="relative z-0 flex aspect-[1.414/1] flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,#0d2b1f,#04120c)] p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/40 text-gold">
                <Shield width={26} height={26} />
              </div>
              <p className="hud-label !text-gold">Certificate of Record</p>
              <h3 className="max-w-lg font-display text-2xl text-ink">{cert.title}</h3>
              <p className="text-sm text-sage-light">{cert.issuer}</p>
              <p className="font-mono text-xs text-faint">{cert.date}</p>
              <p className="mt-2 max-w-md text-xs text-mist">{cert.blurb}</p>
              <p className="mt-6 text-[11px] text-faint">
                {pending ? (
                  'Retrieving original document…'
                ) : failed ? (
                  'The scan could not be displayed — the original is held on file.'
                ) : (
                  <>
                    Original document available on request — the owner can attach the scan at{' '}
                    <code className="font-mono text-neon/80">{CERT_DIR}{cert.slug || 'slug'}.png</code>
                  </>
                )}
              </p>
            </div>
          )}

          {obscured && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-void/70">
              <p className="font-mono text-sm text-neon">Preview hidden — return focus to view.</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-faint">
          This credential is watermarked with a unique session ID ({sessionId}) and opened at {stamp}.
          Copy, right-click, drag and print are disabled and the view auto-hides when you switch away.
          Honest note: no browser can fully stop a phone camera — sharing is traceable, not impossible.
        </p>
      </div>
    </div>
  );
}
