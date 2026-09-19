import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"
import { playSound } from "./SoundFX"
import { Satellite, Compass, Shield, Sprout, Sparkle } from "./icons"

function getOrgLogo(org: string, title: string) {
  const o = (org + " " + title).toLowerCase()
  if (o.includes("shuats")) return "/logos/shuats.svg"
  if (o.includes("itm")) return "/logos/itm-university.svg"
  if (o.includes("csir") || o.includes("ngri")) return "/logos/csir-ngri.svg"
  if (o.includes("sid")) return "/logos/sids-farm.svg"
  if (o.includes("nsl")) return "/logos/nsl-sugars.svg"
  if (o.includes("agritech") || o.includes("drone")) return "/logos/agritech.svg"
  if (o.includes("angrau")) return "/logos/angrau.svg"
  if (o.includes("chaitanya")) return "/logos/sri-chaitanya.svg"
  return null
}

function getItemAltitude(item: { title: string; org: string }) {
  const text = (item.title + " " + item.org).toLowerCase()
  if (text.includes("remote sensing") || text.includes("shuats")) {
    return { alt: "705 km Orbit", icon: Satellite, badge: "Satellite Earth Observation" }
  }
  if (text.includes("ngri") || text.includes("watershed") || text.includes("csir")) {
    return { alt: "3,500 m Terrain", icon: Shield, badge: "Geophysical & Watershed" }
  }
  if (text.includes("drone") || text.includes("uav") || text.includes("aerial")) {
    return { alt: "120 m Aerial", icon: Compass, badge: "UAV Drone Remote Sensing" }
  }
  return { alt: "0 m Ground Soil", icon: Sprout, badge: "Agronomy & Living Soil" }
}

export function TrajectoryTimeline() {
  const { data, soundEnabled } = usePortfolio()
  const [filter, setFilter] = useState<"all" | "education" | "experience">("all")

  const handleFilterChange = (f: "all" | "education" | "experience") => {
    setFilter(f)
    playSound("click", soundEnabled)
  }

  const items = [
    ...data.education.map((e) => ({ ...e, type: "education" as const })),
    ...data.experience.map((e) => ({ ...e, type: "experience" as const })),
  ].filter((item) => filter === "all" || item.type === filter)

  return (
    <Section
      id="trajectory"
      index="06"
      eyebrow="Academic & Professional Continuum"
      title="Altitude Trajectory: From Soil to Orbit"
      className="zone-aerial"
    >
      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-2">
        {(
          [
            { id: "all", label: "Complete Continuum (Soil → Orbit)" },
            { id: "education", label: "Academic Record (10.0 CGPA)" },
            { id: "experience", label: "Field & National Lab Experience" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs font-semibold transition-all ${
              filter === tab.id
                ? "bg-primary text-white shadow-sm"
                : "border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trajectory Continuum Timeline */}
      <ol className="relative ml-3 space-y-6 border-l-2 border-primary/20 pl-6 sm:ml-6 sm:pl-10">
        {items.map((it) => {
          const logo = getOrgLogo(it.org, it.title)
          const altitude = getItemAltitude(it)
          const AltIcon = altitude.icon
          const isEdu = it.type === "education"

          return (
            <li key={it.id} className="relative group">
              {/* Node Beacon */}
              <span className="absolute -left-[31px] sm:-left-[47px] top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card-bg bg-primary text-white shadow-md group-hover:scale-110 transition-transform">
                <AltIcon width={12} height={12} />
              </span>

              {/* Card */}
              <div className="rounded-3xl border border-primary/15 bg-card-bg p-5 sm:p-6 shadow-xs backdrop-blur-md transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {logo ? (
                      <img
                        src={logo}
                        alt={it.org}
                        className="h-11 w-11 shrink-0 rounded-xl object-contain p-1 border border-hair bg-white shadow-2xs"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold border border-primary/20">
                        {it.org.slice(0, 2).toUpperCase()}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-light px-2 py-0.5 rounded bg-primary/[0.06]">
                          {altitude.alt}
                        </span>
                        <span className="font-mono text-[10px] text-faint">
                          {isEdu ? "Academic Degree" : "Professional Role"}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-primary">
                        {it.title}
                      </h3>
                      <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {it.org}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-primary/[0.06] border border-hair px-3 py-1 font-mono text-[11px] font-bold text-primary">
                    {it.period}
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-mist">
                  {it.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}

// Backward compatibility exports for existing imports
export function Education() {
  return null
}
export function Experience() {
  return null
}
