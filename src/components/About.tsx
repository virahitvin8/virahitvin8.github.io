import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import { Section } from "./Section"
import { Sparkle, Sprout, Satellite } from "./icons"

export function About() {
  const { data } = usePortfolio()
  return (
    <Section
      id="about"
      index="02"
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
            className="text-sm sm:text-base leading-relaxed text-mist"
          />

          {/* Two-Tier Specialization Card */}
          <div className="mt-6 rounded-3xl border border-primary/20 bg-card-bg p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-primary">
              <Sprout width={16} height={16} className="text-emerald-500" />
              <span>Two-Tier Specialization: Soil to Space</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-hair bg-primary/[0.03] p-4">
                <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Tier 1 &bull; Agronomy &amp; Crops
                </span>
                <p className="font-display text-base font-bold text-ink mt-1">B.Sc (Hons) Agriculture</p>
                <p className="mt-1 text-xs text-mist">ITM University &bull; 8.78 GPA (ICAR Accredited)</p>
              </div>

              <div className="rounded-2xl border border-hair bg-primary/[0.03] p-4">
                <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase">
                  Tier 2 &bull; Earth Observation &amp; GIS
                </span>
                <p className="font-display text-base font-bold text-ink mt-1">M.Sc Remote Sensing &amp; GIS</p>
                <p className="mt-1 text-xs text-mist">SHUATS &bull; 10.0 CGPA &bull; CSIR-NGRI Trained</p>
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
                className="group flex items-center gap-3 rounded-2xl border border-hair bg-card-bg px-4 py-3 shadow-2xs backdrop-blur-md transition hover:border-primary/40 hover:bg-primary/[0.04]"
              >
                <Sparkle
                  width={15}
                  height={15}
                  className="text-gold transition group-hover:scale-110"
                />
                <span className="text-xs sm:text-sm font-medium text-ink">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
