import { usePortfolio } from '../content/PortfolioContext';
import { useGitHubRepos, relativeTime } from '../hooks/useGitHubFeed';
import { Section } from './Section';
import { ArrowUpRight, Github } from './icons';

export function Projects() {
  const { data } = usePortfolio();
  const { repos, loading, error } = useGitHubRepos(data.social.github);

  return (
    <Section
      id="projects"
      index="04"
      eyebrow="Selected Work"
      title="Projects from orbit to soil"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((p) => (
          <article
            key={p.id}
            className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-hair bg-white/[0.02] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-neon/40 hover:bg-neon/[0.03]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at 50% 0%, rgba(0,255,200,0.08), transparent)' }} />
            <div className="relative flex items-start justify-between">
              <span className="hud-label !text-gold">{p.category}</span>
              {p.link ? (
                <a href={p.link} target="_blank" rel="noreferrer" className="text-faint transition group-hover:text-neon">
                  <ArrowUpRight width={18} height={18} />
                </a>
              ) : (
                <ArrowUpRight width={18} height={18} className="text-faint transition group-hover:text-neon" />
              )}
            </div>
            <h3 className="relative mt-4 font-display text-2xl text-ink">{p.title}</h3>
            <p className="relative mt-3 flex-1 text-sm leading-relaxed text-mist">{p.description}</p>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-hair px-3 py-1 font-mono text-[11px] text-sage-light">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* ── Live from GitHub — auto-updates every visit ── */}
      <div className="reveal mt-16">
        <div className="mb-6 flex items-center gap-3">
          <Github width={18} height={18} className="text-ink" />
          <h3 className="font-display text-2xl text-ink">Live from GitHub</h3>
          <span className="flex items-center gap-1.5 text-xs text-sage-light">
            <span className="h-2 w-2 rounded-full bg-neon animate-pulse-dot" /> AUTO-SYNCED
          </span>
        </div>

        {error && (
          <p className="text-sm text-mist">
            Couldn&apos;t reach the GitHub API right now ({error}). Repositories refresh on reload.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/[0.03]" />
            ))}

          {!loading && !error && repos.length === 0 && (
            <p className="text-sm text-mist">No public repositories to show yet.</p>
          )}

          {repos.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-hair bg-white/[0.02] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-neon/40 hover:bg-neon/[0.03]"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-neon">/{r.name}</span>
                <ArrowUpRight width={16} height={16} className="text-faint transition group-hover:text-neon" />
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                {r.description ?? 'No description provided.'}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-faint">
                {r.language && (
                  <span className="flex items-center gap-1.5 text-sage-light">
                    <span className="h-2 w-2 rounded-full bg-sage" /> {r.language}
                  </span>
                )}
                <span>★ {r.stars}</span>
                <span>⑂ {r.forks}</span>
                <span className="ml-auto">{relativeTime(r.updatedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
