import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"

export function Education() {
  const { data } = usePortfolio()
  return (
    <Section
      id="education"
      index="02"
      eyebrow="Academic Record"
      title="Education"
    >
      <TimelineList items={data.education} accent="neon" />
    </Section>
  )
}

export function Experience() {
  const { data } = usePortfolio()
  return (
    <Section
      id="experience"
      index="03"
      eyebrow="Field & Research"
      title="Experience"
    >
      <TimelineList items={data.experience} accent="gold" />
    </Section>
  )
}

function TimelineList({
  items,
  accent,
}: {
  items: {
    id: string
    title: string
    org: string
    period: string
    detail: string
  }[]
  accent: "neon" | "gold"
}) {
  const dot = accent === "neon" ? "bg-neon" : "bg-gold"
  const glow = accent === "neon" ? "var(--neon-soft)" : "var(--gold-soft)"
  return (
    <ol className="relative ml-3 border-l border-hair">
      {items.map((it) => (
        <li key={it.id} className="reveal relative pb-12 pl-8 last:pb-0">
          <span
            className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full ${dot}`}
            style={{ boxShadow: `0 0 14px ${glow}` }}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-display text-xl text-ink">{it.title}</h3>
            <span className="font-mono text-xs text-faint">{it.period}</span>
          </div>
          <p
            className={`mt-1 text-sm font-medium ${
              accent === "neon" ? "text-sage-light" : "text-gold-light"
            }`}
          >
            {it.org}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
            {it.detail}
          </p>
        </li>
      ))}
    </ol>
  )
}
