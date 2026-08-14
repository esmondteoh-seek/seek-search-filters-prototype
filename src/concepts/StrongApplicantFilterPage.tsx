import { useEffect, useRef } from "react"
import { StrongApplicantResultsLayout } from "@/src/components/strongApplicant/StrongApplicantResultsLayout"
import { StrongApplicantSearchBand } from "@/src/components/strongApplicant/StrongApplicantSearchBand"
import { SiteHeader } from "@/src/components/SiteHeader"
import type { ConceptPageProps } from "@/src/concepts/types"
import { useCompactSearchChrome } from "@/src/hooks/useCompactSearchChrome"
import { cn } from "@/lib/utils"

/** Strong Applicant Filter — top results bar + expanded search band (Figma 4166) */
export function StrongApplicantFilterPage({ filterState }: ConceptPageProps) {
  const {
    compactChrome,
    headerHidden,
    headerInstant,
    filterBlockRef,
    isFilterBlockStuck,
    hasPageScrolled,
    stickyTop,
  } = useCompactSearchChrome("filter-sticky-sentinel-saf")
  const { mobileDetailOpen, filters, updateFilters } = filterState
  const hideSearchChrome = mobileDetailOpen
  const defaultedSegment = useRef(false)

  useEffect(() => {
    if (defaultedSegment.current) return
    defaultedSegment.current = true
    if (!filters.newToYou && !filters.strongApplicant) {
      updateFilters({ strongApplicant: true })
    }
  }, [filters.newToYou, filters.strongApplicant, updateFilters])

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to results
      </a>

      {!hideSearchChrome ? (
        <>
          <SiteHeader
            showDivider={hasPageScrolled}
            sticky={!compactChrome}
            hidden={headerHidden}
            instant={headerInstant}
          />

          <div id="filter-sticky-sentinel-saf" className="h-0" aria-hidden />

          <div
            ref={filterBlockRef}
            className={cn(
              "sticky z-40",
              compactChrome || headerHidden ? "top-0" : "top-16",
              isFilterBlockStuck && "shadow-md",
            )}
          >
            <StrongApplicantSearchBand filterState={filterState} />
          </div>
        </>
      ) : null}

      <StrongApplicantResultsLayout filterState={filterState} stickyTop={stickyTop} />
    </div>
  )
}
