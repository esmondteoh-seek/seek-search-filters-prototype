import { useRef } from "react"
import { SeekLogo } from "@/components/seek-logo"
import { IconChevronDown } from "@/components/braid/icons"
import { FutureVisionMobileSearchSheet } from "@/src/components/futureVision/FutureVisionMobileSearchSheet"
import {
  FutureVisionFilterChips,
  VersionBNavyBand,
} from "@/src/components/futureVision/FutureVisionFilterChips"
import { FutureVisionResults } from "@/src/components/futureVision/FutureVisionResults"
import { FutureVisionMobileSearchPill } from "@/src/components/futureVision/FutureVisionSearchForm"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import { useFutureVisionSubmit } from "@/src/components/futureVision/useFutureVisionSubmit"
import { PhoneFrame } from "@/src/components/shared/PhoneFrame"
import { useMobileSearchSheet } from "@/src/hooks/useMobileSearchSheet"
import { useHideOnScrollDown } from "@/src/hooks/useHideOnScrollDown"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { formatFutureVisionCompactPill } from "@/src/data/futureVisionPresets"
import type { FutureVisionLocationChrome } from "@/src/data/futureVisionPresets"
import { cn } from "@/lib/utils"

interface FutureVisionMobileWebProps {
  filterState: UseJobFiltersReturn
  locationChrome?: FutureVisionLocationChrome
}

/** Future Vision mobile web — phone shell, navy band, location chips when multi */
export function FutureVisionMobileWeb({
  filterState,
  locationChrome = "multi-pills",
}: FutureVisionMobileWebProps) {
  const { mobileDetailOpen, search } = filterState
  const { locations, isMultiLocation } = useFutureVisionLocations()
  const hideSearchChrome = mobileDetailOpen
  const { open: mobileSearchOpen, openSheet, closeSheet } = useMobileSearchSheet(filterState)
  const { submitSearch, openSearchDraft } = useFutureVisionSubmit(filterState)
  const pillLabel = formatFutureVisionCompactPill(search.keywords, locations)
  const scrollRef = useRef<HTMLDivElement>(null)
  const showHangingTabs = locationChrome === "tab-chips"
  const { hidden: locationsHidden, reveal, instant } = useHideOnScrollDown(scrollRef, {
    forceVisible: mobileSearchOpen,
    enabled: isMultiLocation && !hideSearchChrome,
  })

  const handleOpenSheet = () => {
    reveal()
    openSearchDraft()
    openSheet()
  }

  const showLocations = isMultiLocation && !locationsHidden

  return (
    <PhoneFrame className="bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[#EAECF1] bg-white px-4 py-3">
        <SeekLogo className="h-7 w-auto text-[#1E47A9]" />
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-[#2E3849] hover:bg-[#F5F7FA]"
          aria-haspopup="menu"
        >
          Menu
          <IconChevronDown className="h-4 w-4 text-[#5A6881]" aria-hidden />
        </button>
      </header>

      {!hideSearchChrome ? (
        <div className="shrink-0">
          <VersionBNavyBand
            className="min-w-0 px-0 py-0 md:px-0"
            contentClassName={cn(
              "px-5 pt-5",
              showHangingTabs && showLocations ? "pb-0" : "pb-4",
            )}
          >
            <FutureVisionMobileSearchPill label={pillLabel} onOpen={handleOpenSheet} />
            <FutureVisionFilterChips
              filterState={filterState}
              platform="mobile-web"
              layout="inline"
              onMoreClick={handleOpenSheet}
              includeLocationRow={showHangingTabs}
              hideLocationRow={locationsHidden}
              locationRowInstant={instant}
            />
          </VersionBNavyBand>
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
        data-version-b-scroll
      >
        <FutureVisionResults
          filterState={filterState}
          platform="mobile-web"
          singleColumn
          locationChrome={locationChrome}
        />
      </div>

      <div className="flex shrink-0 justify-center pb-2 pt-1">
        <div className="h-1 w-28 rounded-full bg-[#2E3849]/20" aria-hidden />
      </div>

      <FutureVisionMobileSearchSheet
        open={mobileSearchOpen}
        onClose={closeSheet}
        filterState={filterState}
        onSubmit={submitSearch}
        contained
      />
    </PhoneFrame>
  )
}
