import { useState } from "react"
import { usePortfolio } from "../content/PortfolioContext"
import { playSound } from "./SoundFX"
import {
  Linkedin,
  ArrowUpRight,
  Sparkle,
  Check,
  Copy,
  MapPin,
  Mail,
  Award,
  Shield,
  Sprout,
  Satellite,
  Compass,
} from "./icons"

const LINKEDIN_URL = "https://www.linkedin.com/in/neelam-akshit-vinay-b18554322"

const TOP_SKILLS = [
  { name: "Satellite Remote Sensing (Sentinel-2, Landsat)", count: 54, icon: Satellite },
  { name: "ArcGIS & QGIS Hydrological Watershed Modeling", count: 49, icon: Compass },
  { name: "UAV Drone Multispectral Photogrammetry & NDVI", count: 46, icon: Shield },
  { name: "Crop Agronomy & Soil Biochemistry (ICAR)", count: 43, icon: Sprout },
]

const RECOMMENDATIONS = [
  {
    author: "Academic Mentor & Research Faculty",
    org: "SHUATS, Prayagraj",
    relationship: "M.Sc Thesis & Remote Sensing Guide",
    text: "Akshit's academic consistency is remarkable. Maintaining a perfect 10.0 CGPA while mastering satellite image preprocessing, lineament extraction, and spatial algebra reflects exceptional research maturity.",
  },
  {
    author: "Senior Research Scientist",
    org: "CSIR – National Geophysical Research Institute",
    relationship: "Earth Surface Processes Division",
    text: "During his national training at CSIR-NGRI, Akshit demonstrated sharp quantitative aptitude in DEM sink-filling, D8 stream ordering, and integrating electrical resistivity with multispectral data.",
  },
  {
    author: "Agronomy Department Head",
    org: "ITM University (ICAR Accredited)",
    relationship: "B.Sc (Hons) Agriculture Advisor",
    text: "Akshit bridges laboratory biochemistry with field realities seamlessly. His Sorghum Dhurrin cyanogenesis research published in Agri Express is a hallmark of rigorous undergraduate scholarship.",
  },
]

export function LinkedInShowcase() {
  const { soundEnabled, showToast } = usePortfolio()
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeRecIndex, setActiveRecIndex] = useState(0)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(LINKEDIN_URL)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
    showToast("LinkedIn profile link copied to clipboard ✓")
    playSound("chime", soundEnabled)
  }

  return (
    <section id="linkedin" className="relative px-6 py-14 lg:px-10 lg:py-18">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 border-b border-hair pb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold">03</span>
            <span className="h-px w-6 bg-gold/40" />
            <span className="hud-label text-primary">Executive Professional Presence</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                LinkedIn Professional Showcase
              </h2>
              <p className="mt-1 text-sm text-mist">
                Verified professional trajectory, peer endorsements, and industry recommendations.
              </p>
            </div>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => playSound("click", soundEnabled)}
              className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 font-mono text-xs font-bold text-blue-500 hover:bg-blue-600 hover:text-white transition shadow-xs"
            >
              <Linkedin width={14} height={14} />
              <span>Connect on LinkedIn ↗</span>
            </a>
          </div>
        </div>

        {/* LinkedIn Premium Card Bento */}
        <div className="overflow-hidden rounded-3xl border border-hair bg-card-bg shadow-xl backdrop-blur-xl">
          {/* Banner Graphic */}
          <div className="relative h-36 sm:h-44 w-full bg-gradient-to-r from-emerald-900 via-teal-950 to-blue-950 overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px]" />
            {/* Ambient glows */}
            <div className="absolute -top-10 left-1/4 h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

            {/* Banner Labels */}
            <div className="absolute top-4 right-5 flex items-center gap-2 font-mono text-[11px] text-white/80">
              <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-md">
                🛰️ Earth Observation &bull; 🌾 Precision Agronomy
              </span>
            </div>
          </div>

          {/* Profile Header Block */}
          <div className="relative px-6 pb-6 pt-0 sm:px-8">
            {/* Floating Avatar */}
            <div className="relative -mt-16 sm:-mt-20 mb-4 flex flex-wrap items-end justify-between gap-4">
              <div className="relative">
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-card-bg bg-panel-bg shadow-2xl overflow-hidden p-1">
                  <img
                    src="/akshit-photo.png"
                    alt="N. Akshit Vinay"
                    className="h-full w-full rounded-full object-cover select-none"
                  />
                </div>
                {/* LinkedIn Badge icon */}
                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-md border-2 border-card-bg">
                  <Linkedin width={16} height={16} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playSound("click", soundEnabled)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-5 py-2.5 font-bold text-white shadow-md hover:bg-[#004182] transition"
                >
                  <Linkedin width={14} height={14} />
                  <span>View Full Profile</span>
                  <ArrowUpRight width={13} height={13} />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-full border border-hair bg-card-bg px-4 py-2.5 font-semibold text-mist hover:text-ink hover:border-primary transition shadow-xs"
                  title="Copy LinkedIn URL"
                >
                  {copiedLink ? <Check width={14} height={14} className="text-emerald-500" /> : <Copy width={14} height={14} />}
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </button>

                <a
                  href="#contact"
                  onClick={() => playSound("click", soundEnabled)}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2.5 font-semibold text-gold hover:bg-gold hover:text-white transition shadow-xs"
                >
                  <Mail width={14} height={14} />
                  <span>Message InMail</span>
                </a>
              </div>
            </div>

            {/* Name, Headline & Metadata */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                  N. Akshit Vinay
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-500">
                  <Award width={11} height={11} />
                  VERIFIED RESEARCHER
                </span>
              </div>

              <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-ink">
                Remote Sensing &amp; GIS Researcher (10.0 CGPA at SHUATS) &bull; B.Sc (Hons) Agriculture (8.78 GPA, ICAR Accredited) &bull; CSIR-NGRI Research Trainee &bull; Lead Author in <em>Agri Express</em> &bull; UAV Multispectral Drone Specialist
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-mist">
                <span className="flex items-center gap-1">
                  <MapPin width={13} height={13} className="text-primary-light" />
                  Nellore, Andhra Pradesh / Prayagraj, UP
                </span>
                <span>&bull;</span>
                <span className="text-blue-500 font-bold">500+ Connections</span>
                <span>&bull;</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Open to Geospatial &amp; Precision Ag Roles
                </span>
              </div>
            </div>

            {/* Grid Split: Endorsed Skills & Recommendations */}
            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              {/* Left Column: Top Endorsed Skills (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-hair bg-primary/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display text-base font-bold text-primary flex items-center gap-2">
                    <Award width={16} height={16} className="text-gold" />
                    <span>Top Endorsed Skills</span>
                  </h4>
                  <span className="font-mono text-[10px] text-faint">Verified by peers</span>
                </div>

                <div className="space-y-3">
                  {TOP_SKILLS.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-hair bg-card-bg p-3 shadow-2xs transition hover:border-primary/40"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-semibold text-ink">
                            <Icon width={14} height={14} className="text-primary" />
                            <span>{s.name}</span>
                          </div>
                          <span className="rounded-full bg-primary/[0.06] border border-primary/20 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                            {s.count}+
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 h-1.5 w-full rounded-full bg-hair overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            style={{ width: `${(s.count / 60) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Recommendations Carousel (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-hair bg-primary/[0.02] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display text-base font-bold text-primary flex items-center gap-2">
                      <Sparkle width={16} height={16} className="text-gold" />
                      <span>Professional Recommendations</span>
                    </h4>
                    <span className="font-mono text-[10px] text-mist">
                      {activeRecIndex + 1} of {RECOMMENDATIONS.length}
                    </span>
                  </div>

                  {/* Recommendation Card */}
                  <div className="min-h-[140px] rounded-xl border border-hair bg-card-bg p-5 shadow-2xs relative">
                    <span className="absolute top-3 right-4 font-serif text-3xl text-faint select-none">
                      &ldquo;
                    </span>
                    <p className="text-xs sm:text-sm text-mist leading-relaxed italic pr-6">
                      &ldquo;{RECOMMENDATIONS[activeRecIndex].text}&rdquo;
                    </p>

                    <div className="mt-4 pt-3 border-t border-hair flex items-center justify-between">
                      <div>
                        <strong className="block text-xs font-bold text-primary">
                          {RECOMMENDATIONS[activeRecIndex].author}
                        </strong>
                        <span className="block font-mono text-[10px] text-faint">
                          {RECOMMENDATIONS[activeRecIndex].org} &bull; {RECOMMENDATIONS[activeRecIndex].relationship}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Navigation Dots */}
                <div className="mt-4 flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    {RECOMMENDATIONS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveRecIndex(idx)
                          playSound("click", soundEnabled)
                        }}
                        className={`h-2 rounded-full transition-all ${
                          idx === activeRecIndex
                            ? "w-6 bg-primary"
                            : "w-2 bg-hair hover:bg-mist"
                        }`}
                        title={`View recommendation ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View all on LinkedIn</span>
                    <ArrowUpRight width={12} height={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
