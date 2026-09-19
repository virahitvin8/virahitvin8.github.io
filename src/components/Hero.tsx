import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import { playSound } from "./SoundFX"
import {
  ArrowDown,
  Download,
  MapPin,
  Satellite,
  Shield,
  Sprout,
  Compass,
  Command,
  Sparkle,
  Play,
} from "./icons"

const CREDENTIAL_BADGES = [
  {
    icon: Sprout,
    title: "B.Sc (Hons) Agriculture",
    subtitle: "8.78 GPA · ICAR Accredited",
    position: "top-2 left-2",
  },
  {
    icon: Satellite,
    title: "M.Sc Remote Sensing & GIS",
    subtitle: "10.0 CGPA · SHUATS",
    position: "top-2 right-2",
  },
  {
    icon: Compass,
    title: "Drone UAV Multispectral",
    subtitle: "DJI P4 · NDVI Photogrammetry",
    position: "bottom-2 left-2",
  },
  {
    icon: Shield,
    title: "CSIR–NGRI Hydrology",
    subtitle: "Surface Processes & GIS DEM",
    position: "bottom-2 right-2",
  },
]

export function Hero() {
  const { data, soundEnabled, setCommandPaletteOpen } = usePortfolio()
  const [roleIndex, setRoleIndex] = useState(0)
  const [visualMode, setVisualMode] = useState<"portrait" | "terrain">("portrait")
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setRoleIndex((i) => (i + 1) % data.profile.roles.length)
    }, 3400)
    return () => clearInterval(t)
  }, [data.profile.roles.length])

  return (
    <section
      id="top"
      className="zone-ground relative overflow-hidden px-6 pt-24 pb-16 lg:px-10 lg:pt-32 lg:pb-24"
    >
      {/* Soothing Ambient Glow Circles */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-72 w-72 rounded-full bg-amber-300/12 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left column (7 cols) — Simple, Prestigious, Soothing */}
        <div className="flex flex-col lg:col-span-7">
          {/* Soothing Eyebrow Pill */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/15 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
              ASTRA &bull; Remote Sensing, GIS &amp; Precision Agriculture
            </span>
          </div>

          {/* Primary Name */}
          <h1
            ref={nameRef}
            className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            <Editable field="profile.name" />
          </h1>

          {/* Calm, Inspiring Tagline */}
          <div className="mt-2.5 font-display text-2xl font-bold tracking-tight text-ink/90 sm:text-3xl lg:text-4xl leading-tight">
            Grounded in soil. Guided by{" "}
            <span className="text-emerald-700 dark:text-emerald-400">
              satellite intelligence.
            </span>
          </div>

          {/* Dynamic rotating roles with gentle fade */}
          <div className="mt-3 flex h-7 items-center gap-2 font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="text-amber-500">✦</span>
            <span className="transition-all duration-300">
              {data.profile.roles[roleIndex]}
            </span>
          </div>

          {/* Clean summary statement */}
          <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-mist">
            Connecting crop agronomy, drone multispectral photogrammetry, and satellite Earth observation to understand agricultural landscapes and support data-driven farming decisions.
          </p>

          {/* Location & Availability Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 rounded-full bg-card-bg border border-hair px-3.5 py-1 text-mist shadow-2xs">
              <MapPin width={13} height={13} className="text-emerald-600 dark:text-emerald-400" />
              <Editable field="profile.location" />
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 font-semibold text-emerald-700 dark:text-emerald-300 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Editable field="profile.availability" />
            </span>
          </div>

          {/* Executive 3-Stat Strip — Clean, Light & Structured */}
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 rounded-2xl border border-hair bg-card-bg/90 p-4 shadow-xs backdrop-blur-md">
            <div className="flex flex-col border-r border-hair pr-2 sm:pr-4">
              <strong className="font-display text-xl sm:text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                10.0 CGPA
              </strong>
              <span className="font-mono text-[10px] sm:text-xs text-mist leading-tight mt-1">
                M.Sc RS &amp; GIS · SHUATS
              </span>
            </div>
            <div className="flex flex-col border-r border-hair pr-2 sm:pr-4">
              <strong className="font-display text-xl sm:text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                8.78 GPA
              </strong>
              <span className="font-mono text-[10px] sm:text-xs text-mist leading-tight mt-1">
                B.Sc (Hons) Agri · ICAR
              </span>
            </div>
            <div className="flex flex-col">
              <strong className="font-display text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                CSIR–NGRI
              </strong>
              <span className="font-mono text-[10px] sm:text-xs text-mist leading-tight mt-1">
                Earth Surface Processes
              </span>
            </div>
          </div>

          {/* Simple, Purposeful Action Bar */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={() => playSound("whoosh", soundEnabled)}
              className="flex items-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Research</span>
              <ArrowDown width={15} height={15} />
            </a>

            <a
              href="#deck"
              onClick={() => playSound("click", soundEnabled)}
              className="flex items-center gap-2 rounded-full border border-hair bg-card-bg px-5 py-2.5 text-sm font-semibold text-ink shadow-2xs transition hover:border-emerald-600/40 hover:bg-emerald-50/50 hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              <Play width={14} height={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Interactive Pitch Deck</span>
            </a>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-copilot"))
                playSound("blip", soundEnabled)
              }}
              className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
            >
              <Sparkle width={14} height={14} />
              <span>Ask Copilot</span>
            </button>

            <a
              href={data.profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => playSound("click", soundEnabled)}
              className="flex items-center gap-2 rounded-full border border-hair bg-card-bg px-4 py-2.5 text-sm font-medium text-mist shadow-2xs transition hover:border-primary/40 hover:text-ink"
              title="Download Official Curriculum Vitae"
            >
              <Download width={14} height={14} />
              <span>CV</span>
            </a>

            <button
              onClick={() => {
                setCommandPaletteOpen(true)
                playSound("whoosh", soundEnabled)
              }}
              className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-3.5 py-2.5 text-xs font-mono text-faint hover:text-ink hover:border-primary/40 transition shadow-2xs"
              title="Quick Search (Cmd+K)"
            >
              <Command width={13} height={13} className="text-primary-light" />
              <span>Cmd+K</span>
            </button>
          </div>
        </div>

        {/* Right column: Serene, Light-Coloured Visual Showcase (5 cols) */}
        <div className="relative mx-auto flex w-full max-w-[440px] flex-col items-center lg:col-span-5">
          {/* Mode Switcher */}
          <div className="mb-3.5 flex items-center gap-1 rounded-full border border-hair bg-card-bg/90 p-1 shadow-2xs font-mono text-[11px] backdrop-blur-md">
            <button
              onClick={() => {
                setVisualMode("portrait")
                playSound("click", soundEnabled)
              }}
              className={`rounded-full px-3.5 py-1 transition ${
                visualMode === "portrait"
                  ? "bg-emerald-700 text-white font-bold shadow-xs dark:bg-emerald-600"
                  : "text-mist hover:text-ink"
              }`}
            >
              🛰️ Verified Profile
            </button>
            <button
              onClick={() => {
                setVisualMode("terrain")
                playSound("click", soundEnabled)
              }}
              className={`rounded-full px-3.5 py-1 transition ${
                visualMode === "terrain"
                  ? "bg-emerald-700 text-white font-bold shadow-xs dark:bg-emerald-600"
                  : "text-mist hover:text-ink"
              }`}
            >
              🏔️ 3D Contour Terrain
            </button>
          </div>

          {/* Visual Showcase Card */}
          <div className="figma-card relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl p-6 backdrop-blur-xl">
            {/* Luminous Ambient Glow inside card */}
            <div className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-300/15 to-amber-300/20 blur-2xl" />

            {visualMode === "terrain" ? (
              /* Soothing 3D Contour Terrain Tile */
              <div
                className="relative flex h-full w-full flex-col items-center justify-center"
                role="img"
                aria-label="Abstract contour terrain illustration"
              >
                <div className="absolute top-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-mist">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    PRECISION SPATIAL DEM
                  </span>
                  <span className="rounded-full border border-hair px-2 py-0.5 bg-card-bg/60">
                    ELEV. 0m &rarr; 705km
                  </span>
                </div>

                {/* Topographic Tile */}
                <div
                  className="relative z-10 h-[190px] w-[190px] rounded-2xl border border-emerald-500/40 transition-transform duration-500 hover:scale-105"
                  style={{
                    transform: "rotate(-25deg) skew(10deg, 10deg)",
                    background:
                      "repeating-radial-gradient(ellipse at 35% 65%, transparent 0 12px, rgba(21, 128, 61, 0.25) 13px 14px, transparent 15px 24px), rgba(244, 247, 242, 0.95)",
                    boxShadow:
                      "-14px 18px 0 rgba(21, 128, 61, 0.12), -26px 34px 0 rgba(21, 128, 61, 0.06)",
                  }}
                >
                  <div className="absolute top-2.5 left-2.5 font-mono text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                    82°E, 14°N
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 font-mono text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                    CONTOUR Δ5m
                  </div>
                </div>

                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-faint">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    SOIL → DRONE → SPACE
                  </span>
                  <span>WATERSHED HYDROLOGY</span>
                </div>
              </div>
            ) : (
              /* Serene Portrait with 4 Elegant Credential Badges */
              <div className="relative flex h-full w-full items-center justify-center">
                {/* Subtle outer atmospheric rings */}
                <div className="absolute inset-2 rounded-full border border-emerald-600/10" />
                <div className="absolute inset-8 rounded-full border border-dashed border-emerald-500/20" />

                {/* Central Formal Portrait with Soothing Multi-layer Glow */}
                <div className="relative h-[66%] w-[66%] rounded-full p-1.5 bg-gradient-to-tr from-emerald-500/80 via-amber-400/80 to-teal-500/80 shadow-xl transition-transform duration-500 hover:scale-[1.03]">
                  <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-card-bg bg-card-bg">
                    <Editable
                      field="profile.photo"
                      image
                      alt={data.profile.name}
                      className="h-full w-full object-cover select-none"
                    />
                  </div>
                </div>

                {/* 4 Floating Credential Badges placed at corners */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-hair bg-card-bg/95 px-3 py-1 shadow-sm backdrop-blur-md transition hover:border-emerald-600/40 hover:scale-105">
                      <Sprout width={12} height={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="font-mono text-[10px] font-bold text-ink whitespace-nowrap">
                        🌾 8.78 GPA Agri
                      </span>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-hair bg-card-bg/95 px-3 py-1 shadow-sm backdrop-blur-md transition hover:border-emerald-600/40 hover:scale-105">
                      <Satellite width={12} height={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="font-mono text-[10px] font-bold text-ink whitespace-nowrap">
                        🛰️ 10.0 CGPA RS
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-hair bg-card-bg/95 px-3 py-1 shadow-sm backdrop-blur-md transition hover:border-emerald-600/40 hover:scale-105">
                      <Compass width={12} height={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="font-mono text-[10px] font-bold text-ink whitespace-nowrap">
                        🚁 UAV Multispectral
                      </span>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-hair bg-card-bg/95 px-3 py-1 shadow-sm backdrop-blur-md transition hover:border-emerald-600/40 hover:scale-105">
                      <Shield width={12} height={12} className="text-amber-600 dark:text-amber-400" />
                      <span className="font-mono text-[10px] font-bold text-ink whitespace-nowrap">
                        🏛️ CSIR–NGRI
                      </span>
                    </div>
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

