import { usePortfolio } from "../content/PortfolioContext"
import { useGitHubFeed, relativeTime } from "../hooks/useGitHubFeed"
import { Section } from "./Section"
import { Github, Linkedin, ArrowUpRight } from "./icons"

export function LiveFeeds() {
  const { data } = usePortfolio()
  const { events, loading, error } = useGitHubFeed(data.social.github)

  return (
    <Section id="feeds" index="08" eyebrow="Signals" title="Live activity">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* GitHub — live */}
        <div className="reveal glass flex flex-col rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hair text-ink">
                <Github width={18} height={18} />
              </span>
              <div>
                <p className="font-display text-lg text-ink">GitHub</p>
                <p className="font-mono text-xs text-faint">
                  @{data.social.github}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-sage-light">
              <span className="h-2 w-2 rounded-full bg-neon animate-pulse-dot" />{" "}
              LIVE
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {loading && (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg bg-white/[0.03]"
                  />
                ))}
              </>
            )}
            {error && (
              <p className="text-sm text-mist">
                Couldn&apos;t reach the GitHub API right now ({error}). It
                refreshes on reload.
              </p>
            )}
            {!loading && !error && events.length === 0 && (
              <p className="text-sm text-mist">
                No recent public activity to show yet.
              </p>
            )}
            {events.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-hair px-4 py-3 transition hover:border-neon/40"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-ink">{e.action}</span>
                  <span className="shrink-0 font-mono text-[11px] text-faint">
                    {relativeTime(e.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs text-sage-light">
                  {e.repo}
                </p>
              </div>
            ))}
          </div>

          <a
            href={data.social.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-neon transition hover:gap-2.5"
          >
            View full profile <ArrowUpRight width={15} height={15} />
          </a>
        </div>

        {/* LinkedIn — curated */}
        <div className="reveal glass flex flex-col rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hair text-gold">
                <Linkedin width={18} height={18} />
              </span>
              <div>
                <p className="font-display text-lg text-ink">LinkedIn</p>
                <p className="font-mono text-xs text-faint">
                  Curated highlights
                </p>
              </div>
            </div>
            <a
              href={data.social.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gold/50 px-4 py-1.5 text-xs text-gold-light transition hover:bg-gold hover:text-void"
            >
              Follow
            </a>
          </div>

          <div className="flex-1 space-y-3">
            {data.linkedinPosts.map((p) => (
              <a
                key={p.id}
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-hair px-4 py-3 transition hover:border-gold/40 hover:bg-gold/[0.03]"
              >
                <p className="text-sm leading-relaxed text-ink">{p.text}</p>
                <p className="mt-2 font-mono text-[11px] text-faint">
                  {p.date}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
