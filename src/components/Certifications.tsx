import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import type { Certification } from "../data/portfolio"
import { Section } from "./Section"
import { SecureCertViewer } from "./SecureCertViewer"
import { Lock, Mail, Shield } from "./icons"

const CARD =
  "reveal group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/12 bg-white/95 p-5 text-left shadow-xs transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"

function CardBody({ cert }: { cert: Certification }) {
  return (
    <>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition group-hover:scale-105">
            <Shield width={18} height={18} />
          </span>
          <span
            className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold ${
              cert.onRequest
                ? "border-primary/15 bg-primary/[0.04] text-mist"
                : "border-emerald-300 bg-emerald-50 text-emerald-800"
            }`}
          >
            {cert.onRequest ? (
              <Mail width={10} height={10} />
            ) : (
              <Lock width={10} height={10} />
            )}
            {cert.onRequest ? "ON REQUEST" : "VERIFIED SCAN"}
          </span>
        </div>
        <h3 className="font-display text-base font-bold text-primary">
          {cert.title}
        </h3>
        <p className="mt-1 text-xs font-semibold text-emerald-800">{cert.issuer}</p>
        {cert.date && (
          <p className="mt-0.5 font-mono text-[10px] text-faint">{cert.date}</p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-mist">
          {cert.blurb}
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary transition group-hover:text-primary-light">
        {cert.onRequest
          ? "Request credential →"
          : "View credential scan →"}
      </span>
    </>
  )
}

export function Certifications() {
  const { data } = usePortfolio()
  const [active, setActive] = useState<Certification | null>(null)
  const onRequest = data.certifications.filter((c) => c.onRequest)

  return (
    <Section
      id="certifications"
      index="06"
      eyebrow="Credentials & Verified Scans"
      title="Certifications & Research Training"
      className="zone-orbit"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.certifications.map((c) =>
          c.onRequest ? (
            <a
              key={c.id}
              href="#contact"
              className={CARD}
              title="Certificate issued on request — get in touch and I will send it."
            >
              <CardBody cert={c} />
            </a>
          ) : (
            <button key={c.id} onClick={() => setActive(c)} className={CARD}>
              <CardBody cert={c} />
            </button>
          ),
        )}
      </div>

      {onRequest.length > 0 && (
        <p className="mt-6 flex items-center gap-2.5 rounded-xl border border-primary/10 bg-white/80 px-4 py-3 text-xs leading-relaxed text-mist shadow-xs">
          <Mail width={15} height={15} className="shrink-0 text-gold-light" />
          <span>
            {onRequest.length} specialized credentials are completed and available upon formal verification request.{" "}
            <a
              href="#contact"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Contact me to request official copies.
            </a>
          </span>
        </p>
      )}

      <SecureCertViewer cert={active} onClose={() => setActive(null)} />
    </Section>
  )
}
