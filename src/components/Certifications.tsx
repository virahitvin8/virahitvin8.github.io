import { useState, useMemo } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import type { Certification } from "../data/portfolio"
import { Section } from "./Section"
import { SecureCertViewer } from "./SecureCertViewer"
import { playSound } from "./SoundFX"
import { Lock, Mail, Shield, Satellite, Sprout, Check } from "./icons"

function getCertIcon(c: Certification) {
  const t = (c.title + " " + c.issuer).toLowerCase()
  if (t.includes("remote sensing") || t.includes("gis") || t.includes("ngri")) return Satellite
  if (t.includes("drone") || t.includes("farm") || t.includes("hydro") || t.includes("organic") || t.includes("crop")) return Sprout
  return Shield
}

function CardBody({ cert }: { cert: Certification }) {
  const Icon = getCertIcon(cert)
  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 transition group-hover:scale-105">
            <Icon width={18} height={18} />
          </span>
          <span
            className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold ${
              cert.onRequest
                ? "border-primary/15 bg-primary/[0.04] text-mist"
                : "border-emerald-400/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {cert.onRequest ? (
              <Mail width={10} height={10} />
            ) : (
              <Check width={10} height={10} />
            )}
            {cert.onRequest ? "ON REQUEST" : "VERIFIED SCAN"}
          </span>
        </div>
        <h3 className="font-display text-base font-bold text-primary group-hover:text-primary-light transition-colors">
          {cert.title}
        </h3>
        <p className="mt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          {cert.issuer}
        </p>
        {cert.date && (
          <p className="mt-0.5 font-mono text-[10px] text-faint">{cert.date}</p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-mist">
          {cert.blurb}
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono font-bold text-primary transition group-hover:translate-x-0.5">
        {cert.onRequest
          ? "Request credential document →"
          : "Open verified scan →"}
      </span>
    </>
  )
}

export function Certifications() {
  const { data, soundEnabled } = usePortfolio()
  const [active, setActive] = useState<Certification | null>(null)
  const [filter, setFilter] = useState<"All" | "Geospatial" | "Agronomy">("All")

  const filteredCerts = useMemo(() => {
    if (filter === "All") return data.certifications
    return data.certifications.filter((c) => {
      const text = (c.title + " " + c.issuer).toLowerCase()
      if (filter === "Geospatial") {
        return text.includes("remote") || text.includes("gis") || text.includes("ngri")
      }
      return !text.includes("remote") && !text.includes("ngri")
    })
  }, [data.certifications, filter])

  const onRequest = data.certifications.filter((c) => c.onRequest)

  const handleOpen = (c: Certification) => {
    setActive(c)
    playSound("blip", soundEnabled)
  }

  return (
    <Section
      id="certifications"
      index="06"
      eyebrow="Credentials &amp; Verified Scans"
      title="Certifications &amp; Research Training"
      className="zone-orbit"
    >
      {/* Category Pills */}
      <div className="mb-6 flex items-center gap-2">
        {(["All", "Geospatial", "Agronomy"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab)
              playSound("click", soundEnabled)
            }}
            className={`rounded-full px-4 py-1.5 font-mono text-xs font-semibold transition-all ${
              filter === tab
                ? "bg-primary text-white shadow-sm"
                : "border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary"
            }`}
          >
            {tab === "All" ? "All Credentials" : tab === "Geospatial" ? "Geospatial & RS" : "Agronomy & Precision"}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((c) =>
          c.onRequest ? (
            <a
              key={c.id}
              href="#contact"
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/15 bg-card-bg p-6 text-left shadow-xs backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              title="Certificate issued on request — get in touch and I will send it."
            >
              <CardBody cert={c} />
            </a>
          ) : (
            <button
              key={c.id}
              onClick={() => handleOpen(c)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/15 bg-card-bg p-6 text-left shadow-xs backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl cursor-pointer"
            >
              <CardBody cert={c} />
            </button>
          ),
        )}
      </div>

      {onRequest.length > 0 && (
        <p className="mt-8 flex items-center gap-3 rounded-2xl border border-hair bg-card-bg px-5 py-3.5 text-xs leading-relaxed text-mist shadow-xs">
          <Mail width={16} height={16} className="shrink-0 text-gold" />
          <span>
            {onRequest.length} specialized credentials are verified and available upon request.{" "}
            <a
              href="#contact"
              className="font-bold text-primary underline underline-offset-2"
            >
              Contact me to request official scans.
            </a>
          </span>
        </p>
      )}

      <SecureCertViewer cert={active} onClose={() => setActive(null)} />
    </Section>
  )
}
