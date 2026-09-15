import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../content/PortfolioContext';
import { Editable } from './admin/Editable';
import { ArrowUpRight, Github, Linkedin, MapPin, Satellite, Leaf, Drone, Map } from './icons';

const ORBIT_BADGES = [
  { icon: Satellite, label: 'EO' },
  { icon: Leaf, label: 'AGRI' },
  { icon: Map, label: 'GIS' },
  { icon: Drone, label: 'UAV' },
];

function useTypedRoles(roles: string[]) {
  const [text, setText] = useState('');
  const idx = useRef(0);
  const char = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(roles[0] ?? '');
      return;
    }
    let timer: number;
    const tick = () => {
      const full = roles[idx.current % roles.length] ?? '';
      if (!deleting.current) {
        char.current += 1;
        setText(full.slice(0, char.current));
        if (char.current >= full.length) {
          deleting.current = true;
          timer = window.setTimeout(tick, 1600);
          return;
        }
      } else {
        char.current -= 1;
        setText(full.slice(0, char.current));
        if (char.current <= 0) {
          deleting.current = false;
          idx.current += 1;
        }
      }
      timer = window.setTimeout(tick, deleting.current ? 45 : 85);
    };
    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [roles]);

  return text;
}

export function Hero() {
  const { data } = usePortfolio();
  const typed = useTypedRoles(data.profile.roles);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [glitching, setGlitching] = useState(false);

  // Occasional glitch burst on the name.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const iv = window.setInterval(() => {
      setGlitching(true);
      window.setTimeout(() => setGlitching(false), 320);
    }, 5200);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:pt-44">
      {/* Left: copy */}
      <div className="reveal">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-hair bg-neon/5 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-neon opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
          </span>
          <Editable field="profile.availability" className="hud-label !text-sage-light" />
        </div>

        {/*
         * The owner's name is the page's main heading, so it is a real <h1>.
         * It used to be a styled <div>, which left the document with no h1 at
         * all — every section title was an h2 — costing the strongest on-page
         * signal for search engines and breaking heading navigation in screen
         * readers. The glitch effect keys off [data-text], so it is unaffected.
         */}
        <h1
          ref={nameRef}
          data-text={data.profile.name}
          className={`glitch font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl ${
            glitching ? 'glitching' : ''
          }`}
        >
          <Editable field="profile.name" as="span" className="text-glow-neon" />
        </h1>

        <p className="mt-5 font-mono text-lg text-neon lg:text-xl">
          {typed}
          <span className="ml-0.5 inline-block w-[2px] animate-pulse-dot bg-neon align-middle" style={{ height: '1.1em' }} />
        </p>

        <Editable
          field="profile.tagline"
          as="p"
          multiline
          className="mt-6 max-w-xl text-base leading-relaxed text-mist lg:text-lg"
        />

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group flex items-center gap-2 rounded-full bg-neon px-7 py-3.5 font-semibold text-void transition hover:bg-sage-light hover:shadow-[0_0_30px_var(--neon-soft)]"
          >
            Explore the work
            <ArrowUpRight width={18} height={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#contact"
            className="rounded-full border border-hair px-7 py-3.5 font-medium text-ink transition hover:border-neon hover:text-neon"
          >
            Get in touch
          </a>
          <div className="flex items-center gap-3">
            <a href={data.social.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-full border border-hair text-mist transition hover:border-neon hover:text-neon">
              <Github width={18} height={18} />
            </a>
            <a href={data.social.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-full border border-hair text-mist transition hover:border-gold hover:text-gold">
              <Linkedin width={18} height={18} />
            </a>
          </div>
        </div>

        <div className="mt-9 flex items-center gap-2 text-sm text-faint">
          <MapPin width={15} height={15} className="text-sage" />
          <Editable field="profile.location" />
        </div>
      </div>

      {/* Right: orbital constellation with editable profile photo */}
      <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
        {/* orbit rings */}
        <div className="absolute inset-0 rounded-full border border-hair" />
        <div className="absolute inset-[12%] rounded-full border border-neon/10" />
        <div className="absolute inset-[24%] rounded-full border border-gold/10" />

        {/* outer orbit — clockwise */}
        <div className="absolute inset-0 animate-orbit">
          {ORBIT_BADGES.slice(0, 2).map((b, i) => (
            <OrbitBadge key={b.label} badge={b} angle={i * 180} />
          ))}
        </div>
        {/* inner orbit — counter-clockwise */}
        <div className="absolute inset-[12%] animate-orbit-rev">
          {ORBIT_BADGES.slice(2).map((b, i) => (
            <OrbitBadge key={b.label} badge={b} angle={90 + i * 180} reverse />
          ))}
        </div>

        {/* photo core */}
        <div className="relative h-[56%] w-[56%] overflow-hidden rounded-full border-2 border-neon/30 shadow-[0_0_60px_rgba(0,255,200,0.2)]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
          <Editable
            field="profile.photo"
            image
            alt={data.profile.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function OrbitBadge({
  badge,
  angle,
  reverse,
}: {
  badge: { icon: typeof Satellite; label: string };
  angle: number;
  reverse?: boolean;
}) {
  const Icon = badge.icon;
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `rotate(${angle}deg) translateY(-50%)`, transformOrigin: '0 0' }}
    >
      {/* counter-rotate the badge so it stays upright & legible */}
      <div
        className={reverse ? 'animate-orbit' : 'animate-orbit-rev'}
        style={{ transform: `translate(-50%, 0)` }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-neon/30 bg-abyss/90 px-3 py-1.5 backdrop-blur">
          <Icon width={14} height={14} className="text-neon" />
          <span className="font-mono text-[10px] tracking-widest text-ink">{badge.label}</span>
        </div>
      </div>
    </div>
  );
}
