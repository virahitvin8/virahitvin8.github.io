import { useEffect, useState, useRef, useMemo } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  Search,
  Command,
  X,
  FilePdf,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Github,
  Linkedin,
  ArrowUpRight,
  Sparkle,
  Layers,
  Compass,
  Satellite,
  Shield,
  Sprout,
  Check,
  Copy,
} from "./icons"

interface PaletteItem {
  id: string
  title: string
  subtitle?: string
  category: "Navigation" | "Projects & Research" | "Actions" | "Skills"
  icon: any
  action: () => void
  keywords?: string
}

export function CommandPalette() {
  const {
    data,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    commandPaletteOpen,
    setCommandPaletteOpen,
    setSelectedProject,
    showToast,
  } = usePortfolio()

  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Listen for Cmd+K, Ctrl+K, or / key shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
        playSound("whoosh", soundEnabled)
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        setCommandPaletteOpen(true)
        playSound("whoosh", soundEnabled)
      } else if (e.key === "Escape" && commandPaletteOpen) {
        e.preventDefault()
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen, soundEnabled])

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
  }, [commandPaletteOpen])

  // Assemble searchable items
  const allItems = useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = []

    // 1. Navigation items
    const navSections = [
      { id: "top", title: "Hero & Trajectory Overview", subtitle: "Top of portfolio", icon: Compass },
      { id: "about", title: "About Academic Journey", subtitle: "Agronomy to space telemetry", icon: Sprout },
      { id: "linkedin", title: "LinkedIn Professional Showcase", subtitle: "Verified endorsements & recommendations", icon: Check },
      { id: "deck", title: "Canva & PowerPoint Presentation Deck", subtitle: "Interactive pitch deck with morph transitions", icon: Sparkle },
      { id: "research", title: "Published Research (Agri Express)", subtitle: "HCN in Sorghum biochemistry", icon: Sparkle },
      { id: "trajectory", title: "Altitude Trajectory (Education & Experience)", subtitle: "0m Soil to 705km Orbit", icon: Satellite },
      { id: "projects", title: "Practical Work & Projects", subtitle: "Filterable bento showcase", icon: Layers },
      { id: "skills", title: "Skills Matrix & Software Tools", subtitle: "ArcGIS, QGIS, NDVI, UAV, MATLAB", icon: Shield },
      { id: "certifications", title: "Verified Credentials & Certifications", subtitle: "CSIR-NGRI, ANGRAU, ITM", icon: Check },
      { id: "resume", title: "Official Résumé & CV", subtitle: "PDF view & download", icon: FilePdf },
      { id: "contact", title: "Contact & Command Terminal", subtitle: "Get in touch / send message", icon: Mail },
    ]

    navSections.forEach((s) => {
      items.push({
        id: `nav-${s.id}`,
        title: s.title,
        subtitle: s.subtitle,
        category: "Navigation",
        icon: s.icon,
        action: () => {
          setCommandPaletteOpen(false)
          const el = document.getElementById(s.id)
          if (el) el.scrollIntoView({ behavior: "smooth" })
        },
      })
    })

    // 2. Projects & Research
    data.projects.forEach((p) => {
      items.push({
        id: `proj-${p.id}`,
        title: p.title,
        subtitle: `${p.category} · ${p.tags.slice(0, 3).join(", ")}`,
        category: "Projects & Research",
        icon: Layers,
        keywords: `${p.description} ${p.tags.join(" ")}`,
        action: () => {
          setCommandPaletteOpen(false)
          setSelectedProject(p)
          playSound("blip", soundEnabled)
        },
      })
    })

    // 3. Quick Actions
    items.push({
      id: "act-cv",
      title: "Download Official CV (PDF)",
      subtitle: data.profile.resumeName,
      category: "Actions",
      icon: FilePdf,
      action: () => {
        setCommandPaletteOpen(false)
        const a = document.createElement("a")
        a.href = data.profile.cvUrl
        a.download = data.profile.resumeName
        a.target = "_blank"
        a.click()
        showToast("Downloading CV...")
      },
    })

    items.push({
      id: "act-copy-email",
      title: "Copy Email Address",
      subtitle: data.profile.email,
      category: "Actions",
      icon: Copy,
      action: () => {
        setCommandPaletteOpen(false)
        navigator.clipboard.writeText(data.profile.email)
        showToast("Email copied to clipboard: " + data.profile.email)
        playSound("chime", soundEnabled)
      },
    })

    items.push({
      id: "act-theme",
      title: `Switch to ${theme === "dark" ? "Executive Light" : "Geospatial Dark"} Mode`,
      subtitle: `Current theme: ${theme}`,
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme()
        playSound("click", soundEnabled)
      },
    })

    items.push({
      id: "act-sound",
      title: `${soundEnabled ? "Disable" : "Enable"} Tactile Audio FX`,
      subtitle: `Current: ${soundEnabled ? "Audio On" : "Muted"}`,
      category: "Actions",
      icon: soundEnabled ? VolumeX : Volume2,
      action: () => {
        toggleSound()
        playSound("blip", true)
        showToast(soundEnabled ? "Audio muted" : "Tactile audio enabled ✓")
      },
    })

    items.push({
      id: "act-github",
      title: "Open GitHub Profile",
      subtitle: data.social.githubUrl,
      category: "Actions",
      icon: Github,
      action: () => {
        window.open(data.social.githubUrl, "_blank")
      },
    })

    items.push({
      id: "act-linkedin",
      title: "Open LinkedIn Profile",
      subtitle: "Neelam Akshit Vinay",
      category: "Actions",
      icon: Linkedin,
      action: () => {
        window.open(data.social.linkedinUrl, "_blank")
      },
    })

    // 4. Skills Quick Jump
    data.skills.forEach((g) => {
      g.items.forEach((skill) => {
        items.push({
          id: `skill-${skill}`,
          title: skill,
          subtitle: `${g.label} Skill`,
          category: "Skills",
          icon: Shield,
          keywords: g.label,
          action: () => {
            setCommandPaletteOpen(false)
            const el = document.getElementById("skills")
            if (el) el.scrollIntoView({ behavior: "smooth" })
            showToast(`Skill focused: ${skill}`)
          },
        })
      })
    })

    return items
  }, [data, theme, toggleTheme, soundEnabled, toggleSound, setCommandPaletteOpen, setSelectedProject, showToast])

  // Filtered items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems
    const q = query.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.keywords && item.keywords.toLowerCase().includes(q)),
    )
  }, [allItems, query])

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

  // Key navigation inside palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1 < filteredItems.length ? i + 1 : 0))
      playSound("click", soundEnabled)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 >= 0 ? i - 1 : filteredItems.length - 1))
      playSound("click", soundEnabled)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const selected = filteredItems[selectedIndex]
      if (selected) {
        selected.action()
      }
    }
  }

  if (!commandPaletteOpen) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center p-4 pt-16 sm:pt-24 backdrop-blur-md bg-black/60 transition-all duration-200"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/30 bg-card-bg shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 border-b border-hair px-4 py-3.5">
          <Search width={18} height={18} className="text-primary-light shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command, project, skill, or section..."
            className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-faint focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="rounded border border-hair bg-primary/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-faint">
              ESC
            </kbd>
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="rounded p-1 text-faint hover:text-ink transition"
            >
              <X width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 scroll-smooth">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-mono text-xs text-faint">No results found for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-[11px] text-faint">Try searching for ArcGIS, NDVI, Research, or CV</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/[0.12] text-primary border border-primary/30 shadow-xs"
                      : "text-ink hover:bg-primary/[0.05] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? "bg-primary text-white" : "bg-primary/[0.08] text-primary"
                      }`}
                    >
                      <Icon width={14} height={14} />
                    </span>
                    <div className="truncate">
                      <div className="font-semibold text-ink flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-faint px-1.5 py-0.2 rounded bg-primary/[0.04]">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="truncate text-[11px] text-faint">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isSelected && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">
                        <span>↵ Select</span>
                      </kbd>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-hair bg-primary/[0.02] px-4 py-2 text-[11px] text-faint font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <Command width={12} height={12} />
            <span className="font-semibold">Akshit Vinay Portfolio Engine</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RadarIcon(props: any) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx={12} cy={12} r={10} />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <line x1={12} y1={12} x2={19} y2={5} />
    </svg>
  )
}
