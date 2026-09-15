#!/usr/bin/env node
/**
 * Copy the certificate scans you drop into `certificates/` to where the site
 * serves them from (`public/certs/`).
 *
 * Runs automatically before `npm run dev` and `npm run build`, so adding a file
 * to `certificates/` is the only step. On deploy the workflow then mirrors the
 * same files into `/classic/assets/certs/`, so one file serves both builds.
 *
 * It also checks each file against the slugs the site actually looks for. A
 * scan named slightly wrong — `organic_farming.png`, `Organic Farming.png` — is
 * otherwise a silent no-op that looks like a bug, so that case is reported
 * loudly and the closest match suggested.
 */
import { readdir, readFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'certificates');
const DEST = path.join(ROOT, 'public', 'certs');
const EXTS = ['.png', '.jpg', '.jpeg', '.webp'];

const GREEN = '\u001b[32m';
const YELLOW = '\u001b[33m';
const DIM = '\u001b[2m';
const OFF = '\u001b[0m';

/** The slugs the site looks for, read from the content itself so the two
 *  cannot drift apart. */
async function knownSlugs() {
  try {
    const ts = await readFile(path.join(ROOT, 'src', 'data', 'portfolio.ts'), 'utf8');
    return [...ts.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

/** `Organic Farming.PNG` → `organic-farming.png`, so case and spaces in the
 *  filename you happened to save cannot decide whether it shows up. */
function normalise(name) {
  const ext = path.extname(name).toLowerCase();
  const stem = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return { stem, ext, file: stem + ext };
}

/** Closest known slug, for a helpful suggestion. Plain edit-distance. */
function nearest(stem, slugs) {
  let best = null;
  let bestScore = Infinity;
  for (const s of slugs) {
    const d = distance(stem, s);
    if (d < bestScore) {
      bestScore = d;
      best = s;
    }
  }
  return bestScore <= Math.max(4, Math.floor(best.length * 0.4)) ? best : null;
}

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

async function main() {
  const slugs = await knownSlugs();

  await mkdir(SRC, { recursive: true });
  // Regenerate from scratch: a stale file left behind here would keep being
  // served after the source was renamed or removed.
  await rm(DEST, { recursive: true, force: true });
  await mkdir(DEST, { recursive: true });

  const entries = existsSync(SRC) ? await readdir(SRC) : [];
  const scans = entries.filter((f) => EXTS.includes(path.extname(f).toLowerCase()));

  if (!scans.length) {
    console.log(`${DIM}certificates/ is empty — every certificate will show the generated record.${OFF}`);
    console.log(`${DIM}Drop scans in certificates/ (see certificates/README.md for the file names).${OFF}`);
    return;
  }

  const matched = [];
  const unmatched = [];

  for (const entry of scans) {
    const { stem, ext, file } = normalise(entry);

    // Only files that answer to a real slug are copied. Otherwise the warning
    // below ("this file will never be shown") would be a lie, and unreachable
    // images would ship inside the built site.
    if (slugs.length && !slugs.includes(stem)) {
      unmatched.push({ entry, stem, suggestion: nearest(stem, slugs) });
      continue;
    }

    await copyFile(path.join(SRC, entry), path.join(DEST, file));
    matched.push({ entry, file });
  }

  for (const m of matched) {
    const renamed = m.entry === m.file ? '' : ` ${DIM}(as ${m.file})${OFF}`;
    console.log(`${GREEN}✓${OFF} ${m.entry}${renamed}`);
  }
  for (const u of unmatched) {
    console.log(`${YELLOW}!${OFF} ${u.entry} — no certificate has the slug "${u.stem}", so this file will never be shown.`);
    if (u.suggestion) console.log(`    did you mean: ${u.suggestion}${path.extname(u.entry).toLowerCase()}`);
    else console.log(`    see certificates/README.md for the expected file names`);
  }

  const missing = slugs.filter((s) => !matched.some((m) => m.file.startsWith(s + '.')));
  if (missing.length) {
    console.log(`${DIM}not supplied yet (${missing.length}/${slugs.length}):${OFF}`);
    for (const s of missing) console.log(`${DIM}  ${DIM}${s}${OFF}`);
  }
}

main().catch((err) => {
  console.error('certificate sync failed:', err.message);
  process.exit(1);
});
