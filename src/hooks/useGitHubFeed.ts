import { useEffect, useState } from 'react';

export interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  action: string;
  createdAt: string;
}

interface State {
  events: GitHubEvent[];
  loading: boolean;
  error: string | null;
}

/*
 * GitHub's unauthenticated API allows 60 requests/hour per IP address. This page
 * spends two of them (events + repos), so a couple of dozen visitors behind one
 * office, campus or mobile-carrier NAT would exhaust the whole hour for
 * everybody. A ten-minute session cache means a browsing session — including
 * every reload and internal navigation — costs a single round of requests.
 */
const CACHE_TTL = 10 * 60 * 1000;
const CACHE_PREFIX = 'fx-gh:';

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { t: number; v: T };
    if (!entry || Date.now() - entry.t > CACHE_TTL) return null;
    return entry.v;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    /* private mode or a full quota — the feed still works, just uncached */
  }
}

/**
 * Fetch JSON with caching and a readable failure message.
 * Returns `{ data }` on success, `{ error }` when it could not be used.
 */
async function loadJson<T>(
  url: string,
  key: string,
): Promise<{ data?: T; error?: string }> {
  const hit = readCache<T>(key);
  if (hit) return { data: hit };

  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (res.status === 403 || res.status === 429) {
      return {
        error: 'GitHub is rate-limiting this network — the feed returns in a few minutes',
      };
    }
    if (!res.ok) return { error: `GitHub ${res.status}` };
    const data = (await res.json()) as T;
    writeCache(key, data);
    return { data };
  } catch {
    return { error: 'offline or unreachable' };
  }
}

function summarize(e: any): GitHubEvent | null {
  const repo = e.repo?.name ?? 'unknown/repo';
  const map: Record<string, string> = {
    PushEvent: `Pushed ${e.payload?.commits?.length ?? 0} commit(s)`,
    CreateEvent: `Created ${e.payload?.ref_type ?? 'ref'}`,
    WatchEvent: 'Starred',
    ForkEvent: 'Forked',
    IssuesEvent: `${e.payload?.action ?? 'updated'} an issue`,
    PullRequestEvent: `${e.payload?.action ?? 'updated'} a pull request`,
    ReleaseEvent: 'Published a release',
    PublicEvent: 'Made public',
  };
  const action = map[e.type];
  if (!action) return null;
  return { id: e.id, type: e.type, repo, action, createdAt: e.created_at };
}

export function useGitHubFeed(username: string, limit = 6) {
  const [state, setState] = useState<State>({ events: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ events: [], loading: true, error: null });

    loadJson<any[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`,
      `events:${username}`,
    ).then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data) {
        setState({ events: [], loading: false, error: error ?? 'no data' });
        return;
      }
      const events = data.map(summarize).filter(Boolean).slice(0, limit) as GitHubEvent[];
      setState({ events, loading: false, error: null });
    });

    return () => {
      cancelled = true;
    };
  }, [username, limit]);

  return state;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

interface RepoState {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

/**
 * Live public repositories, most recently pushed first.
 *
 * `per_page` is deliberately small: the endpoint is asked to sort by `pushed`,
 * so twelve is already more than enough to fill a six-card grid after forks are
 * filtered out. It previously requested 100 and then threw that ordering away by
 * re-sorting on star count — which, on an account with single-digit stars, is
 * close to random. Recent work is also the more compelling signal for a
 * portfolio, and the card already prints the "updated" time next to it.
 */
export function useGitHubRepos(username: string, limit = 6) {
  const [state, setState] = useState<RepoState>({ repos: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ repos: [], loading: true, error: null });

    loadJson<any[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=12`,
      `repos:${username}`,
    ).then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data) {
        setState({ repos: [], loading: false, error: error ?? 'no data' });
        return;
      }
      const repos: GitHubRepo[] = data
        .filter((r) => !r.fork)
        .sort(
          (a, b) =>
            new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime(),
        )
        .slice(0, limit)
        .map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          url: r.html_url,
          language: r.language,
          stars: r.stargazers_count ?? 0,
          forks: r.forks_count ?? 0,
          topics: r.topics ?? [],
          updatedAt: r.pushed_at ?? r.updated_at,
        }));
      setState({ repos, loading: false, error: null });
    });

    return () => {
      cancelled = true;
    };
  }, [username, limit]);

  return state;
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const secs = Math.round((Date.now() - then) / 1000);
  const units: [number, string][] = [
    [60, 's'],
    [60, 'm'],
    [24, 'h'],
    [7, 'd'],
    [4.35, 'w'],
    [12, 'mo'],
  ];
  let v = secs;
  let unit = 's';
  for (const [step, label] of units) {
    if (v < step) {
      unit = label;
      break;
    }
    v = Math.round(v / step);
    unit = label;
  }
  return `${v}${unit} ago`;
}
