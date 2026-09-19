import { usePortfolio } from "../content/PortfolioContext"
import { Section } from "./Section"
import { Download, Upload, FilePdf, ArrowUpRight } from "./icons"

export function Resume() {
  const { data, isAdmin, editing, updateData, showToast } = usePortfolio()
  const { cvUrl, resumeName, resumeUpdated } = data.profile
  const canEdit = isAdmin && editing

  const uploadResume = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/pdf"
    input.onchange = () => {
      const f = input.files?.[0]
      if (!f) return
      const r = new FileReader()
      r.onload = (e) => {
        updateData((d) => ({
          ...d,
          profile: {
            ...d.profile,
            cvUrl: e.target?.result as string,
            resumeName: f.name,
            resumeUpdated: new Date().toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            }),
          },
        }))
        showToast("Resume updated ✓ — Export JSON to publish it.")
      }
      r.readAsDataURL(f)
    }
    input.click()
  }

  return (
    <Section
      id="resume"
      index="07"
      eyebrow="Official Curriculum Vitae"
      title="Verified Academic &amp; Professional Résumé"
      className="zone-orbit"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* Info + actions */}
        <div className="reveal flex flex-col justify-between rounded-3xl border border-primary/20 bg-card-bg p-6 sm:p-7 shadow-xs backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <FilePdf width={16} height={16} className="text-emerald-500" />
              <span>Verified Official Document</span>
            </div>
            <p className="break-all font-mono text-sm font-bold text-primary">{resumeName}</p>
            <p className="mt-1 font-mono text-xs text-mist">
              Verified Version &bull; Last updated {resumeUpdated}
            </p>

            <div className="mt-4 rounded-2xl border border-hair bg-primary/[0.03] p-4 text-xs text-mist leading-relaxed">
              Complete documentation of B.Sc (Hons) Agriculture coursework, M.Sc Remote Sensing &amp; GIS curriculum, CSIR-NGRI research training, and field credentials.
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <a
              href={cvUrl}
              download={resumeName}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-light hover:shadow-md"
            >
              <Download width={16} height={16} /> Download Official CV (PDF)
            </a>
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-hair bg-card-bg px-6 py-2.5 text-xs font-semibold text-primary shadow-2xs transition hover:bg-primary/5"
            >
              <ArrowUpRight width={14} height={14} /> Open in New Tab
            </a>

            {canEdit && (
              <button
                onClick={uploadResume}
                className="flex items-center justify-center gap-2 rounded-full border border-dashed border-gold px-6 py-2.5 text-xs font-bold text-gold transition hover:bg-gold/10"
              >
                <Upload width={15} height={15} /> Upload new résumé (Admin)
              </button>
            )}
          </div>
        </div>

        {/* Embedded preview */}
        <div className="reveal overflow-hidden rounded-3xl border border-primary/20 bg-card-bg shadow-sm">
          <object
            data={`${cvUrl}#toolbar=0&view=FitH`}
            type="application/pdf"
            className="h-[52vh] w-full"
          >
            <div className="flex h-[52vh] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-mist">
                PDF preview loaded in native viewer.
              </p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-sm"
              >
                Open Résumé PDF
              </a>
            </div>
          </object>
        </div>
      </div>
    </Section>
  )
}
