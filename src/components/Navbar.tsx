import { useEffect, useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { Satellite } from "./icons"

const LINKS = [
  ["about", "About"],
  ["education", "Education"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["certifications", "Credentials"],
  ["resume", "Résumé"],
  ["feeds", "Live"],
  ["contact", "Contact"],
] as const

export function Navbar() {
  const { data } = usePortfolio()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9000] transition-all duration-500 ${
        scrolled
          ? "border-b border-hair bg-void/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="group flex items-center gap-2.5">
          {/* The owner's own header image rather than a generic glyph; the
              satellite mark stays as the fallback if it cannot be loaded. */}
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gold/50 text-neon transition group-hover:scale-105">
            <Satellite width={18} height={18} />
            {data.profile.avatar && (
              <img
                src={data.profile.avatar}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </span>
          <span className="font-display text-lg tracking-tight text-ink">
            {data.profile.shortName}
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative text-sm text-mist transition hover:text-neon after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-neon after:transition-all hover:after:w-full"
            >
              {label}
            </a>
          ))}
          <a
            href={data.profile.cvUrl}
            className="rounded-full border border-gold/50 px-5 py-2 text-sm font-medium text-gold-light transition hover:bg-gold hover:text-void"
          >
            Download CV
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-px w-6 bg-ink transition ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-px w-6 bg-ink transition ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-hair bg-void/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="py-1 text-mist transition hover:text-neon"
              >
                {label}
              </a>
            ))}
            <a
              href={data.profile.cvUrl}
              className="mt-2 rounded-full border border-gold/50 px-5 py-2 text-center text-sm text-gold-light"
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
