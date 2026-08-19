import type { SearchQuery } from "@/src/hooks/searchQuery"
import { countModalFilters, type FilterState } from "@/src/hooks/useJobFilters"

/** True when neither keywords nor location are set (blank SERP state) */
export function isBlankSearch(search: SearchQuery): boolean {
  return !search.keywords.trim() && !search.location.trim()
}

/** True when blank search has no New to you or fixed filters applied */
export function isBlankSearchWithoutOtherFilters(
  search: SearchQuery,
  filters: FilterState,
): boolean {
  return isBlankSearch(search) && !filters.newToYou && countModalFilters(filters) === 0
}

/** Blank SERP shows "All jobs" until New to you or a fixed filter is applied (SA ignored) */
export function showAllJobsTitle(search: SearchQuery, filters: FilterState): boolean {
  if (!isBlankSearch(search)) return false
  if (filters.newToYou) return false
  return countModalFilters(filters) === 0
}

/** Web SA blank notice — hide once search or another filter is applied */
export function showStrongApplicantBlankNotice(
  search: SearchQuery,
  filters: FilterState,
): boolean {
  return filters.strongApplicant && isBlankSearchWithoutOtherFilters(search, filters)
}

/** Display filters — SA latch on blank search does not refilter the job list */
export function filtersIgnoringBlankSaLatch(
  search: SearchQuery,
  filters: FilterState,
): FilterState {
  if (showStrongApplicantBlankNotice(search, filters)) {
    return { ...filters, strongApplicant: false }
  }
  return filters
}

/** When leaving blank-search SA latch, also turn SA off */
export function patchClearingBlankSa(
  search: SearchQuery,
  current: FilterState,
  patch: Partial<FilterState>,
): Partial<FilterState> {
  if (current.strongApplicant && isBlankSearchWithoutOtherFilters(search, current)) {
    return { ...patch, strongApplicant: false }
  }
  return patch
}
