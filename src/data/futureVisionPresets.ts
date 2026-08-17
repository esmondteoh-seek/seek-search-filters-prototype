import type { FilterState } from "@/src/hooks/useJobFilters"
import { countMatchingJobs, DEFAULT_FILTERS } from "@/src/hooks/useJobFilters"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import {
  getFutureVisionDefaultLocation,
  getFutureVisionDisplayNames,
} from "@/src/data/futureVisionLocations"

export type FutureVisionLocationChrome = "tab-chips" | "multi-pills"

export const FUTURE_VISION_DEFAULT_KEYWORDS = "Project Manager"

export const FUTURE_VISION_DEFAULT_LOCATION = getFutureVisionDefaultLocation().displayName

export const FUTURE_VISION_DEFAULT_SEARCH: SearchQuery = {
  keywords: FUTURE_VISION_DEFAULT_KEYWORDS,
  location: FUTURE_VISION_DEFAULT_LOCATION,
}

export function getFutureVisionFilterPatch(): Partial<FilterState> {
  return { ...DEFAULT_FILTERS, distanceKm: 50 }
}

export function getFutureVisionDisplayJobCount(platform: VersionBPlatform): number {
  if (platform === "desktop") return 525
  if (platform === "mobile-web") return 255
  return 246
}

/** Marketplace-scale count that scales with strict filter matches vs baseline */
export function getFutureVisionScaledJobCount(
  platform: VersionBPlatform,
  filters: FilterState,
  search: SearchQuery,
): number {
  const frameCount = getFutureVisionDisplayJobCount(platform)
  const baselineFilters = { ...DEFAULT_FILTERS, ...getFutureVisionFilterPatch() }
  const strictNow = countMatchingJobs(filters, search)
  const strictBaseline = countMatchingJobs(baselineFilters, FUTURE_VISION_DEFAULT_SEARCH)

  if (strictNow === 0) return 0
  if (strictBaseline === 0) return Math.max(1, frameCount)

  return Math.max(1, Math.round((strictNow / strictBaseline) * frameCount))
}

export function formatFutureVisionLocationSummary(locations: string[]): string {
  if (locations.length === 0) return ""
  if (locations.length === 1) return locations[0]
  return `${locations.length} locations`
}

export function formatFutureVisionLocationSummaryFromIds(locationIds: string[]): string {
  return formatFutureVisionLocationSummary(getFutureVisionDisplayNames(locationIds))
}

export function formatFutureVisionCompactPill(keywords: string, locations: string[]): string {
  const kw = keywords.trim()
  const loc = formatFutureVisionLocationSummary(locations)
  if (kw && loc) return `${kw} · ${loc}`
  return kw || loc || "Search"
}

export function formatFutureVisionAppTitle(
  keywords: string,
  locations: string[],
): { title: string; subtitle: string } {
  const title =
    keywords.length > 26 ? `${keywords.slice(0, 24).trim()}…` : keywords
  return { title, subtitle: formatFutureVisionLocationSummary(locations) }
}
