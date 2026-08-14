import { UnifiedFilterRow } from "@/src/components/concept2/UnifiedFilterRow"
import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import { SearchBandCompactRow } from "@/src/components/shared/searchBand/SearchBandCompactRow"
import { SearchBandDesktopExpanded } from "@/src/components/shared/searchBand/SearchBandDesktopExpanded"
import { SearchBandShell } from "@/src/components/shared/searchBand/SearchBandShell"
import { useSearchBandForm } from "@/src/components/shared/searchBand/useSearchBandForm"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { useExpandedSearchBand } from "@/src/hooks/useExpandedSearchBand"
import { formatBulletSearchLabel } from "@/src/utils/searchLabel"

interface Concept2SearchBandProps {
  filterState: UseJobFiltersReturn
}

/** Concept 2 — compact band; expanded What/Where opens on search pill click */
export function Concept2SearchBand({ filterState }: Concept2SearchBandProps) {
  const form = useSearchBandForm(filterState)
  const { search } = filterState
  const {
    searchExpanded,
    openSearch,
    submitSearch,
    mobileSearchOpen,
    closeMobileSearch,
  } = useExpandedSearchBand(filterState)

  const searchPillLabel = formatBulletSearchLabel(search.keywords, search.location)

  const inlineFilters = <UnifiedFilterRow filterState={filterState} inline />

  const inlineMobileFilters = (
    <UnifiedFilterRow
      filterState={filterState}
      isMobile
      inline
      onOpenSearchForm={openSearch}
    />
  )

  return (
    <SearchBandShell expanded={searchExpanded}>
      {searchExpanded ? (
        <>
          <SearchBandDesktopExpanded
            filterState={filterState}
            expanded={searchExpanded}
            locationPlaceholder="All Australia"
            onKeyDown={form.handleKeyDown}
            onRestoreKeywordsIfEmpty={form.restoreKeywordsIfEmpty}
            onSubmitSearch={submitSearch}
          />

          <div className="mt-3 hidden md:block">
            <UnifiedFilterRow filterState={filterState} />
          </div>
        </>
      ) : (
        <SearchBandCompactRow
          filterState={filterState}
          searchPillLabel={searchPillLabel}
          onOpenSearch={openSearch}
          desktopFilters={inlineFilters}
          mobileFilters={inlineMobileFilters}
        />
      )}

      <MobileSearchSheet open={mobileSearchOpen} onClose={closeMobileSearch} filterState={filterState} />
    </SearchBandShell>
  )
}
