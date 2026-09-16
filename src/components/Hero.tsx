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

        <div className="mb-2.5 flex items-center gap-2 font-mono text-sm tracking-widest text-neon uppercase">
          <span className="inline-block h-1.5 w-6 rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
          <span>HELLO I AM</span>
        </div>

        {/*
         * The owner's name is the page's main heading, so it is a real <h1>.
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

      {/* Right: orbital constellation with vibrant profile photo backdrop */}
      <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
        {/* ambient cyber-glow behind photo */}
        <div className="pointer-events-none absolute inset-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,255,200,0.18)_0%,rgba(13,43,31,0.25)_45%,transparent_70%)] blur-2xl" />

        {/* orbit rings */}
        <div className="absolute inset-0 rounded-full border border-hair/80" />
        <div className="absolute inset-[12%] rounded-full border border-neon/15" />
        <div className="absolute inset-[24%] rounded-full border border-gold/15" />

        {/* outer orbit — clockwise, pauses smoothly on hover */}
        <div className="absolute inset-0 animate-orbit hover:[animation-play-state:paused]">
          {ORBIT_BADGES.slice(0, 2).map((b, i) => (
            <OrbitBadge key={b.label} badge={b} angle={i * 180} />
          ))}
        </div>
        {/* inner orbit — counter-clockwise, pauses smoothly on hover */}
        <div className="absolute inset-[12%] animate-orbit-rev hover:[animation-play-state:paused]">
          {ORBIT_BADGES.slice(2).map((b, i) => (
            <OrbitBadge key={b.label} badge={b} angle={90 + i * 180} reverse />
          ))}
        </div>

        {/* photo core with luminous gradient aura and crisp backdrop */}
        <div className="relative h-[60%] w-[60%] rounded-full p-[3px] bg-gradient-to-tr from-neon/60 via-gold/40 to-neon/40 shadow-[0_0_70px_rgba(0,255,200,0.3),0_10px_30px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02]">
          <div className="relative h-full w-full overflow-hidden rounded-full border border-neon/30 bg-[radial-gradient(ellipse_at_50%_35%,#174233_0%,#0c2b20_55%,#04120c_100%)]">
            <Editable
              field="profile.photo"
              image
              alt={data.profile.name}
              className="h-full w-full object-cover select-none filter contrast-[1.03] brightness-[1.03]"
            />
          </div>
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
      className="group/badge absolute left-1/2 top-1/2 cursor-pointer"
      style={{ transform: `rotate(${angle}deg) translateY(-50%)`, transformOrigin: '0 0' }}
    >
      {/* counter-rotate the badge so it stays upright & legible */}
      <div
        className={reverse ? 'animate-orbit' : 'animate-orbit-rev'}
        style={{ transform: `translate(-50%, 0)` }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-neon/30 bg-abyss/95 px-3 py-1.5 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover/badge:scale-115 group-hover/badge:border-neon group-hover/badge:shadow-[0_0_20px_rgba(0,255,200,0.4)]">
          <Icon width={14} height={14} className="text-neon transition-colors group-hover/badge:text-gold" />
          <span className="font-mono text-[10px] tracking-widest text-ink group-hover/badge:text-neon">{badge.label}</span>
        </div>
      </div>
    </div>
  );
}
