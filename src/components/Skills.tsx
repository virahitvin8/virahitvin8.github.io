import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"

export function Skills() {
  const { data } = usePortfolio()
  return (
    <Section
      id="skills"
      index="05"
      eyebrow="Core Competencies"
      title="Technical & Agronomic Toolkit"
      className="zone-terrain"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.skills.map((g) => (
          <div
            key={g.id}
            className="reveal rounded-2xl border border-primary/12 bg-white/95 p-5 shadow-xs transition hover:border-primary/30 hover:shadow-md"
          >
            <h3 className="mb-3 font-display text-base font-bold text-primary border-b border-primary/10 pb-2">
              {g.label}
            </h3>
            <ul className="flex flex-col gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-xs font-medium text-mist"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
