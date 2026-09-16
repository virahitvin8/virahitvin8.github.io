#!/usr/bin/env node
/**
 * Assemble the full distribution bundle in `dist/`.
 * Mirrors what GitHub Actions does:
 *   - Copies the vanilla portfolio archive to `dist/classic/`
 *   - Removes internal deploy files from `dist/classic/`
 *   - Copies certificate scans into `dist/classic/assets/certs/`
 *   - Writes `dist/.nojekyll`
 */
import { cp, rm, mkdir, writeFile, readdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const DIST = path.join(ROOT, "dist")
const CLASSIC_SRC = path.join(ROOT, "portfolio")
const CLASSIC_DEST = path.join(DIST, "classic")
const CERTS_DIST = path.join(DIST, "certs")
const CERTS_CLASSIC = path.join(CLASSIC_DEST, "assets", "certs")

async function main() {
  if (!existsSync(DIST)) {
    console.error("dist/ does not exist. Run vite build first.")
    process.exit(1)
  }

  // 1. Copy portfolio to dist/classic
  await mkdir(CLASSIC_DEST, { recursive: true })
  await cp(CLASSIC_SRC, CLASSIC_DEST, { recursive: true })

  // 2. Remove internal dev/deploy files
  const cleanupFiles = [
    path.join(CLASSIC_DEST, "DEPLOY.md"),
    path.join(CLASSIC_DEST, "set-domain.sh"),
    path.join(CLASSIC_DEST, "assets", "certs", "README.md"),
  ]
  for (const file of cleanupFiles) {
    await rm(file, { force: true })
  }

  // 3. Share certificate scans with classic build
  if (existsSync(CERTS_DIST)) {
    const certFiles = await readdir(CERTS_DIST)
    if (certFiles.length > 0) {
      await mkdir(CERTS_CLASSIC, { recursive: true })
      await cp(CERTS_DIST, CERTS_CLASSIC, { recursive: true })
      console.log("✓ Shared certificate scans with /classic/assets/certs/")
    }
  }

  // 4. Create .nojekyll marker for GitHub Pages
  await writeFile(path.join(DIST, ".nojekyll"), "")
  console.log("✓ Assembled complete multi-build site in dist/ (React app at / and Classic archive at /classic/)")
}

main().catch((err) => {
  console.error("assemble-dist failed:", err.message)
  process.exit(1)
})
