import { useEffect, useState } from "react"
import { VERSION_B_SMART_FILTER_EVENT } from "@/src/lib/scrollSearchResultsToTop"
import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import { SiteHeader } from "@/src/components/SiteHeader"
import {
  VersionBFilterChips,
  VersionBNavyBand,
} from "@/src/components/versionB/VersionBFilterChips"
import { VersionBResults } from "@/src/components/versionB/VersionBResults"
import { VersionBSearchForm } from "@/src/components/versionB/VersionBSearchForm"
import { useCompactSearchChrome } from "@/src/hooks/useCompactSearchChrome"
import { useMobileSearchSheet } from "@/src/hooks/useMobileSearchSheet"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { cn } from "@/lib/utils"

interface VersionBDesktopProps {
  filterState: UseJobFiltersReturn
  previewState: VersionBPreviewState
}

const SCROLL_COLLAPSE_DELTA = 8

/** Version B desktop — header visible on scrolled, flat navy band */
export function VersionBDesktop({ filterState, previewState }: VersionBDesktopProps) {
  const {
    compactChrome,
    headerInstant,
    compact: scrollCompact,
    filterBlockRef,
    isFilterBlockStuck,
    hasPageScrolled,
    stickyTop,
  } = useCompactSearchChrome("filter-sticky-sentinel-vb")

  const { mobileDetailOpen } = filterState
  const hideSearchChrome = mobileDetailOpen
  const [bandForceExpanded, setBandForceExpanded] = useState(false)
  const { open: mobileSearchOpen, openSheet, closeSheet } = useMobileSearchSheet(filterState)

  const forceScrolled = previewState === "scrolled"
  const compact = scrollCompact || forceScrolled
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
      if (y - lastScrollY > SCROLL_COLLAPSE_DELTA) setBandForceExpanded(false)
      lastScrollY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [bandForceExpanded])

  const openSearch = () => {
    filterState.updateDraftSearch(filterState.search)
    if (compact) {
      setBandForceExpanded(true)
      return
    }
    openSheet()
  }

  const submitSearch = () => {
    filterState.submitSearch()
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

          <div id="filter-sticky-sentinel-vb" className="h-0" aria-hidden />

          <div
            ref={filterBlockRef}
            className={cn(
              "sticky z-40 min-w-0 shadow-md",
              hideSiteHeader ? "top-0" : "top-16",
              (isFilterBlockStuck || forceScrolled) && "shadow-md",
            )}
          >
            <VersionBNavyBand>
              {bandExpanded ? (
                <>
                  <VersionBSearchForm
                    filterState={filterState}
                    onSubmit={submitSearch}
                    locationPlaceholder="All Australia"
                    platform="desktop"
                    previewState={previewState}
                  />
                  <VersionBFilterChips
                    filterState={filterState}
                    platform="desktop"
                    layout="expanded"
                  />
                </>
              ) : (
                <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-nowrap md:gap-3">
                  <VersionBSearchForm
                    filterState={filterState}
                    compact
                    onOpenSearch={openSearch}
                  />
                  <VersionBFilterChips
                    filterState={filterState}
                    platform="desktop"
                    layout="inline"
                    onMoreClick={openSearch}
                  />
                </div>
              )}
            </VersionBNavyBand>
          </div>
        </>
      ) : null}

      <div className={cn(!hideSearchChrome && "pt-6")}>
        <VersionBResults
          filterState={filterState}
          platform="desktop"
          previewState={previewState}
          stickyTop={stickyTop}
          forceSplit
        />
      </div>

      <MobileSearchSheet
        open={mobileSearchOpen}
        onClose={closeSheet}
        filterState={filterState}
        showLocationRadius={false}
        brandSeekButton
      />
    </>
  )
}
