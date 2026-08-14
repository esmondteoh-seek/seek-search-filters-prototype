import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import { SearchBandCompactRow } from "@/src/components/shared/searchBand/SearchBandCompactRow"
import { SearchBandDesktopExpanded } from "@/src/components/shared/searchBand/SearchBandDesktopExpanded"
import { SearchBandShell } from "@/src/components/shared/searchBand/SearchBandShell"
import { useSearchBandForm } from "@/src/components/shared/searchBand/useSearchBandForm"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { useExpandedSearchBand } from "@/src/hooks/useExpandedSearchBand"
import { formatBulletSearchLabel } from "@/src/utils/searchLabel"
import { StandardFiltersRow } from "./FilterBar/StandardFiltersRow"

interface SearchBandProps {
  filterState: UseJobFiltersReturn
}

export function SearchBand({ filterState }: SearchBandProps) {
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

  return (
    <SearchBandShell expanded={searchExpanded}>
      {searchExpanded ? (
        <>
          <SearchBandDesktopExpanded
            filterState={filterState}
            expanded={searchExpanded}
            onKeyDown={form.handleKeyDown}
            onRestoreKeywordsIfEmpty={form.restoreKeywordsIfEmpty}
            onSubmitSearch={submitSearch}
          />

          <div className="mt-3 hidden md:block">
            <StandardFiltersRow filterState={filterState} variant="navy" showSort />
          </div>
        </>
      ) : (
        <SearchBandCompactRow
          filterState={filterState}
          searchPillLabel={searchPillLabel}
          onOpenSearch={openSearch}
          showSort
        />
      )}

      <MobileSearchSheet open={mobileSearchOpen} onClose={closeMobileSearch} filterState={filterState} />
    </SearchBandShell>
  )
}
