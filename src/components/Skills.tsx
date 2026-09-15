import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"

export function Skills() {
  const { data } = usePortfolio()
  return (
    <Section
      id="skills"
      index="05"
      eyebrow="Capabilities"
      title="The instrument panel"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.skills.map((g) => (
          <div key={g.id} className="reveal glass rounded-2xl p-6">
            <h3 className="mb-4 font-display text-lg text-neon">{g.label}</h3>
            <ul className="flex flex-col gap-2.5">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2.5 text-sm text-mist"
                >
                  <span className="h-1 w-1 rounded-full bg-gold" />
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
