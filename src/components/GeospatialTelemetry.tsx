import { useState, useEffect } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  Satellite,
  Compass,
  Layers,
  MapPin,
  Activity,
  Cpu,
  Sprout,
  Shield,
  Sparkle,
} from "./icons"

type BandMode = "rgb" | "nir" | "ndvi" | "dem"

interface Station {
  name: string
  lat: string
  lon: string
  role: string
  alt: string
}

const STATIONS: Station[] = [
  {
    name: "CSIR – NGRI Hyderabad",
    lat: "17.4123° N",
    lon: "78.5529° E",
    role: "Earth Surface Processes & Watershed Modeling",
    alt: "505m MSL",
  },
  {
    name: "SHUATS Prayagraj",
    lat: "25.4190° N",
    lon: "81.8540° E",
    role: "M.Sc Remote Sensing & GIS (10.0 CGPA)",
    alt: "98m MSL",
  },
  {
    name: "ITM University Gwalior",
    lat: "26.1384° N",
    lon: "78.2078° E",
    role: "B.Sc (Hons) Agriculture (8.78 GPA)",
    alt: "197m MSL",
  },
  {
    name: "Nellore, Andhra Pradesh",
    lat: "14.4426° N",
    lon: "79.9865° E",
    role: "Base & Regional Agronomic Field Surveys",
    alt: "19m MSL",
  },
]

export function GeospatialTelemetry() {
  const { soundEnabled } = usePortfolio()
  const [band, setBand] = useState<BandMode>("ndvi")
  const [activeStation, setActiveStation] = useState(0)
  const [timeStr, setTimeStr] = useState("")

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST",
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBandSelect = (b: BandMode) => {
    setBand(b)
    playSound("click", soundEnabled)
  }

  const handleStationSelect = (idx: number) => {
    setActiveStation(idx)
    playSound("blip", soundEnabled)
  }

  return (
    <section id="telemetry" className="zone-aerial relative overflow-hidden px-6 py-14 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-hair pb-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gold">01</span>
              <span className="h-px w-6 bg-gold/40" />
              <span className="hud-label text-primary">Interactive Laboratory</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-primary">
              Geospatial &amp; Agro-Telemetry Deck
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-mist">
            <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-card-bg px-3 py-1 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE TELEMETRY</span>
            </span>
            <span className="rounded-full border border-hair bg-card-bg px-3 py-1 font-bold text-primary">
              {timeStr}
            </span>
          </div>
        </div>

        {/* Main Grid: Spectral Simulator (Left 7) + Station Radar (Right 5) */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left: Multispectral Band Visualizer */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl border border-primary/20 bg-card-bg p-6 sm:p-7 shadow-lg backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hair pb-4">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Layers width={14} height={14} />
                  Multispectral Canopy Simulator
                </span>
                <p className="text-xs text-faint mt-0.5">
                  Interactive satellite spectral band synthesis for precision agriculture
                </p>
              </div>

              {/* Band mode pills */}
              <div className="flex items-center rounded-xl bg-primary/[0.06] p-1 gap-1 border border-hair">
                {(
                  [
                    { id: "rgb", label: "True RGB", note: "B4, B3, B2" },
                    { id: "nir", label: "Color IR", note: "B8, B4, B3" },
                    { id: "ndvi", label: "NDVI Vigor", note: "NIR-Red" },
                    { id: "dem", label: "DEM Surface", note: "Elevation" },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBandSelect(b.id)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
                      band === b.id
                        ? "bg-primary text-white shadow-xs"
                        : "text-mist hover:text-ink hover:bg-primary/[0.05]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Canopy Surface Canvas / Viewport */}
            <div className="relative mt-5 aspect-video sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hair shadow-inner">
              {/* Simulated Spectral Render Layers */}
              {band === "rgb" && (
                <div className="h-full w-full bg-gradient-to-tr from-emerald-800 via-green-700 to-lime-600 relative flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="z-10 rounded-xl bg-black/60 p-4 text-white backdrop-blur-md max-w-sm border border-white/20 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
                      Optical True-Color Mode (RGB)
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      Standard visual observation of crop vegetative canopy. Reflects natural chlorophyll green, soil tillage, and field boundary zoning.
                    </p>
                  </div>
                </div>
              )}

              {band === "nir" && (
                <div className="h-full w-full bg-gradient-to-tr from-rose-900 via-pink-700 to-amber-600 relative flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:18px_18px]" />
                  <div className="z-10 rounded-xl bg-black/60 p-4 text-white backdrop-blur-md max-w-sm border border-white/20 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-pink-300 font-bold">
                      Color Infrared (NIR False Color)
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      Near-Infrared (Band 8) highlights cellular mesophyll structure. Vibrant deep magenta/red indicates dense, healthy photosynthetic biomass.
                    </p>
                  </div>
                </div>
              )}

              {band === "ndvi" && (
                <div className="h-full w-full bg-gradient-to-tr from-amber-600 via-emerald-600 to-teal-400 relative flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff15_25%,transparent_25%,transparent_75%,#ffffff15_75%)] [background-size:20px_20px]" />
                  <div className="z-10 rounded-xl bg-black/70 p-4 text-white backdrop-blur-md max-w-sm border border-emerald-400/30 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                      NDVI Normalized Difference Index
                    </span>
                    <p className="mt-1 font-mono text-[11px] text-emerald-200 font-bold">
                      NDVI = (NIR - Red) / (NIR + Red)
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      Calculates crop nitrogen uptake, canopy vigor, and moisture stress for autonomous UAV drone spray prescription maps.
                    </p>
                  </div>
                </div>
              )}

              {band === "dem" && (
                <div className="h-full w-full bg-gradient-to-tr from-sky-950 via-teal-800 to-amber-700 relative flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff25_1px,transparent_1px)] [background-size:24px_24px]" />
                  <div className="z-10 rounded-xl bg-black/60 p-4 text-white backdrop-blur-md max-w-sm border border-sky-400/30 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300 font-bold">
                      SRTM DEM Watershed Delineation
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-slate-200">
                      30m Digital Elevation Model analyzing flow accumulation, slope steepness, and hydrological drainage controls executed at CSIR-NGRI.
                    </p>
                  </div>
                </div>
              )}

              {/* HUD Reticle Overlay */}
              <div className="pointer-events-none absolute inset-3 border border-white/20 rounded-xl flex flex-col justify-between p-3 font-mono text-[10px] text-white/80">
                <div className="flex justify-between items-center">
                  <span>RES: 10m / 4.2cm UAV</span>
                  <span>BAND: {band.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>SENSOR: Sentinel-2 / DJI P4</span>
                  <span>CAL: RADIOMETRIC REFLECTANCE</span>
                </div>
              </div>
            </div>

            {/* Scientific explanation pills */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="rounded-xl border border-hair bg-primary/[0.03] p-2.5">
                <span className="font-mono text-[10px] text-faint block">CENTRAL WAVELENGTH</span>
                <span className="font-mono text-xs font-bold text-primary">842 nm (NIR)</span>
              </div>
              <div className="rounded-xl border border-hair bg-primary/[0.03] p-2.5">
                <span className="font-mono text-[10px] text-faint block">CROP INDEX</span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">+0.78 High Vigor</span>
              </div>
              <div className="rounded-xl border border-hair bg-primary/[0.03] p-2.5">
                <span className="font-mono text-[10px] text-faint block">SPATIAL GSD</span>
                <span className="font-mono text-xs font-bold text-primary">Sub-Meter Precision</span>
              </div>
              <div className="rounded-xl border border-hair bg-primary/[0.03] p-2.5">
                <span className="font-mono text-[10px] text-faint block">PRIMARY TOOL</span>
                <span className="font-mono text-xs font-bold text-primary">ArcGIS · QGIS</span>
              </div>
            </div>
          </div>

          {/* Right: Telemetry Ground Stations & Radar */}
          <div className="lg:col-span-5 flex flex-col rounded-3xl border border-primary/20 bg-card-bg p-6 sm:p-7 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-hair pb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Satellite width={15} height={15} />
                Ground Station Telemetry
              </span>
              <span className="font-mono text-[10px] text-faint">4 Research Nodes</span>
            </div>

            {/* Circular Radar Sweep Display */}
            <div className="relative my-4 mx-auto aspect-square w-48 overflow-hidden rounded-full border border-primary/30 bg-primary/[0.04] flex items-center justify-center">
              {/* Radar Rings */}
              <div className="absolute inset-2 rounded-full border border-primary/20" />
              <div className="absolute inset-8 rounded-full border border-dashed border-primary/20" />
              <div className="absolute inset-16 rounded-full border border-primary/15" />
              {/* Radar Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-primary/20" />
              {/* Rotating Radar Beam */}
              <div className="absolute inset-0 animate-radar origin-center bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(16,185,129,0.35)_360deg)] rounded-full pointer-events-none" />
              {/* Central Beacon */}
              <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <div className="h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
            </div>

            {/* Station List Selection */}
            <div className="space-y-2 mt-2">
              {STATIONS.map((station, idx) => {
                const isSelected = idx === activeStation
                return (
                  <div
                    key={station.name}
                    onClick={() => handleStationSelect(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary/40 bg-primary/[0.08] shadow-xs"
                        : "border-hair bg-transparent hover:bg-primary/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                        <MapPin width={13} height={13} className={isSelected ? "text-primary" : "text-faint"} />
                        <span>{station.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-faint">{station.alt}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-faint">
                      <span>{station.role}</span>
                      <span className="text-primary-light font-bold">
                        {station.lat} · {station.lon}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
