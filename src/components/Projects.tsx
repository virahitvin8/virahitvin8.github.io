import { useState, useMemo } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"
import { playSound } from "./SoundFX"
import {
  ArrowUpRight,
  Compass,
  Shield,
  Sprout,
  Satellite,
  Search,
  Filter,
  Eye,
  Sparkle,
} from "./icons"

function getProjectIcon(cat: string) {
  const c = cat.toLowerCase()
  if (c.includes("drone") || c.includes("uav")) return Compass
  if (c.includes("hydro") || c.includes("crop") || c.includes("agri") || c.includes("sorghum")) return Sprout
  if (c.includes("gis") || c.includes("terrain") || c.includes("geo")) return Shield
  return Satellite
}

export function Projects() {
  const { data, setSelectedProject, soundEnabled } = usePortfolio()
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Distinct categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(data.projects.map((p) => p.category)))
    return ["All", ...cats]
  }, [data.projects])

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return data.projects.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory
      const q = searchQuery.toLowerCase()
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.methodology && p.methodology.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [data.projects, selectedCategory, searchQuery])

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat)
    playSound("click", soundEnabled)
  }

  const handleInspect = (p: any) => {
    setSelectedProject(p)
    playSound("blip", soundEnabled)
  }

  return (
    <Section
      id="projects"
      index="04"
      eyebrow="Portfolio of Practical Work"
      title="Projects: From Soil to Orbit"
      className="zone-terrain"
    >
      {/* Controls Bar: Search & Category Filters */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full max-w-xs">
          <Search width={15} height={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tools, sensors..."
            className="w-full rounded-full border border-hair bg-card-bg pl-9 pr-4 py-1.5 text-xs text-ink placeholder:text-faint focus:border-primary focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Projects Bento Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-hair bg-card-bg p-12 text-center">
          <p className="font-mono text-xs text-faint">No projects match the selected criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("All")
              setSearchQuery("")
            }}
            className="mt-3 rounded-full bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => {
            const Icon = getProjectIcon(p.category)
            return (
              <article
                key={p.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-primary/15 bg-card-bg p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition">
                        <Icon width={16} height={16} />
                      </span>
                      <span className="rounded-full bg-primary/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                        {p.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-hair bg-card-bg text-mist transition hover:bg-primary hover:text-white hover:border-primary"
                          title="Open external publication / paper"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowUpRight width={14} height={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 font-display text-xl font-bold text-primary group-hover:text-primary-light transition-colors">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-mist line-clamp-3">
                    {p.description}
                  </p>

                  {/* Metrics preview if available */}
                  {p.metrics && p.metrics.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-xl border border-hair bg-primary/[0.02] p-2 text-center">
                      {p.metrics.map((m: any, idx: number) => (
                        <div key={idx} className="border-r border-hair last:border-r-0">
                          <span className="font-mono text-[11px] font-bold text-primary block truncate">
                            {m.value}
                          </span>
                          <span className="font-mono text-[9px] text-faint uppercase block truncate">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Section: Tags & Inspect Trigger */}
                <div className="mt-5 pt-4 border-t border-hair flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 4).map((t: string) => (
                      <span
                        key={t}
                        className="rounded-md bg-primary/[0.04] px-2 py-0.5 font-mono text-[10px] font-medium text-primary-light"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tags.length > 4 && (
                      <span className="rounded-md bg-primary/[0.02] px-1.5 py-0.5 font-mono text-[10px] text-faint">
                        +{p.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleInspect(p)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.04] py-2 font-mono text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    <Eye width={13} height={13} />
                    <span>Inspect Deep-Dive</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </Section>
  )
}
