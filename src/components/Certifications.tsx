import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import type { Certification } from "../data/portfolio"
import { Section } from "./Section"
import { SecureCertViewer } from "./SecureCertViewer"
import { Lock, Mail, Shield } from "./icons"

const CARD =
  "reveal group relative flex flex-col overflow-hidden rounded-2xl border border-hair bg-white/[0.02] p-6 text-left transition duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:bg-gold/[0.04]"

/** The inside of a card, shared by both variants so a held certificate and an
 *  on-request one cannot drift apart in layout. */
function CardBody({ cert }: { cert: Certification }) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 text-gold transition group-hover:scale-110">
          <Shield width={20} height={20} />
        </span>
        <span
          className={`flex items-center gap-1.5 rounded-full border border-hair px-3 py-1 font-mono text-[10px] ${
            cert.onRequest ? "text-mist" : "text-neon"
          }`}
        >
          {cert.onRequest ? (
            <Mail width={11} height={11} />
          ) : (
            <Lock width={11} height={11} />
          )}
          {cert.onRequest ? "ON REQUEST" : "SECURE"}
        </span>
      </div>
      <h3 className="font-display text-lg leading-snug text-ink">
        {cert.title}
      </h3>
      <p className="mt-2 text-sm font-medium text-gold-light">{cert.issuer}</p>
      {/* A date the owner has not filled in is left out rather than shown blank. */}
      {cert.date && (
        <p className="mt-1 font-mono text-xs text-faint">{cert.date}</p>
      )}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
        {cert.blurb}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-neon opacity-70 transition group-hover:opacity-100">
        {cert.onRequest
          ? "Request certificate \u2192"
          : "View credential \u2192"}
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
      eyebrow="Verified Credentials"
      title="Certifications & research"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* An on-request credential links to contact instead of opening the
            viewer: there is no document to lock, and a generated placeholder
            would imply one exists. */}
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
        <p className="mt-8 flex items-start gap-3 rounded-2xl border border-hair bg-white/[0.02] px-6 py-5 text-sm leading-relaxed text-mist">
          <Mail width={16} height={16} className="mt-0.5 shrink-0 text-gold" />
          <span>
            {onRequest.length} of these are training programmes whose
            certificates are issued on request — the training is completed, the
            document is not published here.{" "}
            <a
              href="#contact"
              className="text-neon underline decoration-dotted underline-offset-4"
            >
              Ask me and I will send it.
            </a>
          </span>
        </p>
      )}

      <SecureCertViewer cert={active} onClose={() => setActive(null)} />
    </Section>
  )
}
