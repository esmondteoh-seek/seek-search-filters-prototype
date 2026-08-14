import { useEffect, useRef, useState } from "react"
import { VersionAResultsLayout } from "@/src/components/versionA/VersionAResultsLayout"
import { VersionASearchBand } from "@/src/components/versionA/VersionASearchBand"
import { SiteHeader } from "@/src/components/SiteHeader"
import type { ConceptPageProps } from "@/src/concepts/types"
import { useCompactSearchChrome } from "@/src/hooks/useCompactSearchChrome"
import { cn } from "@/lib/utils"

/** Delivery Version A — Strong Applicant filter (Figma 17292:45149 / 17290:39535) */
export function VersionAPage({ filterState }: ConceptPageProps) {
  const {
    compactChrome,
    headerInstant,
    compact,
    filterBlockRef,
    isFilterBlockStuck,
    hasPageScrolled,
    stickyTop,
  } = useCompactSearchChrome("filter-sticky-sentinel-va")
  const { mobileDetailOpen, filters, updateFilters } = filterState
  const hideSearchChrome = mobileDetailOpen
  const defaultedSegment = useRef(false)
  const [bandForceExpanded, setBandForceExpanded] = useState(false)

  useEffect(() => {
    if (defaultedSegment.current) return
    defaultedSegment.current = true
    if (!filters.newToYou && !filters.strongApplicant) {
      updateFilters({ strongApplicant: true })
    }
  }, [filters.newToYou, filters.strongApplicant, updateFilters])

  const hideSiteHeader = compact || bandForceExpanded
  const stickyTopOffset = compactChrome || hideSiteHeader ? "top-0" : "top-16"

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to results
      </a>

      {!hideSearchChrome ? (
        <>
          <SiteHeader
            userName="Riccardo"
            jobSearchActive
            activeNavUnderline="brand"
            showDivider={hasPageScrolled && !bandForceExpanded}
            sticky={!compactChrome}
            hidden={hideSiteHeader}
            instant={headerInstant}
          />

          <div id="filter-sticky-sentinel-va" className="h-0" aria-hidden />

          <div
            ref={filterBlockRef}
            className={cn(
              "sticky z-40 min-w-0",
              stickyTopOffset,
              isFilterBlockStuck && "shadow-md",
            )}
          >
            <VersionASearchBand
              filterState={filterState}
              compact={compact}
              forceExpanded={bandForceExpanded}
              onForceExpandedChange={setBandForceExpanded}
            />
          </div>
        </>
      ) : null}

      <VersionAResultsLayout filterState={filterState} stickyTop={stickyTop} />
    </div>
  )
}
