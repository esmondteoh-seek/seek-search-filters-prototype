#!/usr/bin/env node
/**
 * Build the Vite SPA into the layout expected by @seek/static-site-deploy:
 *   ./dist/staging/index.html (+ assets)
 *   ./dist/production/index.html (+ assets)
 *   ./dist/{non-html assets}  — used for the shared resources prefix
 *
 * Docs: https://backstage.myseek.xyz/docs/default/component/static-site-deploy/#setup
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const stagingOut = join(root, "dist", "staging")
const productionOut = join(root, "dist", "production")
const tempOut = join(root, "dist", ".vite-build")

rmSync(join(root, "dist"), { recursive: true, force: true })
mkdirSync(tempOut, { recursive: true })

const build = spawnSync("npx", ["vite", "build", "--outDir", "dist/.vite-build"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    VITE_SHARE_CONCEPT: process.env.VITE_SHARE_CONCEPT || "future-vision",
  },
})

if (build.status !== 0) {
  process.exit(build.status ?? 1)
}

if (!existsSync(join(tempOut, "index.html"))) {
  console.error("SSD build failed: missing dist/.vite-build/index.html")
  process.exit(1)
}

for (const target of [stagingOut, productionOut]) {
  mkdirSync(dirname(target), { recursive: true })
  cpSync(tempOut, target, { recursive: true })
}

// Shared resources live at dist/ root (SSD excludes *.html when uploading resources)
for (const entry of readdirSync(tempOut)) {
  if (entry.toLowerCase().endsWith(".html")) continue
  const from = join(tempOut, entry)
  const to = join(root, "dist", entry)
  cpSync(from, to, { recursive: statSync(from).isDirectory() })
}

rmSync(tempOut, { recursive: true, force: true })

console.log("SSD build ready:")
console.log("  dist/staging/index.html")
console.log("  dist/production/index.html")
console.log("  dist/{assets…} (shared resources)")
