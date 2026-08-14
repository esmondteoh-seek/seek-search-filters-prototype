import { useEffect } from "react"
import { VersionBApp } from "@/src/components/versionB/VersionBApp"
import { VersionBDesktop } from "@/src/components/versionB/VersionBDesktop"
import { VersionBMobileWeb } from "@/src/components/versionB/VersionBMobileWeb"
import { VersionBRoot } from "@/src/components/versionB/VersionBRoot"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import {
  getVersionBFilterPatch,
  getVersionBSearch,
  type VersionBPlatform,
  type VersionBPreviewState,
} from "@/src/data/versionBPresets"
import { DEFAULT_FILTERS } from "@/src/hooks/useJobFilters"

interface VersionBPageProps {
  filterState: UseJobFiltersReturn
  platform?: VersionBPlatform
  previewState?: VersionBPreviewState
}

function useVersionBPreset(
  applySearchQuery: UseJobFiltersReturn["applySearchQuery"],
  replaceFilters: UseJobFiltersReturn["replaceFilters"],
  platform: VersionBPlatform,
  previewState: VersionBPreviewState,
) {
  useEffect(() => {
    const search = getVersionBSearch(platform, previewState)
    const patch = getVersionBFilterPatch(previewState)
    applySearchQuery(search)
    replaceFilters({ ...DEFAULT_FILTERS, ...patch })
  }, [platform, previewState, applySearchQuery, replaceFilters])
}

/** Delivery Version B — thin platform switcher over dedicated SERP chrome */
export function VersionBPage({
  filterState,
  platform = "desktop",
  previewState = "default",
}: VersionBPageProps) {
  useVersionBPreset(filterState.applySearchQuery, filterState.replaceFilters, platform, previewState)

  if (platform === "app") {
    return (
      <VersionBRoot>
        <VersionBApp filterState={filterState} previewState={previewState} />
      </VersionBRoot>
    )
  }

  if (platform === "mobile-web") {
    return (
      <VersionBRoot className="bg-[#E8ECF2]">
        <VersionBMobileWeb filterState={filterState} previewState={previewState} />
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
      <VersionBDesktop filterState={filterState} previewState={previewState} />
    </VersionBRoot>
  )
}
