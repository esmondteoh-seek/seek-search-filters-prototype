import { PersonalisedFilterBar } from "@/src/components/FilterBar/PersonalisedFilterBar"
import { SearchBand } from "@/src/components/SearchBand"
import { SearchResultsLayout } from "@/src/components/shared/SearchResultsLayout"
import { SiteHeader } from "@/src/components/SiteHeader"
import type { ConceptPageProps } from "@/src/concepts/types"
import { useCompactSearchChrome } from "@/src/hooks/useCompactSearchChrome"
import { cn } from "@/lib/utils"

/** Concept 1 — compact sticky band; search expands on pill click */
export function Concept1Page({ filterState }: ConceptPageProps) {
  const {
    compactChrome,
    headerHidden,
    headerInstant,
    filterBlockRef,
    isFilterBlockStuck,
    hasPageScrolled,
    stickyTop,
  } = useCompactSearchChrome("filter-sticky-sentinel")
  const { mobileDetailOpen } = filterState
  const hideSearchChrome = mobileDetailOpen

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

          <div id="filter-sticky-sentinel" className="h-0" aria-hidden />

          <div
            ref={filterBlockRef}
            className={cn(
              "sticky z-40 min-w-0",
              compactChrome || headerHidden ? "top-0" : "top-16",
              isFilterBlockStuck && "shadow-md",
            )}
          >
            <SearchBand filterState={filterState} />
          </div>

          <PersonalisedFilterBar filterState={filterState} showDivider={isFilterBlockStuck} />
        </>
      ) : null}

      <SearchResultsLayout filterState={filterState} stickyTop={stickyTop} />
    </div>
  )
}
