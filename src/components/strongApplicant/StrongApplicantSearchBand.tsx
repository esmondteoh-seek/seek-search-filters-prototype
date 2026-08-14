import { useEffect, useState } from "react"
import { MobileSearchSheet } from "@/src/components/MobileSearchSheet"
import { StandardFiltersRow } from "@/src/components/FilterBar/StandardFiltersRow"
import { SearchBandCompactRow } from "@/src/components/shared/searchBand/SearchBandCompactRow"
import { SearchBandDesktopExpanded } from "@/src/components/shared/searchBand/SearchBandDesktopExpanded"
import { SearchBandShell } from "@/src/components/shared/searchBand/SearchBandShell"
import { useSearchBandForm } from "@/src/components/shared/searchBand/useSearchBandForm"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { useExpandedSearchBand } from "@/src/hooks/useExpandedSearchBand"
import { formatBulletSearchLabel } from "@/src/utils/searchLabel"

interface StrongApplicantSearchBandProps {
  filterState: UseJobFiltersReturn
}

/** Strong Applicant Filter — standard filters in navy band only (Figma 4166:28838) */
export function StrongApplicantSearchBand({ filterState }: StrongApplicantSearchBandProps) {
  const form = useSearchBandForm(filterState)
  const { search } = filterState
  const [isMobile, setIsMobile] = useState(false)
  const {
    searchExpanded,
    openSearch,
    submitSearch,
    mobileSearchOpen,
    closeMobileSearch,
  } = useExpandedSearchBand(filterState)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const searchPillLabel = formatBulletSearchLabel(search.keywords, search.location)
  const bandExpanded = !isMobile || searchExpanded

  return (
    <SearchBandShell expanded={bandExpanded}>
      {!isMobile ? (
        <>
          <SearchBandDesktopExpanded
            filterState={filterState}
            expanded
            locationPlaceholder="All Australia"
            onKeyDown={form.handleKeyDown}
            onRestoreKeywordsIfEmpty={form.restoreKeywordsIfEmpty}
            onSubmitSearch={submitSearch}
            showSaveSearch={false}
            showLocationRadius={false}
            brandSeekButton
          />

          <div className="mt-4 hidden flex-wrap items-center gap-3 md:flex">
            <StandardFiltersRow filterState={filterState} variant="navy" className="min-w-0" />
          </div>
        </>
      ) : (
        <SearchBandCompactRow
          filterState={filterState}
          searchPillLabel={searchPillLabel}
          onOpenSearch={openSearch}
          showSaveSearch={false}
          mobileFilters={
            <StandardFiltersRow
              filterState={filterState}
              variant="compact"
              inline
              compactLabels
              className="min-w-0 flex-1"
            />
          }
        />
      )}

      <MobileSearchSheet
        open={mobileSearchOpen}
        onClose={closeMobileSearch}
        filterState={filterState}
        showLocationRadius={false}
        brandSeekButton
      />
    </SearchBandShell>
  )
}
