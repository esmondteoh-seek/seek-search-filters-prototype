import type { FilterState } from "@/src/hooks/useJobFilters"
import {
  DEFAULT_FILTERS,
  areFilterStatesEqual,
  countMatchingJobs,
} from "@/src/hooks/useJobFilters"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import { filtersIgnoringBlankSaLatch } from "@/src/lib/isBlankSearch"
import { jobs as allJobs, type Job } from "@/src/data/jobs"

/** Version B never shows 0 or empty — floor for counts and visible cards */
export const VERSION_B_MIN_JOB_COUNT = 10

export function clampVersionBJobCount(count: number): number {
  return Math.max(VERSION_B_MIN_JOB_COUNT, count)
}

export function ensureVersionBMinimumJobs(results: Job[]): Job[] {
  if (results.length >= VERSION_B_MIN_JOB_COUNT) return results
  const seen = new Set(results.map((job) => job.id))
  const padding = allJobs
    .filter((job) => !seen.has(job.id))
    .slice(0, VERSION_B_MIN_JOB_COUNT - results.length)
  return [...results, ...padding]
}

export type VersionBPlatform = "desktop" | "mobile-web" | "app"

export type VersionBPreviewState =
  | "onboarding"
  | "blank"
  | "filters"
  | "selected"
  | "scrolled"

export type VersionBScenarioNote = {
  title?: string
  items: string[]
}

export const VERSION_B_SCENARIO_OPTIONS: {
  value: VersionBPreviewState
  label: string
  notes: VersionBScenarioNote[]
}[] = [
  {
    value: "onboarding",
    label: "Onboarding tooltip",
    notes: [
      {
        title: "Onboarding tooltip",
        items: [
          "User reaches SERP.",
          "Tooltip fades in after 3 seconds.",
          "Shows one time only.",
          "Closes when user clicks the tooltip, runs another search, or dismisses with fade-out.",
        ],
      },
      {
        title: "Onboarding sheet (app)",
        items: [
          "User reaches SERP; sheet appears one time only.",
          "Closes via X, Continue, or tap outside.",
        ],
      },
    ],
  },
  {
    value: "blank",
    label: "Blank search",
    notes: [
      {
        title: "Blank search",
        items: [
          "Show Strong applicant even with no keywords, location, or filters.",
          "Do not show the all-job count.",
        ],
      },
      {
        title: "Select Strong applicant on blank search",
        items: [
          "Selecting SA shows the refine message.",
          "Message clears on another search (blank or with keyword/location) or when applying a filter.",
        ],
      },
    ],
  },
  {
    value: "scrolled",
    label: "Scrolled state",
    notes: [
      {
        title: "Scrolled state — personalised filters",
        items: [
          "NTY + SA stay in the same position when the user scrolls.",
          "Applying a filter still runs a new search.",
        ],
      },
      {
        title: "Scrolled state — fixed filters",
        items: [
          "Fixed filters collapse to a single More entry point.",
          "Show selected fixed-filter count in a neutral numerical badge.",
        ],
      },
    ],
  },
  {
    value: "filters",
    label: "Applying fixed filters",
    notes: [
      {
        title: "Filter system changes",
        items: [
          "Move personalised filters (NTY + SA) to the same level as fixed filters.",
        ],
      },
      {
        title: "Filter system changes (app)",
        items: [
          "Show NTY + SA as pills on the SERP.",
          "Display the non-interactive job count below.",
        ],
      },
    ],
  },
  {
    value: "selected",
    label: "All filters selected",
    notes: [
      {
        title: "Active fixed filter state",
        items: [
          "Show the amount of selected fixed filters with a numerical badge (neutral).",
        ],
      },
      {
        title: "Remove count from NTY filter",
        items: ["Show a signal when there is any new job for the user."],
      },
    ],
  },
]

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

/** Five fixed filters applied — personalised chips off (Figma Applying fixed filters) */
export const VERSION_B_FIXED_FILTER_PATCH: Partial<FilterState> = {
  newToYou: false,
  strongApplicant: false,
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

const BLANK_SEARCH: SearchQuery = {
  keywords: "",
  location: "",
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

export function isVersionBScrolledPreview(preview: VersionBPreviewState): boolean {
  return preview === "scrolled"
}

export function getVersionBSearch(platform: VersionBPlatform, preview: VersionBPreviewState): SearchQuery {
  if (preview === "blank") {
    return BLANK_SEARCH
  }
  if (preview === "onboarding") {
    if (platform === "app") return APP_SEARCH
    return BLANK_SEARCH
  }
  if (platform === "app") return APP_SEARCH
  if (platform === "mobile-web") {
    return preview === "selected" ? MOBILE_WEB_SELECTED_SEARCH : MOBILE_WEB_DEFAULT_SEARCH
  }
  if (preview === "scrolled") return DESKTOP_SCROLLED_SEARCH
  return DESKTOP_DEFAULT_SEARCH
}

export function getVersionBFilterPatch(preview: VersionBPreviewState): Partial<FilterState> {
  if (preview === "selected") return VERSION_B_SELECTED_FILTER_PATCH
  if (preview === "filters") return VERSION_B_FIXED_FILTER_PATCH
  return VERSION_B_DEFAULT_FILTER_PATCH
}

export function getVersionBDisplayJobCount(
  platform: VersionBPlatform,
  preview: VersionBPreviewState,
): number | undefined {
  if (preview === "blank" || preview === "onboarding") {
    if (platform === "desktop") return 525
    if (platform === "mobile-web") return 255
    if (platform === "app") return 246
  }
  if (platform === "desktop") {
    if (preview === "selected") return 225
    return 525
  }
  if (platform === "mobile-web") return 255
  if (platform === "app") return 246
  return undefined
}

/** Share-out scenarios that overwrite live search/filters */
export function versionBAppliesScenarioPreset(preview: VersionBPreviewState): boolean {
  return (
    preview === "onboarding" ||
    preview === "blank" ||
    preview === "filters" ||
    preview === "selected" ||
    preview === "scrolled"
  )
}

/** True when live search still matches the Figma frame preset — use mock counts */
export function versionBUsesPresetJobCount(
  platform: VersionBPlatform,
  preview: VersionBPreviewState,
  search: SearchQuery,
): boolean {
  if (preview === "blank") {
    return false
  }
  const preset = getVersionBSearch(platform, preview)
  return searchMatchesPreset(search, preset)
}

function searchMatchesPreset(search: SearchQuery, preset: SearchQuery): boolean {
  return (
    search.keywords.trim() === preset.keywords.trim() &&
    search.location.trim() === preset.location.trim()
  )
}

/** Stable ±3–8% jitter so similar filter sets don't always share the same total */
function stableCountJitter(filters: FilterState, search: SearchQuery): number {
  const key = JSON.stringify({
    k: search.keywords.trim(),
    l: search.location.trim(),
    f: filters,
  })
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (Math.imul(31, hash) + key.charCodeAt(i)) | 0
  }
  const unit = (Math.abs(hash) % 10_000) / 10_000
  const magnitude = 0.03 + unit * 0.05
  const sign = hash < 0 ? -1 : 1
  return 1 + sign * magnitude
}

/**
 * Marketplace-scale job count that moves with filters on every scenario.
 * Keeps Figma frame totals at scenario baseline; scales with a small deterministic jitter otherwise.
 */
export function getVersionBScaledJobCount(
  platform: VersionBPlatform,
  preview: VersionBPreviewState,
  filters: FilterState,
  search: SearchQuery,
): number {
  const frameCount = getVersionBDisplayJobCount(platform, preview) ?? 0
  const baselineSearch = getVersionBSearch(platform, preview)
  const baselineFilters: FilterState = { ...DEFAULT_FILTERS, ...getVersionBFilterPatch(preview) }
  const effectiveFilters = filtersIgnoringBlankSaLatch(search, filters)
  const now = countMatchingJobs(effectiveFilters, search)
  const baseline = countMatchingJobs(baselineFilters, baselineSearch)

  if (now === 0) return clampVersionBJobCount(0)
  if (frameCount === 0) return clampVersionBJobCount(now)

  const atScenarioBaseline =
    searchMatchesPreset(search, baselineSearch) &&
    areFilterStatesEqual(effectiveFilters, baselineFilters)

  if (atScenarioBaseline) return frameCount

  if (baseline === 0) return clampVersionBJobCount(frameCount)

  const scaled = Math.round((now / baseline) * frameCount)
  const jittered = Math.round(scaled * stableCountJitter(effectiveFilters, search))
  return clampVersionBJobCount(Math.min(frameCount, jittered))
}

export function formatVersionBCompactSearchLabel(search: SearchQuery): string {
  const kw = search.keywords.trim()
  const loc = search.location.trim()
  if (kw && loc) return `${kw} · ${loc}`
  return kw || loc || "Search"
}

export function formatVersionBAppTitle(search: SearchQuery): { title: string; subtitle: string } {
  if (!search.keywords.trim() && !search.location.trim()) {
    return { title: "All jobs", subtitle: "All Australia" }
  }
  const title =
    search.keywords.length > 26 ? `${search.keywords.slice(0, 24).trim()}…` : search.keywords
  return { title, subtitle: search.location }
}
