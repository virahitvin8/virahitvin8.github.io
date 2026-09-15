import { useEffect, useState } from 'react';

/** Ambient layer: aurora field, vignette, fine scanlines, and a scroll-progress rail. */
export function Atmosphere() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Fixed cosmic ground */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-1/4 top-[-20%] h-[70vh] w-[70vh] rounded-full opacity-60 blur-[120px] animate-float"
          style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.55), transparent 70%)' }}
        />
        <div
          className="absolute -right-1/4 top-[30%] h-[60vh] w-[60vh] rounded-full opacity-50 blur-[130px] animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,200,0.22), transparent 70%)',
            animationDelay: '2.5s',
          }}
        />
        <div
          className="absolute bottom-[-15%] left-1/3 h-[55vh] w-[55vh] rounded-full opacity-40 blur-[120px] animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)',
            animationDelay: '4s',
          }}
        />
        {/* starfield dots */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 20% 30%, rgba(245,242,232,0.5), transparent), radial-gradient(1px 1px at 70% 60%, rgba(245,242,232,0.4), transparent), radial-gradient(1px 1px at 40% 80%, rgba(0,255,200,0.4), transparent), radial-gradient(1px 1px at 85% 20%, rgba(245,242,232,0.35), transparent)',
            backgroundSize: '340px 340px, 280px 280px, 400px 400px, 220px 220px',
          }}
        />
        {/* scanlines */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)',
          }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 45%, #020a07 100%)' }}
        />
      </div>

      {/* scroll progress rail */}
      <div className="fixed left-0 top-0 z-[10000] h-[3px] w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-sage via-neon to-gold transition-[width] duration-150"
          style={{ width: `${progress}%`, boxShadow: '0 0 12px var(--neon-soft)' }}
        />
      </div>
    </>
  );
}
