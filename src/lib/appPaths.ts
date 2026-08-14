/** Vite `base` without trailing slash — empty string at site root */
export function getAppBasePath(): string {
  const base = import.meta.env.BASE_URL ?? "/"
  if (base === "/") return ""
  return base.endsWith("/") ? base.slice(0, -1) : base
}

export function getJobsPath(): string {
  const base = getAppBasePath()
  return base ? `${base}/jobs` : "/jobs"
}

/** Strip deploy base prefix so `/repo/jobs` reads as `/jobs` for routing */
export function stripAppBasePath(pathname: string): string {
  const base = getAppBasePath()
  const normalized = pathname.replace(/\/+$/, "") || "/"
  if (!base) return normalized
  if (normalized === base) return "/"
  if (normalized.startsWith(`${base}/`)) {
    return normalized.slice(base.length) || "/"
  }
  return normalized
}
