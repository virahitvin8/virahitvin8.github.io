import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import { Section } from "./Section"
import { Sparkle, Sprout } from "./icons"

export function About() {
  const { data } = usePortfolio()
  return (
    <Section
      id="about"
      index="01"
      eyebrow="Academic Trajectory & Mission"
      title={<Editable field="about.lead" />}
      className="zone-ground"
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="reveal">
          <Editable
            field="about.body"
            as="p"
            multiline
            className="text-base leading-relaxed text-mist"
          />

          {/* Core Credentials Highlight Card */}
          <div className="mt-6 rounded-2xl border border-primary/15 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-primary">
              <Sprout width={16} height={16} className="text-emerald-600" />
              <span>Two-Tier Specialization</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-3">
                <span className="font-mono text-[10px] font-bold text-emerald-700 uppercase">Tier 1 · Agronomy</span>
                <p className="font-display text-sm font-bold text-ink">B.Sc (Hons) Agriculture</p>
                <p className="mt-0.5 text-xs text-mist">ITM University · 8.78 GPA (ICAR Accredited)</p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-3">
                <span className="font-mono text-[10px] font-bold text-sky-700 uppercase">Tier 2 · Earth Observation</span>
                <p className="font-display text-sm font-bold text-ink">M.Sc Remote Sensing &amp; GIS</p>
                <p className="mt-0.5 text-xs text-mist">SHUATS · 10.0 CGPA &bull; CSIR-NGRI Trained</p>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal">
          <p className="hud-label mb-3">Specialized Focus Areas</p>
          <div className="flex flex-col gap-2.5">
            {data.about.focus.map((f, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-white/90 px-4 py-2.5 shadow-xs transition hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-sm"
              >
                <Sparkle
                  width={15}
                  height={15}
                  className="text-gold transition group-hover:text-primary"
                />
                <span className="text-sm font-medium text-ink">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
