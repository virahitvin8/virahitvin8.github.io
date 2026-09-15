import { useEffect, useState } from 'react';

const LINES = [
  ['> N.AV // PORTFOLIO OS', 'v20.80'],
  ['> booting geospatial core', 'OK'],
  ['> linking satellite constellation', 'OK'],
  ['> calibrating NDVI shaders', 'OK'],
  ['> decrypting credential vault', 'OK'],
  ['> welcome, visitor', 'READY'],
] as const;

const SESSION_FLAG = 'portfolio_booted';

export function BootSequence() {
  // Only show once per tab session so it never nags returning scrolls.
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_FLAG));
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      finish();
      return;
    }
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= LINES.length) {
        window.clearInterval(tick);
        window.setTimeout(finish, 550);
      }
    }, 340);
    const hardStop = window.setTimeout(finish, 6000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(hardStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function finish() {
    sessionStorage.setItem(SESSION_FLAG, '1');
    setDone(true);
    document.body.style.overflow = '';
    window.setTimeout(() => setVisible(false), 750);
  }

  if (!visible) return null;

  const pct = Math.round((shown / LINES.length) * 100);

  return (
    <div
      className={`fixed inset-0 z-[10090] flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,#04160f,#020a07_70%)] transition-opacity duration-700 ${
        done ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-[min(560px,88vw)] font-mono text-neon">
        {LINES.map((l, i) => (
          <div
            key={i}
            className={`my-1.5 text-sm tracking-wide transition-all duration-300 ${
              i < shown ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
            }`}
            style={{ textShadow: '0 0 10px var(--neon-soft)' }}
          >
            {l[0]} <span className="text-gold">{'.'.repeat(Math.max(0, 34 - l[0].length))}</span>{' '}
            <span className="text-gold-light">[{l[1]}]</span>
          </div>
        ))}
        <div className="mt-5 h-[5px] border border-neon/30 bg-neon/10">
          <div
            className="h-full bg-gradient-to-r from-neon to-gold transition-[width] duration-200"
            style={{ width: `${pct}%`, boxShadow: '0 0 14px var(--neon-soft)' }}
          />
        </div>
      </div>
      <button
        onClick={finish}
        className="absolute bottom-7 right-7 rounded border border-white/15 px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-faint transition hover:border-neon hover:text-neon"
      >
        SKIP ▸▸
      </button>
    </div>
  );
}
