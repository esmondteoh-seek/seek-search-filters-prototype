import type { FilterState } from "@/src/hooks/useJobFilters"
import { DEFAULT_FILTERS } from "@/src/hooks/useJobFilters"
import type { SearchQuery } from "@/src/hooks/searchQuery"

export type VersionBPlatform = "desktop" | "mobile-web" | "app"
export type VersionBPreviewState = "default" | "selected" | "scrolled"

/** Selected — five fixed filters applied (Figma Selected frames) */
export const VERSION_B_SELECTED_FILTER_PATCH: Partial<FilterState> = {
  newToYou: true,
  strongApplicant: true,
  payMin: 50_000,
  payMax: null,
  workTypes: ["Full time", "Part time"],
  remoteOptions: ["Hybrid", "Fully remote"],
  classifications: ["Engineering", "Information & Communication Technology"],
  listingTime: "3d",
  distanceKm: 50,
}

export const VERSION_B_DEFAULT_FILTER_PATCH: Partial<FilterState> = {
  ...DEFAULT_FILTERS,
}

const DESKTOP_DEFAULT_SEARCH: SearchQuery = {
  keywords: "Project Manager",
  location: "Sydney, NSW 2000",
}

const DESKTOP_SCROLLED_SEARCH: SearchQuery = {
  keywords: "Project Manager",
  location: "Melbourne",
}

const MOBILE_WEB_DEFAULT_SEARCH: SearchQuery = {
  keywords: "Project Manager",
  location: "Melbourne",
}

const MOBILE_WEB_SELECTED_SEARCH: SearchQuery = {
  keywords: "Project Manager",
  location: "Sydney NSW 3000",
}

const APP_SEARCH: SearchQuery = {
  keywords: "First Nation Project Manager",
  location: "All Melbourne VIC",
}

export function getVersionBSearch(platform: VersionBPlatform, preview: VersionBPreviewState): SearchQuery {
  if (platform === "app") return APP_SEARCH
  if (platform === "mobile-web") {
    return preview === "default" ? MOBILE_WEB_DEFAULT_SEARCH : MOBILE_WEB_SELECTED_SEARCH
  }
  if (preview === "scrolled") return DESKTOP_SCROLLED_SEARCH
  return DESKTOP_DEFAULT_SEARCH
}

export function getVersionBFilterPatch(preview: VersionBPreviewState): Partial<FilterState> {
  return preview === "default" ? VERSION_B_DEFAULT_FILTER_PATCH : VERSION_B_SELECTED_FILTER_PATCH
}

export function getVersionBDisplayJobCount(
  platform: VersionBPlatform,
  preview: VersionBPreviewState,
): number | undefined {
  if (platform === "desktop") {
    if (preview === "default") return 525
    return 225
  }
  if (platform === "mobile-web") return 255
  if (platform === "app") return 246
  return undefined
}

/** True when live search still matches the Figma frame preset — use mock counts */
export function versionBUsesPresetJobCount(
  platform: VersionBPlatform,
  preview: VersionBPreviewState,
  search: SearchQuery,
): boolean {
  const preset = getVersionBSearch(platform, preview)
  return (
    search.keywords.trim() === preset.keywords.trim() &&
    search.location.trim() === preset.location.trim()
  )
}

export function formatVersionBCompactSearchLabel(search: SearchQuery): string {
  const kw = search.keywords.trim()
  const loc = search.location.trim()
  if (kw && loc) return `${kw} · ${loc}`
  return kw || loc || "Search"
}

export function formatVersionBAppTitle(search: SearchQuery): { title: string; subtitle: string } {
  const title =
    search.keywords.length > 26 ? `${search.keywords.slice(0, 24).trim()}…` : search.keywords
  return { title, subtitle: search.location }
}
