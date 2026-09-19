import { useState, useEffect, useRef } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sparkle,
  Sprout,
  Satellite,
  Compass,
  Shield,
  Layers,
  Award,
  ArrowUpRight,
} from "./icons"

interface SlideData {
  id: number
  tag: string
  title: string
  subtitle: string
  highlight: string
  accentColor: string
  icon: typeof Sprout
  bullets: string[]
  metric: { value: string; label: string }
  formulaOrCode?: string
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    tag: "01 / EXECUTIVE VISION",
    title: "Grounded in Soil. Looking Beyond Earth.",
    subtitle: "Bridging living crop biology with aerospace remote sensing & spatial intelligence.",
    highlight: "Dual Academic Mastery",
    accentColor: "from-emerald-600/30 via-teal-600/20 to-transparent",
    icon: Sprout,
    bullets: [
      "ICAR accredited B.Sc (Hons) Agriculture background with deep immersion in soil chemistry, crop physiology, and plant pathology.",
      "M.Sc Remote Sensing & GIS at SHUATS, maintaining a perfect 10.0 CGPA across all semesters.",
      "National institute training at CSIR-NGRI Hyderabad on Earth surface processes and hydrological terrain modeling.",
    ],
    metric: { value: "10.0 CGPA", label: "M.Sc Remote Sensing & GIS (SHUATS)" },
  },
  {
    id: 2,
    tag: "02 / PUBLISHED RESEARCH",
    title: "Sorghum Dhurrin & Cyanogenic Glycosides",
    subtitle: "Biochemical investigation published in Agri Express (E-ISSN: 2584-2498).",
    highlight: "Peer-Reviewed Science",
    accentColor: "from-amber-600/30 via-yellow-600/20 to-transparent",
    icon: Award,
    bullets: [
      "Investigated Dhurrin cyanogenic glycoside biosynthesis and enzymatic hydrolysis into toxic free HCN under moisture stress.",
      "Established critical livestock grazing safety threshold (<200 ppm dry weight safe for ruminants).",
      "Correlated plant physiological defense mechanisms against insect pests in rainfed semi-arid zones.",
    ],
    metric: { value: "May 2024", label: "Published in Agri Express (Vol 02)" },
    formulaOrCode: "Dhurrin + H2O ──(Dhurrinase)──> p-Hydroxybenzaldehyde + HCN + Glucose",
  },
  {
    id: 3,
    tag: "03 / UAV DRONE TECHNOLOGY",
    title: "Autonomous Multispectral Photogrammetry",
    subtitle: "High-resolution calibrated canopy health surveys via aerial multi-rotor platforms.",
    highlight: "Sub-Decimeter Precision",
    accentColor: "from-teal-600/30 via-cyan-600/20 to-transparent",
    icon: Shield,
    bullets: [
      "Planned and executed automated grid flight missions at 80m AGL capturing Green, Red, RedEdge, and NIR bands.",
      "Generated orthomosaics and digital surface models (DSM) calibrated with downwelling light sensors and reflectance panels.",
      "Computed NDVI, NDRE, and SAVI vegetation indices in Pix4D to detect nitrogen stress 12 days prior to visual symptoms.",
    ],
    metric: { value: "80m AGL", label: "Autonomous Flight Surveying Altitude" },
    formulaOrCode: "NDVI = (NIR - Red) / (NIR + Red)  |  NDRE = (NIR - RE) / (NIR + RE)",
  },
  {
    id: 4,
    tag: "04 / CSIR-NGRI HYDRAULICS",
    title: "Earth Surface Processes & DEM Watersheds",
    subtitle: "Advanced terrain delineation and geophysical lineament mapping at CSIR-NGRI Hyderabad.",
    highlight: "National Institute Training",
    accentColor: "from-indigo-600/30 via-blue-600/20 to-transparent",
    icon: Compass,
    bullets: [
      "Processed 30m SRTM Digital Elevation Models with Wang & Liu sink-filling algorithms to eliminate hydrological artifacts.",
      "Extracted drainage networks using D8 steepest descent flow routing and Strahler stream hierarchy orders.",
      "Delineated 450+ sq km catchment sub-basins and integrated electrical resistivity (ERT) with satellite lineaments for aquifer recharge zoning.",
    ],
    metric: { value: "450+ km²", label: "Delineated Catchment Basin Modeling" },
  },
  {
    id: 5,
    tag: "05 / ORBITAL SATELLITE TELEMETRY",
    title: "Space-Borne Earth Observation (705km)",
    subtitle: "Ingesting Sentinel-2 and Landsat-8 multi-temporal spectral constellations.",
    highlight: "Planetary Scale Analysis",
    accentColor: "from-purple-600/30 via-indigo-600/20 to-transparent",
    icon: Satellite,
    bullets: [
      "Harmonized optical Sentinel-2 MSI and Landsat-8 OLI surface reflectance rasters for regional crop vigor dynamics.",
      "Applied raster algebraic models for soil salinity detection, crop canopy water stress, and drought early warning.",
      "Pioneered ground-to-space integration: cross-calibrating ground soil data with drone NDVI and orbital radar lineaments.",
    ],
    metric: { value: "705 km", label: "Orbital Space Telemetry Altitude" },
  },
  {
    id: 6,
    tag: "06 / FUTURE HORIZONS",
    title: "Autonomous Multi-Agent Geospatial Systems",
    subtitle: "The convergence of AI agents, drone swarms, and satellite intelligence for food security.",
    highlight: "Next-Gen AgTech",
    accentColor: "from-emerald-600/30 via-gold/20 to-transparent",
    icon: Layers,
    bullets: [
      "Synthesizing 5 distinct intelligence layers: Ground Agronomy → UAV Drones → GIS Modeling → Satellite Feeds → AI Orchestrator.",
      "Delivering variable-rate prescriptive input maps for nitrogen, irrigation, and pesticide application directly to farm machinery.",
      "Open to research fellowships, international GIS collaborations, and precision agricultural technology leadership.",
    ],
    metric: { value: "5 Layers", label: "Integrated Autonomous Pipeline" },
  },
]

export function PresentationDeck() {
  const { soundEnabled } = usePortfolio()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const deckContainerRef = useRef<HTMLDivElement>(null)

  // Auto-advance presentation (Canva slideshow mode)
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
      playSound("whoosh", soundEnabled)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPlaying, soundEnabled])

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
        playSound("whoosh", soundEnabled)
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
        playSound("whoosh", soundEnabled)
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [soundEnabled, isFullscreen])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    playSound("whoosh", soundEnabled)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
    playSound("whoosh", soundEnabled)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    playSound("blip", soundEnabled)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    playSound("click", soundEnabled)
  }

  const slide = SLIDES[currentSlide]
  const Icon = slide.icon

  return (
    <section id="deck" className="relative px-6 py-14 lg:px-10 lg:py-18">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-hair pb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold">04</span>
            <span className="h-px w-6 bg-gold/40" />
            <span className="hud-label text-primary">Interactive Presentation Deck</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                Canva &amp; PowerPoint Presentation Deck
              </h2>
              <p className="mt-1 text-sm text-mist">
                Cinematic research pitch deck with morph slide transitions, autoplay slideshow mode, and full-screen presentation view.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-hair bg-primary/[0.06] px-3 py-1 font-mono text-[11px] font-bold text-primary">
                Press &larr; / &rarr; to Navigate
              </span>
            </div>
          </div>
        </div>

        {/* Deck Container */}
        <div
          ref={deckContainerRef}
          className={`relative overflow-hidden rounded-3xl border border-hair bg-panel-bg shadow-2xl transition-all duration-500 ${
            isFullscreen
              ? "fixed inset-0 z-[9999] rounded-none flex flex-col justify-between p-6 sm:p-12 bg-black/95 backdrop-blur-2xl"
              : "aspect-[16/9] min-h-[500px] flex flex-col justify-between"
          }`}
        >
          {/* Top Edge Progress Bar (Canva Stories Style) */}
          <div className="absolute top-0 inset-x-0 h-1 bg-hair z-30 flex">
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                className="h-full flex-1 border-r border-card-bg/40 last:border-r-0 bg-card-bg overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400 w-full"
                      : idx < currentSlide
                      ? "bg-primary w-full"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Top Navigation Bar inside Deck */}
          <div className="relative z-20 flex items-center justify-between border-b border-hair/60 bg-card-bg/40 px-6 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Icon width={14} height={14} />
              </span>
              <div>
                <span className="font-mono text-xs font-bold text-primary tracking-wider">
                  {slide.tag}
                </span>
              </div>
            </div>

            {/* Deck Action Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={togglePlay}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 transition ${
                  isPlaying
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-500 font-bold"
                    : "border-hair bg-card-bg text-mist hover:text-ink"
                }`}
                title={isPlaying ? "Pause autoplay" : "Start Canva-style autoplay"}
              >
                {isPlaying ? <Pause width={12} height={12} /> : <Play width={12} height={12} />}
                <span className="hidden sm:inline">{isPlaying ? "Autoplay ON" : "Slideshow"}</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 rounded-full border border-hair bg-card-bg px-3 py-1 text-mist hover:text-ink transition"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Presentation"}
              >
                {isFullscreen ? <Minimize2 width={12} height={12} /> : <Maximize2 width={12} height={12} />}
                <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
              </button>
            </div>
          </div>

          {/* Slide Content with Morph Transition Effect */}
          <div className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-10 flex items-center justify-center">
            {/* Ambient Background Gradient for Slide */}
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${slide.accentColor} opacity-30 transition-opacity duration-700`}
            />

            <div
              key={slide.id}
              className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                {/* Left Text Content (7 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold text-primary">
                    <Sparkle width={12} height={12} />
                    <span>{slide.highlight}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
                    {slide.title}
                  </h3>

                  <p className="text-sm sm:text-base text-mist font-medium leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Bullet Points */}
                  <div className="mt-4 space-y-2.5 pt-2">
                    {slide.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink leading-relaxed">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Formula / Code Snippet */}
                  {slide.formulaOrCode && (
                    <div className="mt-4 rounded-xl border border-hair bg-card-bg/90 p-3 font-mono text-xs text-primary shadow-2xs overflow-x-auto">
                      {slide.formulaOrCode}
                    </div>
                  )}
                </div>

                {/* Right Metric Card (4 cols) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center">
                  <div className="w-full rounded-3xl border border-hair bg-card-bg/80 p-6 text-center shadow-xl backdrop-blur-xl transition hover:border-primary/40">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-primary border border-primary/20 shadow-inner">
                      <Icon width={28} height={28} />
                    </div>
                    <strong className="block font-display text-3xl sm:text-4xl font-black text-primary">
                      {slide.metric.value}
                    </strong>
                    <span className="mt-1 block font-mono text-xs text-mist leading-snug">
                      {slide.metric.label}
                    </span>
                    <div className="mt-4 pt-3 border-t border-hair font-mono text-[10px] text-faint">
                      Verified Portfolio Milestone
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls Bar & Slide Thumbnails */}
          <div className="relative z-20 border-t border-hair/60 bg-card-bg/60 px-6 py-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            {/* Slide Indicator & Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary transition shadow-2xs"
                title="Previous Slide (Arrow Left)"
              >
                <ChevronLeft width={16} height={16} />
              </button>

              <div className="px-3 font-mono text-xs font-bold text-primary">
                <span>0{slide.id}</span>
                <span className="text-faint mx-1.5">/</span>
                <span className="text-mist">0{SLIDES.length}</span>
              </div>

              <button
                onClick={nextSlide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-card-bg text-mist hover:text-ink hover:border-primary transition shadow-2xs"
                title="Next Slide (Arrow Right)"
              >
                <ChevronRight width={16} height={16} />
              </button>
            </div>

            {/* Slide Dots / Thumbnails */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlide(idx)
                    playSound("click", soundEnabled)
                  }}
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] transition-all flex items-center gap-1 ${
                    idx === currentSlide
                      ? "bg-primary text-white font-bold shadow-xs scale-105"
                      : "bg-card-bg border border-hair text-mist hover:text-ink"
                  }`}
                  title={s.title}
                >
                  <span>{s.id}</span>
                  <span className="hidden md:inline">{s.highlight}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
