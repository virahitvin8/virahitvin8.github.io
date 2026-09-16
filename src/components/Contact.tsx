import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import { Github, Linkedin, Mail, ArrowUpRight, Satellite, Lock } from "./icons"

export function Contact() {
  const { data, isAdmin } = usePortfolio()

  const triggerAdmin = () => {
    window.dispatchEvent(new CustomEvent("open-admin-gate"))
  }

  return (
    <section
      id="contact"
      className="zone-orbit relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16"
    >
      <div className="reveal relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-white via-[#f8faf7] to-[#eef4ee] px-8 py-12 text-center shadow-md lg:px-16 lg:py-16">
        <div className="mb-4 flex items-center justify-center gap-2 text-primary">
          <Satellite width={20} height={20} />
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Orbital Uplink · Open Channel
          </span>
        </div>
        <Editable
          field="contact.headline"
          as="h2"
          multiline
          className="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight text-primary lg:text-5xl"
        />
        <Editable
          field="contact.sub"
          as="p"
          multiline
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mist lg:text-lg"
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${data.profile.email}`}
            className="group flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light hover:shadow-md"
          >
            <Mail width={18} height={18} /> Email Me Directly
          </a>
          <a
            href={data.social.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-full border border-gold/60 bg-gold/5 px-7 py-3 text-sm font-semibold text-gold-light transition hover:bg-gold hover:text-white"
          >
            <Linkedin width={18} height={18} /> LinkedIn
            <ArrowUpRight
              width={15}
              height={15}
              className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href={data.social.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-primary/20 bg-white px-7 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
          >
            <Github width={18} height={18} /> GitHub Live
          </a>
        </div>

        {/* Solemn Academic Declaration & Resume Passport Photo */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/20 bg-white/95 p-6 text-left shadow-sm backdrop-blur sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
              <span>🛡️ Solemn Academic Declaration</span>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-700">
              OFFICIALLY VERIFIED RECORD
            </span>
          </div>

          <p className="text-sm italic leading-relaxed text-mist">
            "I hereby solemnly declare that all information, academic credentials, research publications, and field experience documented within this portfolio are true, authentic, and verifiable to the best of my knowledge and official institutional records."
          </p>

          <div className="mt-6 flex flex-col gap-5 border-t border-primary/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Formal Resume Photo */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-primary/30 shadow-sm">
                <img
                  src="/resume-photo.png"
                  alt="Neelam Akshit Vinay - Formal Portrait"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="font-display text-base font-bold text-primary">Neelam Akshit Vinay</p>
                <p className="text-xs font-semibold text-primary-light">
                  B.Sc (Hons) Agriculture · M.Sc Remote Sensing &amp; GIS
                </p>
                <p className="font-mono text-[11px] text-gold-light">
                  CSIR-NGRI Trained · SHUATS &amp; ITM Alumnus
                </p>
              </div>
            </div>

            {/* Vector Signature */}
            <div className="flex flex-col items-start sm:items-end">
              <img
                src="/signature/signature.svg"
                alt="Official Signature of N. Akshit Vinay"
                className="h-10 w-auto"
              />
              <span className="mt-1 font-mono text-[10px] text-faint">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>

        {/* Admin Login Prominent Mention */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-between rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20 text-gold-light">
              <Lock width={16} height={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Portfolio Admin Portal</p>
              <p className="text-[11px] text-mist">Manage credentials, edit content &amp; sync GitHub</p>
            </div>
          </div>
          <button
            onClick={triggerAdmin}
            className="rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-white transition hover:bg-gold-light shadow-xs"
          >
            {isAdmin ? "Admin Mode Active" : "Admin Login"}
          </button>
        </div>

        <p className="mt-8 font-mono text-xs text-mist">
          <Editable field="profile.email" /> · <Editable field="profile.location" />
        </p>
      </div>

      <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-6 text-sm text-mist sm:flex-row">
        <p className="text-xs">
          © {new Date().getFullYear()} {data.profile.name}. Transitioning from Soil to Orbit.
        </p>
        <div className="flex items-center gap-4 text-xs">
          <span>B.Sc (Hons) Agriculture</span>
          <span>→</span>
          <span>M.Sc Remote Sensing &amp; GIS</span>
          <span>·</span>
          <button
            onClick={triggerAdmin}
            className="flex items-center gap-1 font-mono text-gold-light hover:underline"
          >
            <Lock width={11} height={11} /> Admin
          </button>
        </div>
      </footer>
    </section>
  )
}
