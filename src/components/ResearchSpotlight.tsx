import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  BookOpen,
  ArrowUpRight,
  Sparkle,
  Copy,
  Check,
  Sprout,
  Shield,
  FilePdf,
} from "./icons"

const BIBTEX_CITATION = `@article{vinay2024unlocking,
  title={Unlocking Potential of HCN Content in Sorghum},
  author={Vinay, Neelam Akshit and Sinha, Amrita and Singh, Lokesh},
  journal={Agri Express},
  volume={2},
  number={1},
  pages={V02I01.13},
  year={2024},
  issn={2584-2498},
  url={https://www.agriexpress.in/article/40/}
}`

const APA_CITATION = `Vinay, N. A., Sinha, A., & Singh, L. (2024). Unlocking Potential of HCN Content in Sorghum. Agri Express, 2(1), Art. V02I01.13. E-ISSN: 2584-2498.`

export function ResearchSpotlight() {
  const { soundEnabled, showToast } = usePortfolio()
  const [copiedBib, setCopiedBib] = useState(false)
  const [copiedApa, setCopiedApa] = useState(false)

  const copyCitation = (type: "bib" | "apa") => {
    const text = type === "bib" ? BIBTEX_CITATION : APA_CITATION
    navigator.clipboard.writeText(text)
    if (type === "bib") {
      setCopiedBib(true)
      setTimeout(() => setCopiedBib(false), 2200)
    } else {
      setCopiedApa(true)
      setTimeout(() => setCopiedApa(false), 2200)
    }
    showToast(`Citation copied (${type.toUpperCase()}) ✓`)
    playSound("chime", soundEnabled)
  }

  return (
    <section id="research" className="zone-ground relative px-6 py-14 lg:px-10 lg:py-18">
      <div className="mx-auto max-w-7xl">
        {/* Eyebrow & Title */}
        <div className="mb-8 border-b border-hair pb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold">02</span>
            <span className="h-px w-6 bg-gold/40" />
            <span className="hud-label text-primary">Peer-Reviewed Publication</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                From Field Observations to Spatial Understanding
              </h2>
              <p className="mt-1 text-sm text-mist">
                Selected peer-reviewed agronomy research, cyanogenic glycoside assays, and crop physiology.
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-full border border-hair bg-primary/[0.05] px-3 py-1 font-mono text-[11px] font-semibold text-primary">
              Research-led &bull; Field-informed
            </span>
          </div>
        </div>

        {/* Featured Research Card Bento */}
        <div className="overflow-hidden rounded-3xl border border-primary/25 bg-card-bg shadow-xl backdrop-blur-xl transition-all hover:border-primary/40">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 items-center">
            {/* Left: Article Details (7 cols) */}
            <div className="lg:col-span-7">
              {/* Publication Pill Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-bold text-amber-600 dark:text-amber-400">
                  <Sparkle width={12} height={12} />
                  PEER-REVIEWED JOURNAL
                </span>
                <span className="rounded-full border border-hair bg-primary/[0.04] px-3 py-1 font-semibold text-mist">
                  E-ISSN: 2584-2498
                </span>
                <span className="rounded-full border border-hair bg-primary/[0.04] px-3 py-1 font-semibold text-mist">
                  Agri Express · Vol. 02
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary leading-snug">
                Unlocking Potential of HCN Content in Sorghum
              </h3>

              <p className="mt-2 font-mono text-xs font-bold text-primary-light">
                Neelam Akshit Vinay, Amrita Sinha, and Lokesh Singh
              </p>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-mist">
                Investigating dhurrin cyanogenic glycoside biochemistry in sorghum (*Sorghum bicolor*) to mitigate livestock hydrocyanic acid toxicity while harnessing endogenous plant defense compounds for biological crop pest resistance. Translating lab assays into farmer-ready grazing safety guidelines.
              </p>

              {/* Research Metrics & Milestones */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-hair bg-primary/[0.03] p-3 text-center">
                  <span className="font-mono text-[10px] text-faint block uppercase">Toxicity Limit</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                    &lt;200 ppm
                  </span>
                  <span className="text-[10px] text-faint block">Safe Ruminant Forage</span>
                </div>
                <div className="rounded-2xl border border-hair bg-primary/[0.03] p-3 text-center">
                  <span className="font-mono text-[10px] text-faint block uppercase">Biochemistry</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-primary">
                    Dhurrin Glycoside
                  </span>
                  <span className="text-[10px] text-faint block">Cyanogenesis pathway</span>
                </div>
                <div className="rounded-2xl border border-hair bg-primary/[0.03] p-3 text-center">
                  <span className="font-mono text-[10px] text-faint block uppercase">Affiliation</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-primary">
                    ITM University
                  </span>
                  <span className="text-[10px] text-faint block">ICAR Accredited</span>
                </div>
              </div>

              {/* Actions: View Paper & Citation Copy */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.agriexpress.in/article/40/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-light transition"
                >
                  <BookOpen width={14} height={14} />
                  <span>Read Full Paper (Agri Express)</span>
                  <ArrowUpRight width={14} height={14} />
                </a>

                <button
                  onClick={() => copyCitation("apa")}
                  className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-4 py-2 text-xs font-mono font-semibold text-mist hover:text-ink hover:border-primary transition"
                >
                  {copiedApa ? <Check width={13} height={13} className="text-emerald-500" /> : <Copy width={13} height={13} />}
                  <span>{copiedApa ? "Copied APA ✓" : "Copy APA Citation"}</span>
                </button>

                <button
                  onClick={() => copyCitation("bib")}
                  className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-4 py-2 text-xs font-mono font-semibold text-mist hover:text-ink hover:border-primary transition"
                >
                  {copiedBib ? <Check width={13} height={13} className="text-emerald-500" /> : <Copy width={13} height={13} />}
                  <span>{copiedBib ? "Copied BibTeX ✓" : "Copy BibTeX"}</span>
                </button>
              </div>
            </div>

            {/* Right: Interactive Bio-Chemical Diagram / Visual (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                  <Sprout width={14} height={14} />
                  Biochemical Mechanism Overview
                </span>

                <div className="mt-4 space-y-3 font-mono text-xs text-mist">
                  <div className="rounded-xl border border-hair bg-card-bg p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-ink font-bold">
                      <span>1. Intact Sorghum Leaf</span>
                      <span className="text-[10px] text-emerald-500">Non-Toxic</span>
                    </div>
                    <p className="mt-1 text-[11px] text-faint">
                      Dhurrin localized in vacuole; dhurrinase enzymes sequestered in cytoplasm.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
                      <span>2. Cellular Disruption / Ingestion</span>
                      <span className="text-[10px]">Active Hydrolysis</span>
                    </div>
                    <p className="mt-1 text-[11px] text-faint">
                      Enzymatic cleavage produces free Hydrocyanic Acid (HCN). Rapid cellular respiration inhibition in pests.
                    </p>
                  </div>

                  <div className="rounded-xl border border-hair bg-card-bg p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-ink font-bold">
                      <span>3. Agronomic Management</span>
                      <span className="text-[10px] text-primary-light">Field Safety</span>
                    </div>
                    <p className="mt-1 text-[11px] text-faint">
                      Harvest delay post-heading reduces HCN below 200 ppm threshold for safe silage and direct cattle feeding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-hair flex items-center justify-between font-mono text-[11px] text-faint">
                <span>Article ID: V02I01.13</span>
                <span className="text-primary font-bold">Agri Express Publication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
