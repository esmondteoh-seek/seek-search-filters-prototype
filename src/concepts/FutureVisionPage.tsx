import { useEffect, useRef } from "react"
import { FutureVisionApp } from "@/src/components/futureVision/FutureVisionApp"
import { FutureVisionDesktop } from "@/src/components/futureVision/FutureVisionDesktop"
import { FutureVisionMobileWeb } from "@/src/components/futureVision/FutureVisionMobileWeb"
import {
  FutureVisionLocationsProvider,
  useFutureVisionLocations,
} from "@/src/components/futureVision/FutureVisionLocationsContext"
import { VersionBRoot } from "@/src/components/versionB/VersionBRoot"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import {
  FUTURE_VISION_DEFAULT_SEARCH,
  getFutureVisionFilterPatch,
} from "@/src/data/futureVisionPresets"
import { DEFAULT_FILTERS } from "@/src/hooks/useJobFilters"
import type { FutureVisionLocationChrome } from "@/src/data/futureVisionPresets"
import type { VersionBPlatform } from "@/src/data/versionBPresets"

interface FutureVisionPageProps {
  filterState: UseJobFiltersReturn
  platform?: VersionBPlatform
  locationChrome?: FutureVisionLocationChrome
}

function FutureVisionPreset({
  filterState,
  platform,
  locationChrome,
}: {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  locationChrome: FutureVisionLocationChrome
}) {
  const { applySearchQuery, replaceFilters, updateDraftSearch } = filterState
  const { locationSummary, locations, isMultiLocation, selectedLocationIndex } =
    useFutureVisionLocations()
  const presetApplied = useRef(false)

  useEffect(() => {
    applySearchQuery(FUTURE_VISION_DEFAULT_SEARCH)
    replaceFilters({ ...DEFAULT_FILTERS, ...getFutureVisionFilterPatch() })
    presetApplied.current = true
  }, [platform, applySearchQuery, replaceFilters])

  useEffect(() => {
    if (!presetApplied.current) return
    const keywords = filterState.search.keywords || FUTURE_VISION_DEFAULT_SEARCH.keywords
    const filterLocation = isMultiLocation ? "" : (locations[0] ?? "")
    applySearchQuery({
      keywords,
      location: filterLocation,
    })
    updateDraftSearch({
      keywords,
      location: locations.length === 1 ? locations[0] : locationSummary,
    })
  }, [
    locationSummary,
    locations,
    isMultiLocation,
    selectedLocationIndex,
    applySearchQuery,
    updateDraftSearch,
    filterState.search.keywords,
  ])

  if (platform === "app") {
    return (
      <VersionBRoot>
        <FutureVisionApp filterState={filterState} />
      </VersionBRoot>
    )
  }

  if (platform === "mobile-web") {
    return (
      <VersionBRoot className="bg-[#E8ECF2]">
        <FutureVisionMobileWeb filterState={filterState} />
      </VersionBRoot>
    )
  }

  return (
    <VersionBRoot>
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to results
      </a>
      <FutureVisionDesktop filterState={filterState} locationChrome={locationChrome} />
    </VersionBRoot>
  )
}

/** Future Vision — multi-location SERP with desktop / mobile web / app */
export function FutureVisionPage({
  filterState,
  platform = "desktop",
  locationChrome = "multi-pills",
}: FutureVisionPageProps) {
  return (
    <FutureVisionLocationsProvider>
      <FutureVisionPreset
        filterState={filterState}
        platform={platform}
        locationChrome={locationChrome}
      />
    </FutureVisionLocationsProvider>
  )
}
