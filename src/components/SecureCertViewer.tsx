import { useEffect, useMemo, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import type { Certification } from "../data/portfolio"
import { CERT_DIR, useCertImage } from "../hooks/useCertImage"
import { Shield, X } from "./icons"

export function SecureCertViewer({
  cert,
  onClose,
}: {
  cert: Certification | null
  onClose: () => void
}) {
  const { data } = usePortfolio()
  // A scan that exists but cannot be decoded falls back like a missing one,
  // so a corrupt or half-copied file never renders as a broken image.
  const [failed, setFailed] = useState(false)
  const { src, pending } = useCertImage(cert)

  useEffect(() => setFailed(false), [cert?.id])
  const sessionId = useMemo(
    () => Math.random().toString(36).slice(2, 8).toUpperCase(),
    [cert?.id],
  )
  const stamp = useMemo(() => new Date().toLocaleString(), [cert?.id])

  useEffect(() => {
    if (!cert) return
    document.body.classList.add("secure-open")

    const block = (e: Event) => e.preventDefault()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (
        (e.ctrlKey || e.metaKey) &&
        ["p", "s", "c", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", block)
    document.addEventListener("copy", block)
    document.addEventListener("cut", block)
    document.addEventListener("dragstart", block)
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.classList.remove("secure-open")
      document.removeEventListener("contextmenu", block)
      document.removeEventListener("copy", block)
      document.removeEventListener("cut", block)
      document.removeEventListener("dragstart", block)
      window.removeEventListener("keydown", onKey)
    }
  }, [cert, onClose])

  if (!cert) return null

  const watermark = `${data.profile.name} · ${sessionId} · VIEW ONLY`

  return (
    <div className="secure-lock fixed inset-0 z-[10080] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/90 text-primary shadow-md transition hover:bg-white hover:scale-105"
        aria-label="Close"
      >
        <X />
      </button>

      <div className="relative w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-center gap-2 text-primary">
          <Shield width={18} height={18} />
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Protected Institutional Credential
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-white transition-all duration-300 shadow-2xl">
          {/* watermark tiles */}
          <div
            className="pointer-events-none absolute inset-0 z-10 flex flex-wrap content-center gap-y-20 opacity-[0.14] select-none"
            style={{ transform: "rotate(-24deg) scale(1.4)" }}
          >
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-6 font-mono text-xs tracking-widest text-primary select-none font-bold"
              >
                {watermark}
              </span>
            ))}
          </div>

          {/* Transparent protection shield layer: prevents direct drag, right-click, selection on the certificate scan */}
          <div
            className="absolute inset-0 z-20 select-none"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />

          {src && !failed ? (
            <img
              src={src}
              alt={`${cert.title} — ${cert.issuer}`}
              draggable={false}
              onError={() => setFailed(true)}
              className="relative z-0 mx-auto block max-h-[calc(100dvh-9rem)] w-auto max-w-full select-none object-contain pointer-events-none"
            />
          ) : (
            <div className="relative z-0 flex aspect-[1.414/1] flex-col items-center justify-center gap-4 bg-gradient-to-b from-white via-sand-light/40 to-sand-light/70 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/60 bg-gold/10 text-gold-light">
                <Shield width={26} height={26} />
              </div>
              <p className="font-mono text-xs font-bold tracking-wider text-gold-light uppercase">
                Certificate of Record
              </p>
              <h3 className="max-w-lg font-display text-2xl font-bold text-primary">
                {cert.title}
              </h3>
              <p className="text-sm font-semibold text-primary-light">{cert.issuer}</p>
              <p className="font-mono text-xs text-mist">{cert.date}</p>
              <p className="mt-2 max-w-md text-xs text-mist">{cert.blurb}</p>
              <p className="mt-6 text-[11px] text-faint">
                {pending ? (
                  "Retrieving original document…"
                ) : failed ? (
                  "The scan could not be displayed — the original is held on file."
                ) : (
                  <>
                    Original document available on request — the owner can
                    attach the scan at{" "}
                    <code className="font-mono text-primary/80">
                      {CERT_DIR}
                      {cert.slug || "slug"}.png
                    </code>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-faint">
          Verified academic credential for {data.profile.name} (Session: {sessionId} · {stamp}).
          Protected against unauthorized copying and reproduction.
        </p>
      </div>
    </div>
  )
}
