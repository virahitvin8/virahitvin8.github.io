import { useEffect, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  Lock,
  Satellite,
  Search,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Command,
  FilePdf,
  X,
} from "./icons"

const LINKS = [
  ["telemetry", "Telemetry Lab"],
  ["about", "About"],
  ["linkedin", "LinkedIn"],
  ["deck", "Pitch Deck"],
  ["research", "Publication"],
  ["workflow", "AI Pipeline"],
  ["trajectory", "Trajectory"],
  ["projects", "Projects"],
  ["notes", "Field Notes"],
  ["skills", "Skills"],
  ["certifications", "Credentials"],
  ["resume", "Résumé"],
  ["contact", "Contact"],
] as const

export function Navbar() {
  const {
    data,
    isAdmin,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    setCommandPaletteOpen,
    showToast,
  } = usePortfolio()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const triggerAdmin = () => {
    window.dispatchEvent(new CustomEvent("open-admin-gate"))
  }

  const handleThemeToggle = () => {
    toggleTheme()
    playSound("click", soundEnabled)
  }

  const handleSoundToggle = () => {
    toggleSound()
    playSound("blip", true)
    showToast(soundEnabled ? "Tactile audio muted" : "Tactile audio enabled ✓")
  }

  const handleOpenSearch = () => {
    setCommandPaletteOpen(true)
    playSound("whoosh", soundEnabled)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9000] transition-all duration-300 ${
        scrolled
          ? "border-b border-hair bg-panel-bg/95 shadow-md backdrop-blur-xl py-2.5"
          : "border-b border-transparent bg-panel-bg/70 backdrop-blur-md py-3.5"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Brand identity */}
        <a href="#top" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 shadow-sm transition group-hover:scale-105 group-hover:border-primary">
            {data.profile.avatar ? (
              <img
                src={data.profile.avatar}
                alt={data.profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Satellite width={18} height={18} className="text-primary" />
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card-bg bg-emerald-500 animate-pulse" />
          </span>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base sm:text-lg font-bold tracking-tight text-primary">
                {data.profile.name}
              </span>
              <span className="font-mono text-xs font-black tracking-wider text-gold">/ ASTRA</span>
            </div>
            <span className="font-mono text-[10px] font-medium tracking-wide text-primary-light">
              B.Sc (Hons) Agri &bull; M.Sc RS &amp; GIS
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-5 xl:flex">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-xs font-medium text-mist transition hover:text-primary relative py-1"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Controls: Command Palette trigger, Theme Toggle, Audio Toggle, CV, Admin */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button (Cmd+K) */}
          <button
            onClick={handleOpenSearch}
            className="flex items-center gap-2 rounded-full border border-hair bg-primary/[0.05] px-3 py-1.5 text-xs text-mist hover:text-ink hover:border-primary/40 hover:bg-primary/[0.1] transition shadow-2xs"
            title="Open Command Palette (Cmd+K / Ctrl+K)"
          >
            <Search width={13} height={13} className="text-primary-light" />
            <span className="hidden md:inline font-mono text-[11px]">Search...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-hair bg-card-bg px-1.5 py-0.2 font-mono text-[9px] text-faint">
              <Command width={9} height={9} />K
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary transition shadow-2xs"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun width={15} height={15} className="text-amber-400" /> : <Moon width={15} height={15} className="text-primary" />}
          </button>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleSoundToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary transition shadow-2xs"
            title={soundEnabled ? "Mute audio feedback" : "Enable tactile sound feedback"}
          >
            {soundEnabled ? (
              <Volume2 width={15} height={15} className="text-emerald-500" />
            ) : (
              <VolumeX width={15} height={15} className="text-faint" />
            )}
          </button>

          {/* Download CV */}
          <a
            href={data.profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-primary-light"
          >
            <FilePdf width={13} height={13} />
            <span>CV</span>
          </a>

          {/* Admin Login Button */}
          <button
            onClick={triggerAdmin}
            title="Open Admin Login"
            className="hidden sm:flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1.5 text-xs font-bold text-gold transition hover:bg-gold hover:text-white shadow-2xs"
          >
            <Lock width={12} height={12} />
            <span className="text-[10px]">{isAdmin ? "Admin" : "Login"}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hair bg-card-bg text-mist xl:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X width={18} height={18} /> : <div className="space-y-1"><span className="block h-0.5 w-4 bg-current" /><span className="block h-0.5 w-4 bg-current" /><span className="block h-0.5 w-4 bg-current" /></div>}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-hair bg-panel-bg px-6 py-4 shadow-xl backdrop-blur-2xl xl:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-2">
            {LINKS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-xs font-medium text-ink hover:bg-primary/[0.08]"
              >
                {label}
              </a>
            ))}

            <div className="mt-3 pt-3 border-t border-hair flex items-center justify-between">
              <a
                href={data.profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
              >
                <FilePdf width={14} height={14} />
                <span>Download CV</span>
              </a>

              <button
                onClick={() => {
                  setMobileOpen(false)
                  triggerAdmin()
                }}
                className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold"
              >
                <Lock width={12} height={12} />
                <span>{isAdmin ? "Admin Active" : "Admin Login"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
