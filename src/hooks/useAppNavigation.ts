import { useCallback, useSyncExternalStore } from "react"
import { getAppBasePath, getJobsPath, stripAppBasePath } from "@/src/lib/appPaths"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import { applyShareConceptIfNeeded } from "@/src/hooks/shareEntry"
import { notifyNavigationChange, subscribeNavigation } from "@/src/hooks/navigationEvents"

export type AppView = "home" | "jobs"

function readUrlParams() {
  if (typeof window === "undefined") return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

export function readAppView(): AppView {
  if (typeof window === "undefined") return "home"
  applyShareConceptIfNeeded()
  const params = readUrlParams()
  if (params.get("concept")) return "jobs"
  const path = stripAppBasePath(window.location.pathname)
  return path === "/jobs" ? "jobs" : "home"
}

export function readSearchFromUrl(): SearchQuery {
  const params = readUrlParams()
  return {
    keywords: params.get("keywords") ?? "",
    location: params.get("location") ?? "",
  }
}

function copyPrototypeParams(from: URLSearchParams, to: URL) {
  const concept = from.get("concept")
  const platform = from.get("platform")
  const folder = from.get("folder")
  const vbState = from.get("vbState")
  if (concept) to.searchParams.set("concept", concept)
  if (platform) to.searchParams.set("platform", platform)
  if (folder) to.searchParams.set("folder", folder)
  if (vbState) to.searchParams.set("vbState", vbState)
}

function buildJobsUrl(search: SearchQuery): string {
  const url = new URL(window.location.origin + getJobsPath())
  const keywords = search.keywords.trim()
  const location = search.location.trim()
  if (keywords) url.searchParams.set("keywords", keywords)
  if (location) url.searchParams.set("location", location)
  copyPrototypeParams(readUrlParams(), url)
  return url.pathname + url.search
}

export function navigateToHome() {
  const homePath = getAppBasePath() ? `${getAppBasePath()}/` : "/"
  const url = new URL(window.location.origin + homePath)
  copyPrototypeParams(readUrlParams(), url)
  window.history.pushState(null, "", url.pathname + url.search)
  notifyNavigationChange()
}

export function enterPrototype(
  conceptId: string,
  search: SearchQuery,
  options?: { platform?: string; vbState?: string },
) {
  const url = new URL(window.location.origin + getJobsPath())
  const keywords = search.keywords.trim()
  const location = search.location.trim()
  if (keywords) url.searchParams.set("keywords", keywords)
  if (location) url.searchParams.set("location", location)
  url.searchParams.set("concept", conceptId)
  if (options?.platform) url.searchParams.set("platform", options.platform)
  if (options?.vbState) url.searchParams.set("vbState", options.vbState)
  window.history.pushState(null, "", url.pathname + url.search)
  notifyNavigationChange()
}

/** When `?concept=` is set, prototypes live on `/jobs` — normalize pasted links */
export function redirectPrototypeToJobsIfNeeded() {
  if (typeof window === "undefined") return false
  applyShareConceptIfNeeded()
  const params = readUrlParams()
  if (!params.get("concept")) return false
  const path = stripAppBasePath(window.location.pathname)
  if (path === "/jobs") return false
  const url = new URL(window.location.href)
  url.pathname = getJobsPath()
  window.history.replaceState(null, "", url.pathname + url.search)
  notifyNavigationChange()
  return true
}

/** Subscribe to home vs jobs route — for header active states */
export function useAppViewState(): AppView {
  return useSyncExternalStore(subscribeNavigation, readAppView, () => "home")
}

export function useAppNavigation() {
  const view = useSyncExternalStore(subscribeNavigation, readAppView, () => "home")

  const navigateToJobs = useCallback((search: SearchQuery) => {
    window.history.pushState(null, "", buildJobsUrl(search))
    notifyNavigationChange()
  }, [])

  const goHome = useCallback(() => {
    navigateToHome()
  }, [])

  const replaceJobsSearchInUrl = useCallback((search: SearchQuery) => {
    if (readAppView() !== "jobs") return
    window.history.replaceState(null, "", buildJobsUrl(search))
  }, [])

  return {
    view,
    navigateToJobs,
    navigateToHome: goHome,
    replaceJobsSearchInUrl,
    readSearchFromUrl,
    enterPrototype,
  }
}
