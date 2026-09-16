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
      title="Live GitHub Telemetry & Signals"
      className="zone-orbit"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* GitHub Live Telemetry */}
        <div className="reveal flex flex-col justify-between rounded-2xl border border-primary/15 bg-white/95 p-6 shadow-sm">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-primary/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15">
                  <Github width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-primary">GitHub Uplink</h3>
                  <a
                    href={data.social.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    @{data.social.github}
                  </a>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
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
                    className="rounded-xl border border-primary/10 bg-primary/[0.02] p-2.5 transition hover:border-primary/30 hover:bg-primary/[0.05]"
                  >
                    <div className="flex items-center gap-1 text-primary font-mono text-xs font-bold truncate">
                      <Code width={12} height={12} className="shrink-0" />
                      <span className="truncate">{repo.name}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-mist line-clamp-2">{repo.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Commit / Activity Stream */}
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-faint mb-2">Recent Public Activity</p>
            <div className="space-y-2">
              {loading && (
                <div className="space-y-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-primary/[0.04]" />
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
                  className="rounded-lg border border-primary/10 bg-white px-3 py-2 text-xs shadow-2xs"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-ink truncate">{e.action}</span>
                    <span className="shrink-0 font-mono text-[10px] text-faint">
                      {relativeTime(e.createdAt)}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-emerald-700 truncate">{e.repo}</p>
                </div>
              ))}
            </div>
          </div>

          <a
            href={data.social.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-2.5 font-mono text-xs font-bold text-primary transition hover:bg-primary hover:text-white shadow-2xs"
          >
            Open Full GitHub Profile (@{data.social.github}) <ArrowUpRight width={14} height={14} />
          </a>
        </div>

        {/* LinkedIn Curated Stream */}
        <div className="reveal flex flex-col justify-between rounded-2xl border border-primary/15 bg-white/95 p-6 shadow-sm">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-primary/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
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
                className="rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 transition hover:bg-blue-600 hover:text-white"
              >
                Connect
              </a>
            </div>

            <div className="space-y-2.5">
              {data.linkedinPosts.map((p) => (
                <a
                  key={p.id}
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-primary/10 bg-white p-3.5 shadow-2xs transition hover:border-primary/30 hover:shadow-xs"
                >
                  <p className="text-xs leading-relaxed text-ink">{p.text}</p>
                  <p className="mt-2 font-mono text-[10px] font-bold text-gold-light">
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
            className="mt-5 flex items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-2.5 font-mono text-xs font-bold text-primary transition hover:bg-primary hover:text-white shadow-2xs"
          >
            Visit LinkedIn Profile <ArrowUpRight width={14} height={14} />
          </a>
        </div>
      </div>
    </Section>
  )
}
