import { useState } from "react"
import { Concept3SearchBand } from "@/src/components/concept3/Concept3SearchBand"
import { SearchResultsLayout } from "@/src/components/shared/SearchResultsLayout"
import { SiteHeader } from "@/src/components/SiteHeader"
import type { ConceptPageProps } from "@/src/concepts/types"
import { useCompactSearchChrome } from "@/src/hooks/useCompactSearchChrome"
import { cn } from "@/lib/utils"

/** Concept 3 — expandable filter row; compacts on scroll (Figma SERP C) */
export function Concept3Page({ filterState }: ConceptPageProps) {
  const {
    compactChrome,
    headerInstant,
    compact,
    filterBlockRef,
    isFilterBlockStuck,
    hasPageScrolled,
    stickyTop,
  } = useCompactSearchChrome("filter-sticky-sentinel-c3")
  const { mobileDetailOpen } = filterState
  const hideSearchChrome = mobileDetailOpen
  const [bandForceExpanded, setBandForceExpanded] = useState(false)

  // Keep SEEK nav hidden while the band is compact/scrolled (or force-expanded).
  // Do not rely on scroll-away alone — filter toggles shrink results and can
  // briefly drop scrollY, which would flash the primary nav back into view.
  const hideSiteHeader = compact || bandForceExpanded
  const stickyTopOffset = compactChrome || hideSiteHeader ? "top-0" : "top-16"

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
            showDivider={hasPageScrolled && !bandForceExpanded}
            sticky={!compactChrome}
            hidden={hideSiteHeader}
            instant={headerInstant}
          />

          <div id="filter-sticky-sentinel-c3" className="h-0" aria-hidden />

          <div
            ref={filterBlockRef}
            className={cn(
              "sticky z-40 min-w-0",
              stickyTopOffset,
              isFilterBlockStuck && "shadow-md",
            )}
          >
            <Concept3SearchBand
              filterState={filterState}
              compact={compact}
              forceExpanded={bandForceExpanded}
              onForceExpandedChange={setBandForceExpanded}
            />
          </div>
        </>
      ) : null}

      <div className={cn(!hideSearchChrome && "pt-6 lg:pt-6")}>
        <SearchResultsLayout filterState={filterState} stickyTop={stickyTop} />
      </div>
    </div>
  )
}
