import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"

export function Education() {
  const { data } = usePortfolio()
  return (
    <Section
      id="education"
      index="02"
      eyebrow="Academic Record & Progression"
      title="Education: Agriculture to Space"
      className="zone-aerial"
    >
      <TimelineList items={data.education} accent="emerald" />
    </Section>
  )
}

export function Experience() {
  const { data } = usePortfolio()
  return (
    <Section
      id="experience"
      index="03"
      eyebrow="Field & Research Practice"
      title="Experience Across Field & Orbit"
      className="zone-aerial"
    >
      <TimelineList items={data.experience} accent="gold" />
    </Section>
  )
}

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
  accent: "emerald" | "gold"
}) {
  const dot = accent === "emerald" ? "bg-emerald-600" : "bg-gold"
  return (
    <ol className="relative ml-2 space-y-4 border-l-2 border-primary/15 pl-6 sm:ml-4 sm:pl-8">
      {items.map((it) => {
        const logo = getOrgLogo(it.org, it.title)
        return (
          <li key={it.id} className="reveal relative">
            <span
              className={`absolute -left-[31px] top-4 h-3.5 w-3.5 rounded-full border-2 border-white shadow-xs sm:-left-[39px] ${dot}`}
            />
            <div className="rounded-2xl border border-primary/12 bg-white/95 p-5 shadow-xs transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {logo && (
                    <img
                      src={logo}
                      alt={it.org}
                      className="h-10 w-10 shrink-0 rounded-lg object-contain p-0.5 border border-primary/10 shadow-2xs"
                    />
                  )}
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary sm:text-xl">
                      {it.title}
                    </h3>
                    <p className="font-mono text-xs font-semibold text-emerald-800">
                      {it.org}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/[0.06] px-3 py-1 font-mono text-[11px] font-semibold text-primary">
                  {it.period}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {it.detail}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
