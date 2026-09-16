import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"
import { ArrowUpRight, Compass, Shield, Sprout, Satellite } from "./icons"

function getProjectIcon(cat: string) {
  const c = cat.toLowerCase()
  if (c.includes("drone") || c.includes("uav")) return Compass
  if (c.includes("hydro") || c.includes("crop") || c.includes("agri")) return Sprout
  if (c.includes("gis") || c.includes("terrain") || c.includes("geo")) return Shield
  return Satellite
}

export function Projects() {
  const { data } = usePortfolio()

  return (
    <Section
      id="projects"
      index="04"
      eyebrow="Portfolio of Practical Work"
      title="Projects: From Soil to Orbit"
      className="zone-terrain"
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((p) => {
          const Icon = getProjectIcon(p.category)
          return (
            <article
              key={p.id}
              className="reveal group relative flex flex-col justify-between rounded-2xl border border-primary/12 bg-white/95 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon width={14} height={14} />
                    </span>
                    <span className="rounded-full bg-primary/[0.05] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                      {p.category}
                    </span>
                  </div>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-white"
                      title="Open external publication / resource"
                    >
                      <ArrowUpRight width={14} height={14} />
                    </a>
                  )}
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-primary">
                  {p.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-mist">
                  {p.description}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-primary/10">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-primary/[0.04] px-2 py-0.5 font-mono text-[10px] font-medium text-primary-light"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
