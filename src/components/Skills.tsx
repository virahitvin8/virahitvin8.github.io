import { useState, useMemo } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"
import { playSound } from "./SoundFX"
import {
  Satellite,
  Cpu,
  Sprout,
  Globe,
  Search,
  Check,
  Shield,
  Layers,
} from "./icons"

function getGroupIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes("geo") || l.includes("remote")) return Satellite
  if (l.includes("software") || l.includes("tool")) return Cpu
  if (l.includes("agri") || l.includes("crop")) return Sprout
  return Globe
}

export function Skills() {
  const { data, soundEnabled, showToast } = usePortfolio()
  const [skillSearch, setSkillSearch] = useState("")

  const filteredSkills = useMemo(() => {
    if (!skillSearch.trim()) return data.skills
    const q = skillSearch.toLowerCase()
    return data.skills
      .map((g) => ({
        ...g,
        items: g.items.filter((s) => s.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0)
  }, [data.skills, skillSearch])

  const handleSkillClick = (s: string) => {
    navigator.clipboard.writeText(s)
    showToast(`Copied skill: ${s}`)
    playSound("click", soundEnabled)
  }

  return (
    <Section
      id="skills"
      index="05"
      eyebrow="Core Competencies"
      title="Technical &amp; Agronomic Toolkit"
      className="zone-terrain"
    >
      {/* Search Bar */}
      <div className="mb-8 flex justify-end">
        <div className="relative w-full max-w-xs">
          <Search width={15} height={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder="Search skills, GIS, UAV, languages..."
            className="w-full rounded-full border border-hair bg-card-bg pl-9 pr-4 py-1.5 text-xs text-ink placeholder:text-faint focus:border-primary focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of skill categories */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredSkills.map((g) => {
          const Icon = getGroupIcon(g.label)
          return (
            <div
              key={g.id}
              className="group rounded-3xl border border-primary/15 bg-card-bg p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 border-b border-hair pb-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition">
                  <Icon width={16} height={16} />
                </span>
                <h3 className="font-display text-base font-bold text-primary">
                  {g.label}
                </h3>
              </div>

              <ul className="flex flex-col gap-2.5">
                {g.items.map((s) => (
                  <li
                    key={s}
                    onClick={() => handleSkillClick(s)}
                    className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium text-mist hover:bg-primary/[0.06] hover:text-ink cursor-pointer transition"
                    title="Click to copy skill"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{s}</span>
                    </div>
                    <span className="font-mono text-[9px] text-faint opacity-0 group-hover:opacity-100 transition">
                      copy
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
