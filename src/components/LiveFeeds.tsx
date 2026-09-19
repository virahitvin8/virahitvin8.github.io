import { usePortfolio } from "../content/PortfolioContext"
import { useGitHubFeed, relativeTime } from "../hooks/useGitHubFeed"
import { Section } from "./Section"
import { Github, Linkedin, ArrowUpRight, Code } from "./icons"

const PINNED_REPOS = [
  {
    name: "agri_gis_studio",
    desc: "Geospatial studio applying Earth observation for agricultural analytics.",
    lang: "JavaScript / Python",
  },
  {
    name: "crafty-gis",
    desc: "Spatial analysis algorithms and GIS vector processing tools.",
    lang: "Python / GIS",
  },
  {
    name: "farmhealth",
    desc: "Crop canopy health diagnostics, NDVI modeling & stress alerts.",
    lang: "TypeScript / GEE",
  },
  {
    name: "photolink",
    desc: "Field survey photo coordinate tagging & GPS location mapping.",
    lang: "Dart / Mobile",
  },
]

export function LiveFeeds() {
  const { data } = usePortfolio()
  const { events, loading, error } = useGitHubFeed(data.social.github)

  return (
    <Section
      id="feeds"
      index="08"
      eyebrow="Open Source & Signals"
      title="Live GitHub Telemetry &amp; Signals"
      className="zone-orbit"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* GitHub Live Telemetry */}
        <div className="reveal flex flex-col justify-between rounded-3xl border border-primary/20 bg-card-bg p-6 sm:p-7 shadow-xs backdrop-blur-md">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-hair pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Github width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-primary">GitHub Uplink</h3>
                  <a
                    href={data.social.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    @{data.social.github}
                  </a>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE FEED
              </span>
            </div>

            {/* Featured Repositories */}
            <div className="mb-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-faint mb-2">Featured Repositories</p>
              <div className="grid grid-cols-2 gap-2">
                {PINNED_REPOS.map((repo) => (
                  <a
                    key={repo.name}
                    href={`https://github.com/${data.social.github}/${repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-hair bg-primary/[0.02] p-3 transition hover:border-primary/40 hover:bg-primary/[0.06]"
                  >
                    <div className="flex items-center gap-1.5 text-primary font-mono text-xs font-bold truncate">
                      <Code width={12} height={12} className="shrink-0" />
                      <span className="truncate">{repo.name}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-faint line-clamp-2">{repo.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Public Activity */}
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-faint mb-2">Recent Public Activity</p>
            <div className="space-y-2">
              {loading && (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-xl bg-primary/[0.04]" />
                  ))}
                </div>
              )}
              {error && (
                <p className="text-xs text-mist">
                  Activity cached from session. Direct link available below.
                </p>
              )}
              {events.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-hair bg-primary/[0.02] px-3.5 py-2.5 text-xs shadow-2xs"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-ink truncate">{e.action}</span>
                    <span className="shrink-0 font-mono text-[10px] text-faint">
                      {relativeTime(e.createdAt)}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 truncate mt-0.5">{e.repo}</p>
                </div>
              ))}
            </div>
          </div>

          <a
            href={data.social.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-center gap-1.5 rounded-full border border-hair bg-primary/[0.04] py-2.5 font-mono text-xs font-bold text-primary transition hover:bg-primary hover:text-white shadow-2xs"
          >
            Open Full GitHub Profile (@{data.social.github}) <ArrowUpRight width={14} height={14} />
          </a>
        </div>

        {/* LinkedIn Curated Stream */}
        <div className="reveal flex flex-col justify-between rounded-3xl border border-primary/20 bg-card-bg p-6 sm:p-7 shadow-xs backdrop-blur-md">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-hair pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                  <Linkedin width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-primary">Academic Network</h3>
                  <p className="font-mono text-xs text-mist">Verified Dispatches</p>
                </div>
              </div>
              <a
                href={data.social.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-bold text-sky-600 dark:text-sky-400 transition hover:bg-sky-500 hover:text-white"
              >
                Connect
              </a>
            </div>

            <div className="space-y-3">
              {data.linkedinPosts.map((p) => (
                <a
                  key={p.id}
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-hair bg-primary/[0.02] p-4 shadow-2xs transition hover:border-primary/40 hover:shadow-xs"
                >
                  <p className="text-xs leading-relaxed text-ink">{p.text}</p>
                  <p className="mt-2 font-mono text-[10px] font-bold text-gold">
                    {p.date}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <a
            href={data.social.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-center gap-1.5 rounded-full border border-hair bg-primary/[0.04] py-2.5 font-mono text-xs font-bold text-primary transition hover:bg-primary hover:text-white shadow-2xs"
          >
            Visit LinkedIn Profile <ArrowUpRight width={14} height={14} />
          </a>
        </div>
      </div>
    </Section>
  )
}
