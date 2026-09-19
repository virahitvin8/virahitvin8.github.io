import { useEffect, useRef } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  X,
  ArrowUpRight,
  Satellite,
  Compass,
  Shield,
  Sprout,
  Cpu,
  Layers,
  Check,
  Sparkle,
} from "./icons"

function getProjectIcon(cat: string) {
  const c = cat.toLowerCase()
  if (c.includes("drone") || c.includes("uav")) return Compass
  if (c.includes("hydro") || c.includes("crop") || c.includes("agri") || c.includes("sorghum")) return Sprout
  if (c.includes("gis") || c.includes("terrain") || c.includes("geo")) return Shield
  return Satellite
}

export function ProjectModal() {
  const { selectedProject, setSelectedProject, soundEnabled } = usePortfolio()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null)
        playSound("click", soundEnabled)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedProject, setSelectedProject, soundEnabled])

  if (!selectedProject) return null

  const Icon = getProjectIcon(selectedProject.category)

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 transition-all"
      onClick={() => {
        setSelectedProject(null)
        playSound("click", soundEnabled)
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-primary/30 bg-card-bg p-6 sm:p-8 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            setSelectedProject(null)
            playSound("click", soundEnabled)
          }}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-primary/[0.06] text-mist hover:text-ink hover:bg-primary/[0.12] transition"
          aria-label="Close project modal"
        >
          <X width={18} height={18} />
        </button>

        {/* Header section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
            <Icon width={20} height={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/[0.08] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                {selectedProject.category}
              </span>
              {selectedProject.publishedIn && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-500">
                  <Sparkle width={11} height={11} />
                  Peer-Reviewed
                </span>
              )}
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">
              {selectedProject.title}
            </h2>
          </div>
        </div>

        {/* Overview text */}
        <p className="text-sm leading-relaxed text-mist">
          {selectedProject.description}
        </p>

        {/* Methodology section */}
        {selectedProject.methodology && (
          <div className="mt-6 rounded-2xl border border-hair bg-primary/[0.03] p-4 sm:p-5">
            <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-primary">
              <Layers width={14} height={14} />
              <span>Methodology &amp; Scientific Approach</span>
            </h4>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-mist">
              {selectedProject.methodology}
            </p>
          </div>
        )}

        {/* Metrics Grid */}
        {selectedProject.metrics && selectedProject.metrics.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {selectedProject.metrics.map((m: any, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-hair bg-primary/[0.04] p-3 text-center"
              >
                <div className="font-display text-lg sm:text-xl font-bold text-primary">
                  {m.value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-faint mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sensors & Platforms */}
        {selectedProject.sensors && selectedProject.sensors.length > 0 && (
          <div className="mt-5">
            <h4 className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-faint mb-2">
              <Cpu width={13} height={13} />
              <span>Sensors, Instruments &amp; Software Tools</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedProject.sensors.map((s: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-lg border border-primary/20 bg-white/70 dark:bg-black/40 px-2.5 py-1 font-mono text-xs font-medium text-primary shadow-2xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Findings / Deliverables */}
        {selectedProject.keyResults && selectedProject.keyResults.length > 0 && (
          <div className="mt-5">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-faint mb-2">
              Key Results &amp; Analytical Outcomes
            </h4>
            <ul className="space-y-2">
              {selectedProject.keyResults.map((r: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-mist">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                    <Check width={12} height={12} />
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-hair">
          {selectedProject.tags.map((t: string) => (
            <span
              key={t}
              className="rounded-md bg-primary/[0.06] px-2.5 py-1 font-mono text-[11px] font-medium text-primary-light"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Action button */}
        {selectedProject.link && (
          <div className="mt-6 flex justify-end">
            <a
              href={selectedProject.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-light transition"
            >
              <span>View Published Paper / Resource</span>
              <ArrowUpRight width={14} height={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
