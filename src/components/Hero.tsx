import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Mail,
  MapPin,
  Satellite,
  Shield,
  Sprout,
  Compass,
} from "./icons"

const ORBIT_BADGES = [
  { icon: Sprout, label: "B.Sc (Hons) Agri", alt: "0m Soil" },
  { icon: Compass, label: "Drone / UAV", alt: "120m Aerial" },
  { icon: Shield, label: "GIS Watershed", alt: "3,500m Terrain" },
  { icon: Satellite, label: "CSIR-NGRI Remote Sensing", alt: "705km Orbit" },
]

export function Hero() {
  const { data } = usePortfolio()
  const [roleIndex, setRoleIndex] = useState(0)
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setRoleIndex((i) => (i + 1) % data.profile.roles.length)
    }, 3200)
    return () => clearInterval(t)
  }, [data.profile.roles.length])

  return (
    <section
      id="top"
      className="zone-ground relative overflow-hidden px-6 pt-24 pb-12 lg:px-10 lg:pt-32 lg:pb-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left column (7 cols) */}
        <div className="flex flex-col lg:col-span-7">
          {/* Trajectory Badge */}
          <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              B.Sc (Hons) Agriculture Graduate → M.Sc Remote Sensing &amp; GIS
            </span>
          </div>

          <h1
            ref={nameRef}
            className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl"
          >
            <Editable field="profile.name" />
          </h1>

          {/* Dynamic rotating roles */}
          <div className="mt-3 flex h-7 items-center gap-2 font-mono text-sm font-bold text-primary-light">
            <span className="text-gold">✦</span>
            <span className="transition-all duration-300">
              {data.profile.roles[roleIndex]}
            </span>
          </div>

          {/* Explicit Core Academic Background */}
          <div className="mt-5 rounded-xl border border-primary/15 bg-white/80 p-4 shadow-xs backdrop-blur-xs">
            <p className="text-sm leading-relaxed text-mist">
              <strong className="text-primary font-bold">Academic Foundation &amp; Trajectory: </strong>
              Graduated with <span className="font-semibold text-primary">B.Sc (Hons) Agriculture</span> (ICAR accredited, 8.78 GPA) with rigorous training in agronomy, soil chemistry, and crop diagnostics; currently advancing in <span className="font-semibold text-primary">M.Sc Remote Sensing &amp; GIS</span> (10.0 CGPA) with specialized training at <span className="font-semibold text-primary">CSIR-NGRI</span>. Transforming ground-level crop reality into orbital precision intelligence.
            </p>
          </div>

          {/* Location & Availability Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-mist">
            <span className="flex items-center gap-1.5 rounded-md bg-primary/[0.06] px-2.5 py-1 text-primary">
              <MapPin width={14} height={14} />
              <Editable field="profile.location" />
            </span>
            <span className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <Editable field="profile.availability" />
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-4 gap-2 rounded-xl border border-primary/10 bg-white/90 p-3 shadow-sm text-center">
            {data.stats.map((s, idx) => (
              <div key={idx} className="flex flex-col border-r border-primary/10 last:border-r-0">
                <span className="font-display text-lg font-bold text-primary sm:text-xl">
                  {s.value}
                </span>
                <span className="font-mono text-[10px] text-faint uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-light hover:shadow-lg"
            >
              Explore Projects
              <ArrowDown width={15} height={15} />
            </a>
            <a
              href={data.profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-xs transition hover:bg-primary hover:text-white"
            >
              <Download width={15} height={15} />
              Download CV
            </a>
            <a
              href={`mailto:${data.profile.email}`}
              className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold-light transition hover:bg-gold hover:text-white"
            >
              <Mail width={15} height={15} />
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right column: Interactive Profile Frame with Agriculture-to-Orbit halo (5 cols) */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center lg:col-span-5">
          {/* Sunlit ambient glow behind portrait */}
          <div className="pointer-events-none absolute inset-3 rounded-full bg-gradient-to-tr from-emerald-200/40 via-amber-100/50 to-teal-100/40 blur-2xl" />

          {/* Orbital rings with light styling */}
          <div className="absolute inset-0 rounded-full border border-primary/15" />
          <div className="absolute inset-[12%] rounded-full border border-dashed border-emerald-600/20" />
          <div className="absolute inset-[24%] rounded-full border border-primary/10" />

          {/* Outer Orbit — Clockwise */}
          <div className="absolute inset-0 animate-orbit hover:[animation-play-state:paused]">
            {ORBIT_BADGES.slice(0, 2).map((b, i) => (
              <OrbitBadge key={b.label} badge={b} angle={i * 180} />
            ))}
          </div>

          {/* Inner Orbit — Counter-clockwise */}
          <div className="absolute inset-[12%] animate-orbit-rev hover:[animation-play-state:paused]">
            {ORBIT_BADGES.slice(2).map((b, i) => (
              <OrbitBadge key={b.label} badge={b} angle={90 + i * 180} reverse />
            ))}
          </div>

          {/* Portrait Photo Core: uses resume formal picture */}
          <div className="relative h-[62%] w-[62%] rounded-full p-1.5 bg-gradient-to-tr from-emerald-600 via-gold to-teal-500 shadow-xl transition-transform duration-500 hover:scale-[1.03]">
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-white">
              <Editable
                field="profile.photo"
                image
                alt={data.profile.name}
                className="h-full w-full object-cover select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OrbitBadge({
  badge,
  angle,
  reverse,
}: {
  badge: { icon: typeof Satellite; label: string; alt: string }
  angle: number
  reverse?: boolean
}) {
  const Icon = badge.icon
  return (
    <div
      className="group/badge absolute left-1/2 top-1/2 cursor-pointer"
      style={{ transform: `rotate(${angle}deg) translateY(-50%)`, transformOrigin: "0 0" }}
    >
      {/* counter-rotate badge so it stays upright & readable */}
      <div
        className={reverse ? "animate-orbit" : "animate-orbit-rev"}
        style={{ transform: `translate(-50%, 0)` }}
      >
        <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/95 px-3 py-1 shadow-md backdrop-blur-md transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:border-primary group-hover/badge:shadow-lg">
          <Icon width={13} height={13} className="text-primary transition-colors group-hover/badge:text-gold" />
          <span className="font-mono text-[10px] font-bold text-primary whitespace-nowrap">
            {badge.label}
          </span>
        </div>
      </div>
    </div>
  )
}
