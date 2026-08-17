import { getConceptById, isFutureVisionConcept } from "@/src/concepts/index"
import { getJobsPath } from "@/src/lib/appPaths"

const FOLDER_PARAM = "folder"

export function getShareConceptId(): string | null {
  const raw = import.meta.env.VITE_SHARE_CONCEPT
  if (typeof raw !== "string" || !raw.trim()) return null
  const id = raw.trim()
  return getConceptById(id) ? id : null
}

/** Share builds open Future Vision unless the URL already has a concept or library folder. */
export function applyShareConceptIfNeeded(): boolean {
  if (typeof window === "undefined") return false
  const shareId = getShareConceptId()
  if (!shareId) return false

  const url = new URL(window.location.href)
  if (url.searchParams.get("concept")) return false
  if (url.searchParams.get(FOLDER_PARAM)) return false

  url.pathname = getJobsPath()
  url.searchParams.set("concept", shareId)
  if (
    (shareId === "version-b" || isFutureVisionConcept(shareId)) &&
    !url.searchParams.get("platform")
  ) {
    url.searchParams.set("platform", "desktop")
  }
  window.history.replaceState(null, "", url.pathname + url.search)
  return true
}

export function buildShareUrl(conceptId: string, platform?: string): string {
  const url = new URL(window.location.origin + getJobsPath())
  url.searchParams.set("concept", conceptId)
  if (platform) url.searchParams.set("platform", platform)
  return url.toString()
}
