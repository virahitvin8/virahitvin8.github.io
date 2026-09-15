const WORDS = [
  'REMOTE SENSING',
  'GIS',
  'PRECISION AGRICULTURE',
  'NDVI',
  'EARTH OBSERVATION',
  'DRONE MAPPING',
  'SENTINEL-2',
  'SPATIAL MODELLING',
  'SUSTAINABILITY',
  'MULTISPECTRAL',
];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-hair bg-abyss/40 py-5">
      <div className="flex w-max animate-[marquee-scroll_40s_linear_infinite] gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl text-mist">
            <span className={i % 2 ? 'text-gold/70' : 'text-ink/80'}>{w}</span>
            <span className="text-neon">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
