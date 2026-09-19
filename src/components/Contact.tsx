import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Editable } from "./admin/Editable"
import { playSound } from "./SoundFX"
import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Satellite,
  Lock,
  Terminal,
  Copy,
  Check,
  MapPin,
  Sparkle,
} from "./icons"

export function Contact() {
  const { data, isAdmin, soundEnabled, showToast } = usePortfolio()

  // Terminal state
  const [termInput, setTermInput] = useState("")
  const [termHistory, setTermHistory] = useState<Array<{ cmd: string; out: string }>>([
    {
      cmd: "whoami",
      out: "N. Akshit Vinay — B.Sc (Hons) Agriculture & M.Sc Remote Sensing and GIS Scholar (CSIR-NGRI Trained).",
    },
    {
      cmd: "telemetry --status",
      out: "Active. Open for Geospatial, Earth Observation & Precision Agriculture research and roles.",
    },
  ])

  // Contact form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [emailCopied, setEmailCopied] = useState(false)

  const triggerAdmin = () => {
    window.dispatchEvent(new CustomEvent("open-admin-gate"))
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.profile.email)
    setEmailCopied(true)
    showToast("Email copied: " + data.profile.email)
    playSound("chime", soundEnabled)
    setTimeout(() => setEmailCopied(false), 2400)
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = termInput.trim().toLowerCase()
    if (!cmd) return

    let out = ""
    if (cmd === "help") {
      out = "Available commands: whoami, skills, projects, research, cv, contact, clear"
    } else if (cmd === "whoami") {
      out = `${data.profile.name} — ${data.profile.tagline}`
    } else if (cmd === "skills") {
      out = "ArcGIS, QGIS, NDVI/NDRE, Drone UAV Mapping, MATLAB, ERT Geophysics, Hydroponics NFT, Soil Science."
    } else if (cmd === "projects") {
      out = data.projects.map((p, i) => `[${i + 1}] ${p.title} (${p.category})`).join("\n")
    } else if (cmd === "research") {
      out = "Published: 'Unlocking Potential of HCN Content in Sorghum' in Agri Express (E-ISSN: 2584-2498)."
    } else if (cmd === "cv") {
      out = `Opening CV document (${data.profile.resumeName})...`
      const a = document.createElement("a")
      a.href = data.profile.cvUrl
      a.download = data.profile.resumeName
      a.target = "_blank"
      a.click()
    } else if (cmd === "contact") {
      out = `Email: ${data.profile.email} | Location: ${data.profile.location}`
    } else if (cmd === "clear") {
      setTermHistory([])
      setTermInput("")
      return
    } else {
      out = `Command not recognized: '${cmd}'. Type 'help' for available commands.`
    }

    setTermHistory((prev) => [...prev, { cmd: termInput, out }])
    setTermInput("")
    playSound("terminal", soundEnabled)
  }

  const handleQuickCmd = (cmd: string) => {
    setTermInput(cmd)
    playSound("click", soundEnabled)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      showToast("Please complete all form fields.")
      return
    }
    const mailto = `mailto:${data.profile.email}?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    )}`
    window.location.href = mailto
    showToast("Launching default mail client...")
    playSound("whoosh", soundEnabled)
  }

  return (
    <section
      id="contact"
      className="zone-orbit relative mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20"
    >
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card-bg p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-primary uppercase">
            <Satellite width={15} height={15} />
            <span>Orbital Uplink &bull; Interactive Contact Deck</span>
          </div>

          <Editable
            field="contact.headline"
            as="h2"
            multiline
            className="font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl"
          />

          <Editable
            field="contact.sub"
            as="p"
            multiline
            className="mt-3 text-sm sm:text-base leading-relaxed text-mist"
          />
        </div>

        {/* Two Columns: Interactive Terminal (Left) + Quick Contact Form (Right) */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive Developer CLI Terminal (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl border border-hair bg-black/90 dark:bg-black/95 p-5 text-emerald-400 font-mono text-xs shadow-xl">
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[11px] text-white/50">bash — terminal@akshit-satellite: ~</span>
              </div>
              <Terminal width={14} height={14} className="text-emerald-400/60" />
            </div>

            {/* Quick command buttons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["help", "whoami", "skills", "projects", "research", "cv", "clear"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleQuickCmd(c)}
                  className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 transition"
                >
                  ${c}
                </button>
              ))}
            </div>

            {/* Terminal Output history */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scroll-smooth">
              {termHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-white/80">
                    <span className="text-emerald-400 font-bold">visitor@terminal:~$</span> {item.cmd}
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap pl-3 text-[11px] leading-relaxed">
                    {item.out}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Line */}
            <form onSubmit={handleTerminalSubmit} className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">visitor@terminal:~$</span>
              <input
                type="text"
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                placeholder="Type 'help' or command..."
                className="w-full bg-transparent text-white focus:outline-none placeholder:text-white/30 text-xs"
              />
            </form>
          </div>

          {/* Right Column: Direct Message Form & Direct Social Buttons (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-hair bg-primary/[0.03] p-5 sm:p-6 shadow-sm">
            <form onSubmit={handleSendMessage} className="space-y-4">
              <h4 className="font-display text-lg font-bold text-primary">
                Send a Direct Message
              </h4>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-faint block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    required
                    className="w-full rounded-xl border border-hair bg-card-bg px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] text-faint block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    required
                    className="w-full rounded-xl border border-hair bg-card-bg px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] text-faint block mb-1">Message / Collaboration Scope</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Discussing remote sensing research, precision farming projects, or professional opportunities..."
                  required
                  className="w-full rounded-xl border border-hair bg-card-bg p-3 text-xs text-ink focus:border-primary focus:outline-none shadow-2xs resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-light transition"
                >
                  <Mail width={14} height={14} />
                  <span>Send Message</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-4 py-2 font-mono text-xs font-semibold text-mist hover:text-ink hover:border-primary transition"
                >
                  {emailCopied ? <Check width={13} height={13} className="text-emerald-500" /> : <Copy width={13} height={13} />}
                  <span>{emailCopied ? "Email Copied ✓" : "Copy Email"}</span>
                </button>
              </div>
            </form>

            {/* Quick Social Badges */}
            <div className="mt-6 pt-5 border-t border-hair flex flex-wrap items-center gap-3">
              <a
                href={data.social.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-3.5 py-1.5 font-mono text-xs font-bold text-mist hover:text-ink hover:border-primary transition"
              >
                <Linkedin width={14} height={14} />
                <span>LinkedIn</span>
                <ArrowUpRight width={12} height={12} />
              </a>

              <a
                href={data.social.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-3.5 py-1.5 font-mono text-xs font-bold text-mist hover:text-ink hover:border-primary transition"
              >
                <Github width={14} height={14} />
                <span>GitHub Live</span>
                <ArrowUpRight width={12} height={12} />
              </a>

              <div className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-faint">
                <MapPin width={13} height={13} className="text-primary" />
                <span>{data.profile.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solemn Academic Declaration & Resume Passport Photo */}
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-primary/20 bg-card-bg p-6 text-left shadow-md backdrop-blur-xl sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
              <span>🛡️ Solemn Academic Declaration</span>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              OFFICIALLY VERIFIED RECORD
            </span>
          </div>

          <p className="text-sm italic leading-relaxed text-mist">
            &ldquo;I hereby solemnly declare that all information, academic credentials, research publications, and field experience documented within this portfolio are true, authentic, and verifiable to the best of my knowledge and official institutional records.&rdquo;
          </p>

          <div className="mt-6 flex flex-col gap-5 border-t border-hair pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/30 shadow-sm">
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
                <p className="font-mono text-[11px] text-gold">
                  CSIR-NGRI Trained · SHUATS (10.0 CGPA) &amp; ITM Alumnus
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <img
                src="/signature/signature.svg"
                alt="Official Signature of N. Akshit Vinay"
                className="h-10 w-auto brightness-95 contrast-125 dark:invert"
              />
              <span className="mt-1 font-mono text-[10px] text-faint">
                Authorized Signatory
              </span>
            </div>
          </div>
        </div>

        {/* Admin Login Box */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-between rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/20 text-gold">
              <Lock width={16} height={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">Portfolio Admin Portal</p>
              <p className="text-[11px] text-mist">Manage credentials, edit content &amp; sync GitHub</p>
            </div>
          </div>
          <button
            onClick={triggerAdmin}
            className="rounded-xl bg-gold px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-gold-light shadow-xs"
          >
            {isAdmin ? "Admin Active" : "Admin Login"}
          </button>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hair pt-6 text-sm text-mist sm:flex-row">
        <p className="text-xs font-mono text-faint">
          © {new Date().getFullYear()} {data.profile.name}. Transitioning from Soil to Space.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-primary-light font-bold">B.Sc (Hons) Agriculture</span>
          <span>→</span>
          <span className="text-primary font-bold">M.Sc Remote Sensing &amp; GIS</span>
          <span>·</span>
          <button
            onClick={triggerAdmin}
            className="flex items-center gap-1 text-gold hover:underline"
          >
            <Lock width={11} height={11} /> Admin
          </button>
        </div>
      </footer>
    </section>
  )
}
