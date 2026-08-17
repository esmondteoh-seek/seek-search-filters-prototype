import { useEffect, useState } from "react"
import { VERSION_B_SMART_FILTER_EVENT } from "@/src/lib/scrollSearchResultsToTop"
import { FutureVisionMobileSearchSheet } from "@/src/components/futureVision/FutureVisionMobileSearchSheet"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import { SiteHeader } from "@/src/components/SiteHeader"
import {
  FutureVisionFilterChips,
  VersionBNavyBand,
} from "@/src/components/futureVision/FutureVisionFilterChips"
import { FutureVisionLocationChips } from "@/src/components/futureVision/FutureVisionLocationChips"
import { FutureVisionResults } from "@/src/components/futureVision/FutureVisionResults"
import { FutureVisionSearchForm } from "@/src/components/futureVision/FutureVisionSearchForm"
import { useFutureVisionSubmit } from "@/src/components/futureVision/useFutureVisionSubmit"
import { useCompactSearchChrome } from "@/src/hooks/useCompactSearchChrome"
import { useMobileSearchSheet } from "@/src/hooks/useMobileSearchSheet"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import type { FutureVisionLocationChrome } from "@/src/data/futureVisionPresets"
import { cn } from "@/lib/utils"

interface FutureVisionDesktopProps {
  filterState: UseJobFiltersReturn
  locationChrome?: FutureVisionLocationChrome
}

const SCROLL_COLLAPSE_DELTA = 8

/** Future Vision desktop — tab chips or in-field location pills */
export function FutureVisionDesktop({
  filterState,
  locationChrome = "multi-pills",
}: FutureVisionDesktopProps) {
  const {
    compactChrome,
    headerInstant,
    compact: scrollCompact,
    filterBlockRef,
    hasPageScrolled,
    isFilterBlockStuck,
    stickyTop,
  } = useCompactSearchChrome("filter-sticky-sentinel-fv")

  const { mobileDetailOpen } = filterState
  const hideSearchChrome = mobileDetailOpen
  const [bandForceExpanded, setBandForceExpanded] = useState(false)
  const { open: mobileSearchOpen, openSheet, closeSheet } = useMobileSearchSheet(filterState)
  const { submitSearch, openSearchDraft } = useFutureVisionSubmit(filterState)
  const {
    isMultiLocation,
    stopEditingLocation,
    setLocationQuery,
  } = useFutureVisionLocations()
  const showHangingTabs = locationChrome === "tab-chips"
  const isMultiPills = locationChrome === "multi-pills"

  const compact = scrollCompact
  const hideSiteHeader = bandForceExpanded
  const bandExpanded = !compact || bandForceExpanded

  useEffect(() => {
    if (!compact) setBandForceExpanded(false)
  }, [compact])

  useEffect(() => {
    const collapseExpandedBand = () => setBandForceExpanded(false)
    window.addEventListener(VERSION_B_SMART_FILTER_EVENT, collapseExpandedBand)
    return () => window.removeEventListener(VERSION_B_SMART_FILTER_EVENT, collapseExpandedBand)
  }, [])

  useEffect(() => {
    if (!bandForceExpanded) return
    let lastScrollY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y - lastScrollY > SCROLL_COLLAPSE_DELTA) {
        setBandForceExpanded(false)
        stopEditingLocation()
        setLocationQuery("")
      }
      lastScrollY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [bandForceExpanded, stopEditingLocation, setLocationQuery])

  const openSearch = () => {
    openSearchDraft()
    if (compact) {
      stopEditingLocation()
      setLocationQuery("")
      setBandForceExpanded(true)
      return
    }
    openSheet()
  }

  const handleSubmit = () => {
    submitSearch()
    setBandForceExpanded(false)
  }

  return (
    <>
      {!hideSearchChrome ? (
        <>
          <SiteHeader
            showDivider={hasPageScrolled && !bandForceExpanded}
            sticky={!compactChrome}
            hidden={hideSiteHeader}
            instant={headerInstant}
            userName="Riccardo"
          />

          <div id="filter-sticky-sentinel-fv" className="h-0" aria-hidden />

          <div
            ref={filterBlockRef}
            className={cn(
              "sticky z-40 min-w-0",
              hideSiteHeader ? "top-0" : "top-16",
              (isFilterBlockStuck || bandForceExpanded) && "shadow-md",
              bandExpanded && "overflow-visible",
            )}
          >
            <VersionBNavyBand className={cn(showHangingTabs && isMultiLocation && "pb-0")}>
              {bandExpanded ? (
                <>
                  <FutureVisionSearchForm
                    filterState={filterState}
                    onSubmit={handleSubmit}
                    locationChrome={locationChrome}
                  />
                  <FutureVisionFilterChips
                    filterState={filterState}
                    platform="desktop"
                    layout="expanded"
                    includeLocationRow={showHangingTabs}
                  />
                </>
              ) : (
                <div className={cn("flex min-w-0", showHangingTabs && "flex-col gap-3")}>
                  <div
                    className={cn(
                      "flex min-w-0 items-center gap-2 md:gap-3",
                      isMultiPills
                        ? "flex-nowrap overflow-x-auto hide-scrollbar"
                        : "flex-wrap md:flex-nowrap",
                    )}
                  >
                    <FutureVisionSearchForm
                      filterState={filterState}
                      compact
                      onOpenSearch={openSearch}
                      locationChrome={locationChrome}
                    />
                    <FutureVisionFilterChips
                      filterState={filterState}
                      platform="desktop"
                      layout="inline"
                      onMoreClick={openSearch}
                      includeLocationRow={false}
                    />
                  </div>
                  {showHangingTabs && isMultiLocation ? (
                    <FutureVisionLocationChips platform="desktop" />
                  ) : null}
                </div>
              )}
            </VersionBNavyBand>
          </div>
        </>
      ) : null}

      <div className={cn(!hideSearchChrome && "pt-2")}>
        <FutureVisionResults
          filterState={filterState}
          platform="desktop"
          stickyTop={stickyTop}
          forceSplit
        />
      </div>

      <FutureVisionMobileSearchSheet
        open={mobileSearchOpen}
        onClose={closeSheet}
        filterState={filterState}
        onSubmit={submitSearch}
      />
    </>
  )
}
