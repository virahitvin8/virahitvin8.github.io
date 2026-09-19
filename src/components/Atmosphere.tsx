import { useEffect, useState } from "react"

/**
 * Atmospheric layer:
 * Transforms the visual environment from Earth / Soil (0m) to Orbit (705km)
 * as the visitor scrolls through the portfolio.
 */
export function Atmosphere() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Dynamic Altitude & Domain info
  const stage =
    progress < 25
      ? {
          alt: "0m · Ground Level",
          domain: "Living Soil & Crop Agronomy",
          icon: "🌱",
          badge: "B.Sc (Hons) Agriculture",
          color: "text-primary",
        }
      : progress < 55
      ? {
          alt: "120m · Canopy Altitude",
          domain: "UAV Drone & Precision Agri",
          icon: "🚁",
          badge: "Sensor Analytics",
          color: "text-emerald-700",
        }
      : progress < 80
      ? {
          alt: "3,500m · Geospatial Altitude",
          domain: "GIS Watershed & Terrain Modeling",
          icon: "🗺️",
          badge: "Spatial Modeling",
          color: "text-teal-700",
        }
      : {
          alt: "705,000m · Sun-Synchronous Orbit",
          domain: "Satellite Earth Observation & CSIR-NGRI",
          icon: "🛰️",
          badge: "M.Sc Remote Sensing",
          color: "text-sky-800",
        }

  return (
    <>
      {/* Background Altitude Ambience */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000">
        {/* Soft Organic Aura 1 */}
        <div
          className="absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full opacity-40 blur-[130px] transition-all duration-1000"
          style={{
            background:
              progress < 50
                ? "radial-gradient(circle, rgba(45,106,79,0.18), transparent 70%)"
                : "radial-gradient(circle, rgba(14,107,127,0.16), transparent 70%)",
          }}
        />

        {/* Soft Aura 2 */}
        <div
          className="absolute -right-1/4 top-[25%] h-[60vh] w-[60vh] rounded-full opacity-35 blur-[120px] transition-all duration-1000"
          style={{
            background:
              progress < 40
                ? "radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)"
                : progress < 75
                ? "radial-gradient(circle, rgba(45,106,79,0.15), transparent 70%)"
                : "radial-gradient(circle, rgba(24,100,171,0.14), transparent 70%)",
          }}
        />

        {/* Soft Aura 3 */}
        <div
          className="absolute bottom-[-10%] left-1/3 h-[55vh] w-[55vh] rounded-full opacity-30 blur-[140px] transition-all duration-1000"
          style={{
            background:
              progress > 60
                ? "radial-gradient(circle, rgba(16,79,110,0.14), transparent 70%)"
                : "radial-gradient(circle, rgba(82,183,136,0.12), transparent 70%)",
          }}
        />

        {/* Subtle geometric agricultural grid to satellite raster pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(13,43,31,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,43,31,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Top Scroll Altitude Progress Rail */}
      <div className="fixed left-0 top-0 z-[9999] h-[3px] w-full bg-black/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 transition-[width] duration-150"
          style={{
            width: `${progress}%`,
            boxShadow: "0 0 10px rgba(45,106,79,0.3)",
          }}
        />
      </div>

      {/* Interactive Floating Flight / Altitude Gauge HUD */}
      <div className="fixed bottom-6 right-6 z-[8000] hidden items-center gap-3 rounded-full border border-hair bg-card-bg px-4 py-2 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-primary/40 sm:flex">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm">
          {stage.icon}
        </span>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[11px] font-bold ${stage.color}`}>
              {stage.alt}
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-primary">
              {stage.badge}
            </span>
          </div>
          <span className="font-mono text-[10px] text-faint">
            {stage.domain}
          </span>
        </div>
      </div>
    </>
  )
}
