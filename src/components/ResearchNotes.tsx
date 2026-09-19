import { useState, useMemo } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"
import { playSound } from "./SoundFX"
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Sprout,
  Shield,
  Compass,
  Layers,
  Sparkle,
} from "./icons"

interface ResearchNote {
  id: string
  title: string
  category: "Agronomy" | "GIS Modeling" | "UAV Sensors" | "Hydroponics"
  date: string
  summary: string
  formulaOrCode?: string
  keyTakeaways: string[]
  tags: string[]
}

const NOTES: ResearchNote[] = [
  {
    id: "note-1",
    title: "Sorghum Dhurrin Hydrolysis & Cyanogenesis Assay",
    category: "Agronomy",
    date: "Published in Agri Express (2024)",
    summary:
      "Standard laboratory protocol analyzing the cyanogenic glucoside dhurrin (p-hydroxy-(S)-mandelonitrile-beta-D-glucopyranoside) in Sorghum bicolor under drought-induced moisture stress.",
    formulaOrCode:
      "Dhurrin + H2O ──(dhurrinase)──> p-Hydroxybenzaldehyde cyanohydrin ──(HNL)──> p-HBA + HCN (Toxic gas)",
    keyTakeaways: [
      "Critical toxicity limit established at <200 ppm dry weight for ruminant livestock forage.",
      "Moisture stress accelerates dhurrin concentration in young shoots and first ratoon tillers.",
      "Delaying harvest post-flowering drops HCN levels safely below danger limits.",
    ],
    tags: ["Sorghum", "HCN Assay", "Biochemistry", "Livestock Safety"],
  },
  {
    id: "note-2",
    title: "ArcGIS Hydrological Flow Delineation & Strahler Orders",
    category: "GIS Modeling",
    date: "CSIR-NGRI Research Protocol (2026)",
    summary:
      "Step-by-step digital elevation workflow in ArcGIS Spatial Analyst to extract dendritic drainage patterns, flow accumulation, and watershed catchment boundaries from 30m SRTM data.",
    formulaOrCode:
      "Fill(DEM) ➔ FlowDirection(D8) ➔ FlowAccumulation(threshold > 500) ➔ StreamOrder(Strahler) ➔ Watershed(PourPoint)",
    keyTakeaways: [
      "Hydro-enforced DEM pit-filling eliminates artificial elevation depressions.",
      "Extracted 1st to 5th order streams controlling regional drainage patterns across 450 km².",
      "Correlated lineament density with recharge zones using ERT subsurface profiles.",
    ],
    tags: ["ArcGIS", "DEM", "Watershed Delineation", "CSIR-NGRI"],
  },
  {
    id: "note-3",
    title: "UAV Multispectral Radiometric Calibration & NDVI Math",
    category: "UAV Sensors",
    date: "AgriTech Innovations Field Log",
    summary:
      "Aerial survey methodology using downwelling light sensors and calibrated diffuse reflectance panels to generate quantitative vegetation vigor maps at 4.2 cm GSD.",
    formulaOrCode:
      "NDVI = (NIR_840nm - Red_668nm) / (NIR_840nm + Red_668nm)\nSAVI = ((NIR - Red) / (NIR + Red + L)) * (1 + L)  [L = 0.5 for intermediate canopy]",
    keyTakeaways: [
      "Sunlight sensor calibration corrects for cloud shadow variations during mid-day flights.",
      "Early vegetative stress flagged 12 days before visible discoloration on leaves.",
      "Generates variable-rate nitrogen prescription maps saving 22% in commercial fertilizer.",
    ],
    tags: ["UAV Drone", "NDVI", "Pix4D", "Precision Agriculture"],
  },
  {
    id: "note-4",
    title: "NFT Hydroponic Polyhouse Nutrient Formulations",
    category: "Hydroponics",
    date: "ITM University Polyhouse Log",
    summary:
      "Nutrient Film Technique (NFT) recirculation balancing macro-nutrients (N-P-K-Ca-Mg) with automated EC and pH dosage in a solar-regulated polyhouse.",
    formulaOrCode:
      "Target Parameters: EC = 1.8 – 2.2 mS/cm | pH = 5.8 – 6.4 | Water Temp = 18°C – 22°C",
    keyTakeaways: [
      "90% reduction in water consumption compared to open-field soil cultivation.",
      "Accelerated harvest duration by 30% without chemical synthetic pesticides.",
      "Automated continuous EC/pH monitoring prevents root nutrient lockup.",
    ],
    tags: ["Hydroponics", "NFT", "Water Conservation", "Polyhouse"],
  },
]

export function ResearchNotes() {
  const { soundEnabled, showToast } = usePortfolio()
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [search, setSearch] = useState<string>("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = ["All", "Agronomy", "GIS Modeling", "UAV Sensors", "Hydroponics"]

  const filtered = useMemo(() => {
    return NOTES.filter((n) => {
      const matchCat = activeCategory === "All" || n.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  const handleCopyFormula = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula)
    setCopiedId(id)
    showToast("Copied protocol / formula to clipboard ✓")
    playSound("chime", soundEnabled)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Section
      id="notes"
      index="05"
      eyebrow="Open-Source Field Notebook (AppFlowy Inspired)"
      title="Research Protocols &amp; Field Technical Logs"
      className="zone-terrain"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                playSound("click", soundEnabled)
              }}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-xs"
                  : "border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search width={14} height={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search field notes, formulas, protocols..."
            className="w-full rounded-full border border-hair bg-card-bg pl-9 pr-4 py-1.5 text-xs text-ink placeholder:text-faint focus:border-primary focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Bento Notes Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((note) => (
          <article
            key={note.id}
            className="group flex flex-col justify-between rounded-3xl border border-primary/15 bg-card-bg p-6 sm:p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between border-b border-hair pb-3">
                <span className="rounded-full bg-primary/[0.08] px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary uppercase">
                  {note.category}
                </span>
                <span className="font-mono text-[11px] text-faint">{note.date}</span>
              </div>

              <h3 className="mt-3 font-display text-lg sm:text-xl font-bold text-primary group-hover:text-primary-light transition-colors">
                {note.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-mist">
                {note.summary}
              </p>

              {/* Code / Formula Snippet Box */}
              {note.formulaOrCode && (
                <div className="mt-4 rounded-2xl border border-hair bg-black/90 p-3 text-emerald-400 font-mono text-[11px] relative shadow-inner">
                  <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {note.formulaOrCode}
                  </pre>
                  <button
                    onClick={() => handleCopyFormula(note.id, note.formulaOrCode!)}
                    className="absolute top-2 right-2 rounded-md bg-white/10 p-1 text-slate-300 hover:bg-white/20 transition"
                    title="Copy snippet"
                  >
                    {copiedId === note.id ? <Check width={12} height={12} className="text-emerald-400" /> : <Copy width={12} height={12} />}
                  </button>
                </div>
              )}

              {/* Takeaways */}
              <ul className="mt-4 space-y-1.5">
                {note.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-mist">
                    <span className="text-emerald-500 font-bold">›</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mt-5 pt-3 border-t border-hair flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-primary/[0.04] px-2 py-0.5 font-mono text-[10px] font-medium text-primary-light"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
