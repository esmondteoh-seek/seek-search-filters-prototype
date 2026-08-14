import { useCallback } from "react"
import {
  formatFutureVisionLocationSummaryFromIds,
  FUTURE_VISION_DEFAULT_SEARCH,
} from "@/src/data/futureVisionPresets"
import {
  FUTURE_VISION_DEFAULT_LOCATION_ID,
  resolveFutureVisionLocation,
  resolveFutureVisionLocations,
} from "@/src/data/futureVisionLocations"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"

function mergeLocationIds(existing: string[], incoming: string[]): string[] {
  const merged = [...existing]
  for (const id of incoming) {
    if (!merged.includes(id)) merged.push(id)
  }
  return merged
}

/** Sync Future Vision location array with search query on submit */
export function useFutureVisionSubmit(filterState: UseJobFiltersReturn) {
  const {
    locationIds,
    locations,
    locationSummary,
    locationQuery,
    isEditingLocation,
    setLocationIds,
    stopEditingLocation,
  } = useFutureVisionLocations()
  const { draftSearch, applySearchQuery, updateDraftSearch, search } = filterState

  const submitSearch = useCallback(() => {
    let nextIds = locationIds

    if (locationQuery.trim()) {
      const resolved = resolveFutureVisionLocations(locationQuery)
      if (resolved.length > 0) {
        if (locationIds.length > 1 || isEditingLocation) {
          nextIds = mergeLocationIds(
            locationIds,
            resolved.map((loc) => loc.id),
          )
        } else {
          nextIds = resolved.map((loc) => loc.id)
        }
      } else {
        const single = resolveFutureVisionLocation(locationQuery)
        if (single) {
          if (nextIds.includes(single.id)) {
            // keep existing
          } else if (nextIds.length > 1 || (nextIds.length === 1 && isEditingLocation)) {
            nextIds = [...nextIds, single.id]
          } else {
            nextIds = [single.id]
          }
        }
      }
      setLocationIds(nextIds, { preserveSelection: true })
    }

    if (nextIds.length === 0) {
      nextIds = [FUTURE_VISION_DEFAULT_LOCATION_ID]
      setLocationIds(nextIds, { preserveSelection: true })
    }

    const summary = formatFutureVisionLocationSummaryFromIds(nextIds)

    applySearchQuery({
      keywords:
        draftSearch.keywords.trim() ||
        search.keywords ||
        FUTURE_VISION_DEFAULT_SEARCH.keywords,
      location: summary,
    })
    stopEditingLocation()
  }, [
    applySearchQuery,
    draftSearch.keywords,
    isEditingLocation,
    locationIds,
    locationQuery,
    search.keywords,
    setLocationIds,
    stopEditingLocation,
  ])

  const openSearchDraft = useCallback(() => {
    updateDraftSearch({
      keywords: search.keywords,
      location: locations.length === 1 ? locations[0] : locationSummary,
    })
  }, [locationSummary, locations, search.keywords, updateDraftSearch])

  return { submitSearch, openSearchDraft }
}
