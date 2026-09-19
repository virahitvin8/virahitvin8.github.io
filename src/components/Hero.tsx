import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import { playSound } from "./SoundFX"
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
  Command,
  Sparkle,
} from "./icons"

const ORBIT_BADGES = [
  { icon: Sprout, label: "B.Sc (Hons) Agri", alt: "0m Ground Soil" },
  { icon: Compass, label: "Drone / UAV", alt: "120m Aerial Survey" },
  { icon: Shield, label: "GIS Watershed", alt: "3,500m Terrain Controls" },
  { icon: Satellite, label: "CSIR-NGRI Remote Sensing", alt: "705km Space Orbit" },
]

export function Hero() {
  const { data, soundEnabled, setCommandPaletteOpen } = usePortfolio()
  const [roleIndex, setRoleIndex] = useState(0)
  const [visualMode, setVisualMode] = useState<"terrain" | "portrait">("portrait")
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
      className="zone-ground relative overflow-hidden px-6 pt-24 pb-14 lg:px-10 lg:pt-32 lg:pb-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left column (7 cols) */}
        <div className="flex flex-col lg:col-span-7">
          {/* ASTRA Trajectory Eyebrow */}
          <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              N. Akshit Vinay &bull; ASTRA Research Portfolio
            </span>
          </div>

          <h1
            ref={nameRef}
            className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl"
          >
            <Editable field="profile.name" />
          </h1>

          {/* ASTRA Hero Headline */}
          <div className="mt-2 font-display text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl leading-tight">
            Grounded in soil. Looking <em className="not-italic text-gold">beyond Earth.</em>
          </div>

          {/* Dynamic rotating roles */}
          <div className="mt-2 flex h-7 items-center gap-2 font-mono text-sm font-bold text-primary-light">
            <span className="text-gold">✦</span>
            <span className="transition-all duration-300">
              {data.profile.roles[roleIndex]}
            </span>
          </div>

          {/* Lead description from prototype */}
          <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-mist">
            Connecting crop agronomy, drone multispectral photogrammetry, and satellite remote sensing to understand landscapes and support more precise agriculture.
          </p>

          {/* Domain Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold text-primary-light uppercase tracking-wider">
            <span className="rounded-md border border-hair bg-card-bg px-2.5 py-1 text-primary shadow-2xs">
              AGRONOMY
            </span>
            <span className="text-faint">/</span>
            <span className="rounded-md border border-hair bg-card-bg px-2.5 py-1 text-primary shadow-2xs">
              GIS &amp; HYDROLOGY
            </span>
            <span className="text-faint">/</span>
            <span className="rounded-md border border-hair bg-card-bg px-2.5 py-1 text-primary shadow-2xs">
              UAV MULTISPECTRAL
            </span>
          </div>

          {/* Location & Availability Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-mist">
            <span className="flex items-center gap-1.5 rounded-xl bg-primary/[0.06] border border-hair px-3 py-1 text-primary">
              <MapPin width={14} height={14} />
              <Editable field="profile.location" />
            </span>
            <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <Editable field="profile.availability" />
            </span>
          </div>

          {/* ASTRA 3-Stat Strip */}
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 rounded-2xl border border-hair bg-card-bg p-3.5 sm:p-4 shadow-sm text-left">
            <div className="flex flex-col border-r border-hair pr-2 sm:pr-4">
              <strong className="font-display text-lg sm:text-2xl font-black text-primary">
                10.0 CGPA
              </strong>
              <span className="font-mono text-[10px] sm:text-xs text-mist leading-snug">
                M.Sc Remote Sensing &amp; GIS · SHUATS
              </span>
            </div>
            <div className="flex flex-col border-r border-hair pr-2 sm:pr-4">
              <strong className="font-display text-lg sm:text-2xl font-black text-primary">
                8.78 GPA
              </strong>
              <span className="font-mono text-[10px] sm:text-xs text-mist leading-snug">
                B.Sc (Hons) Agri · ICAR Accredited
              </span>
            </div>
            <div className="flex flex-col">
              <strong className="font-display text-lg sm:text-2xl font-black text-gold">
                CSIR–NGRI
              </strong>
              <span className="font-mono text-[10px] sm:text-xs text-mist leading-snug">
                Earth Surface Processes Training
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={() => playSound("whoosh", soundEnabled)}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-light hover:shadow-lg"
            >
              <span>Explore Research</span>
              <ArrowDown width={15} height={15} />
            </a>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-copilot"))
                playSound("blip", soundEnabled)
              }}
              className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs transition hover:bg-emerald-500 hover:text-white"
            >
              <Sparkle width={15} height={15} />
              <span>✦ Ask Akshit</span>
            </button>

            <a
              href={data.profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => playSound("click", soundEnabled)}
              className="flex items-center gap-2 rounded-full border border-hair bg-card-bg px-5 py-2.5 text-sm font-semibold text-primary shadow-xs transition hover:bg-primary hover:text-white"
            >
              <Download width={15} height={15} />
              <span>Download CV</span>
            </a>

            <button
              onClick={() => {
                setCommandPaletteOpen(true)
                playSound("whoosh", soundEnabled)
              }}
              className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.05] px-4 py-2.5 text-sm font-mono text-mist hover:text-ink hover:border-primary transition"
            >
              <Command width={14} height={14} className="text-primary" />
              <span className="text-xs font-semibold">Cmd+K</span>
            </button>

            <a
              href="#contact"
              onClick={() => playSound("click", soundEnabled)}
              className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
            >
              <Mail width={15} height={15} />
              <span>Get in Touch</span>
            </a>
          </div>
        </div>

        {/* Right column: Interactive Dual-Mode Visual Container (5 cols) */}
        <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center lg:col-span-5">
          {/* Mode Switcher Pills */}
          <div className="mb-3 flex items-center gap-1 rounded-full border border-hair bg-card-bg p-1 shadow-xs font-mono text-[11px]">
            <button
              onClick={() => {
                setVisualMode("portrait")
                playSound("click", soundEnabled)
              }}
              className={`rounded-full px-3 py-1 transition ${
                visualMode === "portrait"
                  ? "bg-primary text-white font-bold shadow-xs"
                  : "text-mist hover:text-ink"
              }`}
            >
              🛰️ Satellite Orbit
            </button>
            <button
              onClick={() => {
                setVisualMode("terrain")
                playSound("click", soundEnabled)
              }}
              className={`rounded-full px-3 py-1 transition ${
                visualMode === "terrain"
                  ? "bg-primary text-white font-bold shadow-xs"
                  : "text-mist hover:text-ink"
              }`}
            >
              🏔️ 3D Contour Terrain
            </button>
          </div>

          {/* Visual Container */}
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-hair bg-card-bg/80 p-6 shadow-2xl backdrop-blur-xl">
            {/* Ambient luminous glow */}
            <div className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-amber-500/20 blur-3xl" />

            {visualMode === "terrain" ? (
              /* ASTRA 3D Isometric Contour Scene */
              <div
                className="relative flex h-full w-full flex-col items-center justify-center"
                role="img"
                aria-label="Abstract contour terrain illustration representing spatial intelligence"
              >
                {/* Top Label */}
                <div className="absolute top-1 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-mist">
                  <span className="font-bold text-emerald-500 tracking-wider">
                    SPATIAL INTELLIGENCE / CONCEPT VIEW
                  </span>
                  <span className="rounded-full border border-hair px-2 py-0.2">
                    ELEV. 0m &rarr; 705km
                  </span>
                </div>

                {/* Concentric orbital rings */}
                <div className="pointer-events-none absolute h-[290px] w-[290px] rounded-full border border-line" />
                <div className="pointer-events-none absolute h-[200px] w-[200px] rounded-full border border-dashed border-emerald-500/30" />

                {/* 3D Isometric Contour Terrain Tile */}
                <div
                  className="relative z-10 h-[175px] w-[175px] rounded-2xl border border-emerald-400/80 transition-transform duration-500 hover:scale-105"
                  style={{
                    transform: "rotate(-30deg) skew(12deg, 12deg)",
                    background:
                      "repeating-radial-gradient(ellipse at 30% 70%, transparent 0 11px, rgba(189, 251, 133, 0.45) 12px 13px, transparent 14px 22px), #1e3826",
                    boxShadow: "-14px 18px 0 #14281b, -28px 36px 0 #0d1a12",
                  }}
                >
                  <div className="absolute top-2 left-2 font-mono text-[8px] font-bold text-emerald-300">
                    82°E, 14°N
                  </div>
                  <div className="absolute bottom-2 right-2 font-mono text-[8px] font-bold text-emerald-400/90">
                    CONTOUR Δ5m
                  </div>
                </div>

                {/* Bottom Foot */}
                <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between font-mono text-[10px] text-faint">
                  <span className="font-semibold text-emerald-500">GROUND → AERIAL → SPACE</span>
                  <span>ILLUSTRATIVE TERRAIN</span>
                </div>
              </div>
            ) : (
              /* Satellite Orbital Rings with Akshit's Verified Portrait */
              <div className="relative flex h-full w-full items-center justify-center">
                {/* Orbital rings with responsive styling */}
                <div className="absolute inset-0 rounded-full border border-primary/20" />
                <div className="absolute inset-[12%] rounded-full border border-dashed border-emerald-500/25" />
                <div className="absolute inset-[24%] rounded-full border border-primary/15" />

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

                {/* Portrait Photo Core: uses formal picture */}
                <div className="relative h-[62%] w-[62%] rounded-full p-1.5 bg-gradient-to-tr from-emerald-500 via-gold to-teal-500 shadow-2xl transition-transform duration-500 hover:scale-[1.03]">
                  <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-card-bg bg-card-bg">
                    <Editable
                      field="profile.photo"
                      image
                      alt={data.profile.name}
                      className="h-full w-full object-cover select-none"
                    />
                  </div>
                </div>
              </div>
            )}
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
      <div
        className={reverse ? "animate-orbit" : "animate-orbit-rev"}
        style={{ transform: "translate(-50%, 0)" }}
      >
        <div
          className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-card-bg px-3 py-1 shadow-md backdrop-blur-md transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:border-primary group-hover/badge:shadow-lg"
          title={badge.alt}
        >
          <Icon width={13} height={13} className="text-primary transition-colors group-hover/badge:text-gold" />
          <span className="font-mono text-[10px] font-bold text-ink whitespace-nowrap">
            {badge.label}
          </span>
        </div>
      </div>
    </div>
  )
}
