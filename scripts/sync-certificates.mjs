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
import { readdir, readFile, mkdir, copyFile, rm, stat } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.join(ROOT, "certificates")
const DEST = path.join(ROOT, "public", "certs")
const DEST_CLASSIC = path.join(ROOT, "portfolio", "assets", "certs")
const EXTS = [".png", ".jpg", ".jpeg", ".webp"]

const GREEN = "\u001b[32m"
const YELLOW = "\u001b[33m"
const DIM = "\u001b[2m"
const OFF = "\u001b[0m"

/**
 * The slugs the site looks for, read from the content itself so the two cannot
 * drift apart.
 *
 * Split in two: a certificate marked `onRequest` is one whose document was never
 * issued, so its card asks visitors to request it and it must not be counted as
 * "not supplied yet" forever.
 */
async function readCerts() {
  const empty = { expected: [], onRequest: [] }
  try {
    const ts = await readFile(
      path.join(ROOT, "src", "data", "portfolio.ts"),
      "utf8",
    )
    // Slice from the exported content object, not from the top of the file:
    // the `Certification` interface above it declares the same field names, and
    // reading those first silently produced an empty list — which in turn made
    // every file look like a match. Then isolate each flat { ... } entry.
    const data = ts.slice(ts.indexOf("DEFAULT_DATA"))
    const arr = data.slice(
      data.indexOf("certifications:"),
      data.indexOf("projects:"),
    )
    const expected = []
    const onRequest = []
    for (const entry of arr.match(/\{[^{}]*\}/g) || []) {
      const slug = (entry.match(/slug:\s*['"]([^'"]+)['"]/) || [])[1]
      if (!slug) continue
      ;(/(^|[\s,{])onRequest:\s*true/.test(entry) ? onRequest : expected).push(
        slug,
      )
    }
    return { expected, onRequest }
  } catch {
    return empty
  }
}

/** `Organic Farming.PNG` → `organic-farming.png`, so case and spaces in the
 *  filename you happened to save cannot decide whether it shows up. */
function normalise(name) {
  const ext = path.extname(name).toLowerCase()
  const stem = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return { stem, ext, file: stem + ext }
}

/** Closest known slug, for a helpful suggestion. Plain edit-distance. */
function nearest(stem, slugs) {
  let best = null
  let bestScore = Infinity
  for (const s of slugs) {
    const d = distance(stem, s)
    if (d < bestScore) {
      bestScore = d
      best = s
    }
  }
  return bestScore <= Math.max(4, Math.floor(best.length * 0.4)) ? best : null
}

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ])
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
  }
  return dp[a.length][b.length]
}

async function main() {
  const { expected: slugs, onRequest } = await readCerts()

  /* Without the list, the name check below is skipped and every file is copied
     as though it matched. Say so rather than reporting a clean run. */
  if (!slugs.length) {
    console.log(
      `${YELLOW}!${OFF} could not read the certificate list from src/data/portfolio.ts — ` +
        `file names are NOT being checked.`,
    )
  }

  await mkdir(SRC, { recursive: true })
  // Regenerate from scratch: a stale file left behind here would keep being
  // served after the source was renamed or removed.
  await rm(DEST, { recursive: true, force: true })
  await mkdir(DEST, { recursive: true })
  await mkdir(DEST_CLASSIC, { recursive: true })

  const entries = existsSync(SRC) ? await readdir(SRC) : []
  const scans = entries.filter((f) =>
    EXTS.includes(path.extname(f).toLowerCase()),
  )

  if (!scans.length) {
    console.log(
      `${DIM}certificates/ is empty — every certificate will show the generated record.${OFF}`,
    )
    console.log(
      `${DIM}Drop scans in certificates/ (see certificates/README.md for the file names).${OFF}`,
    )
    return
  }

  const matched = []
  const unmatched = []

  for (const entry of scans) {
    const { stem, ext, file } = normalise(entry)

    // Only files that answer to a real slug are copied. Otherwise the warning
    // below ("this file will never be shown") would be a lie, and unreachable
    // images would ship inside the built site.
    if (slugs.length && !slugs.includes(stem)) {
      unmatched.push({ entry, stem, suggestion: nearest(stem, slugs) })
      continue
    }

    await copyFile(path.join(SRC, entry), path.join(DEST, file))
    await copyFile(path.join(SRC, entry), path.join(DEST_CLASSIC, file))
    matched.push({
      entry,
      file,
      bytes: (await stat(path.join(SRC, entry))).size,
    })
  }

  for (const m of matched) {
    const renamed = m.entry === m.file ? "" : ` ${DIM}(as ${m.file})${OFF}`
    console.log(`${GREEN}✓${OFF} ${m.entry}${renamed}`)
  }
  for (const u of unmatched) {
    console.log(
      `${YELLOW}!${OFF} ${u.entry} — no certificate has the slug "${u.stem}", so this file will never be shown.`,
    )
    if (u.suggestion)
      console.log(
        `    did you mean: ${u.suggestion}${path.extname(u.entry).toLowerCase()}`,
      )
    else
      console.log(`    see certificates/README.md for the expected file names`)
  }

  const missing = slugs.filter(
    (s) => !matched.some((m) => m.file.startsWith(s + ".")),
  )
  if (missing.length) {
    console.log(
      `${DIM}not supplied yet (${missing.length}/${slugs.length}):${OFF}`,
    )
    for (const s of missing) console.log(`${DIM}  ${DIM}${s}${OFF}`)
  }

  if (onRequest.length) {
    console.log(
      `${DIM}issued on request — no file expected: ${onRequest.join(", ")}${OFF}`,
    )
  }

  /* A scan straight off a phone is several megabytes, and the viewer never
     shows it wider than about 1200 px. Not a failure — just worth knowing
     before it ships to someone on mobile data. */
  const heavy = matched.filter((m) => m.bytes > 1_500_000)
  if (heavy.length) {
    const mb = (heavy.reduce((n, m) => n + m.bytes, 0) / 1_048_576).toFixed(1)
    console.log(
      `${YELLOW}!${OFF} ${heavy.length} scan(s) total ${mb} MB — ` +
        `run ${DIM}npm run certs:optimise${OFF} to shrink the copies the site serves.`,
    )
  }
}

main().catch((err) => {
  console.error("certificate sync failed:", err.message)
  process.exit(1)
})
