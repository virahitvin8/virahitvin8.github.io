const WORDS = [
  "B.Sc (Hons) AGRICULTURE",
  "M.Sc REMOTE SENSING & GIS",
  "CSIR-NGRI TRAINED",
  "PRECISION AGRONOMY",
  "EARTH OBSERVATION",
  "UAV DRONE MAPPING",
  "WATERSHED DELINEATION",
  "SENTINEL-2 & LANDSAT",
  "MULTISPECTRAL NDVI",
  "HYDROPONICS & SOIL SCIENCE",
]

export function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="relative overflow-hidden border-y border-hair bg-card-bg/80 py-3 shadow-xs backdrop-blur-md">
      <div className="flex w-max animate-[marquee-scroll_45s_linear_infinite] gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-mono text-xs font-bold tracking-widest text-primary/80"
          >
            <span className={i % 2 ? "text-primary" : "text-gold-light"}>{w}</span>
            <span className="text-emerald-600">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
