import { useEffect, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Lock, Satellite } from "./icons"

const LINKS = [
  ["about", "About"],
  ["education", "Education"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["certifications", "Credentials"],
  ["resume", "Résumé"],
  ["feeds", "GitHub Live"],
  ["contact", "Contact"],
] as const

export function Navbar() {
  const { data, isAdmin } = usePortfolio()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const triggerAdmin = () => {
    window.dispatchEvent(new CustomEvent("open-admin-gate"))
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9000] transition-all duration-300 ${
        scrolled
          ? "border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur-md py-2.5"
          : "border-b border-transparent bg-white/60 backdrop-blur-xs py-3.5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#top" className="group flex items-center gap-3">
          {/* Resume formal portrait beside the name */}
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 shadow-sm transition group-hover:scale-105 group-hover:border-primary">
            {data.profile.avatar ? (
              <img
                src={data.profile.avatar}
                alt={data.profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Satellite width={18} height={18} className="text-primary" />
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-primary">
              {data.profile.name}
            </span>
            <span className="font-mono text-[10px] font-medium tracking-wide text-primary-light">
              B.Sc (Hons) Agri · M.Sc RS &amp; GIS
            </span>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative text-sm font-medium text-mist transition hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {label}
            </a>
          ))}

          {/* Download CV */}
          <a
            href={data.profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-primary/30 bg-primary/[0.04] px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Download CV
          </a>

          {/* Admin Login Button */}
          <button
            onClick={triggerAdmin}
            title="Open Admin Login"
            className="flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 text-xs font-bold text-gold-light transition hover:bg-gold hover:text-white shadow-xs"
          >
            <Lock width={13} height={13} />
            <span>{isAdmin ? "Admin ON" : "Admin Login"}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={triggerAdmin}
            className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-light"
          >
            <Lock width={12} height={12} />
            <span>Admin</span>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-primary/15"
            aria-label="Menu"
          >
            <span
              className={`h-0.5 w-5 bg-primary transition ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-primary transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-primary transition ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-primary/10 bg-white/98 px-6 py-4 shadow-xl backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-2.5">
            {LINKS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="py-1 text-sm font-medium text-mist transition hover:text-primary"
              >
                {label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-primary/10 pt-3">
              <a
                href={data.profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-primary/30 py-2 text-center text-xs font-semibold text-primary"
              >
                Download CV
              </a>
              <button
                onClick={() => {
                  setOpen(false)
                  triggerAdmin()
                }}
                className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-center text-xs font-bold text-white"
              >
                <Lock width={13} height={13} />
                <span>Admin Login (PIN: 2080)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
