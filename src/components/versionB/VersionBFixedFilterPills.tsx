import {
  ClassificationFilterContent,
  ListingTimeFilterContent,
  PayFilterContent,
  RemoteFilterContent,
  WorkTypeFilterContent,
  getClassificationAppliedLabel,
  getListingTimeAppliedLabel,
  getPayAppliedLabel,
  getRemoteAppliedLabel,
  getWorkTypeAppliedLabel,
} from "@/src/components/FilterBar/filterControls"
import { FilterPill } from "@/src/components/FilterBar/FilterPill"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { patchClearingBlankSa } from "@/src/lib/isBlankSearch"
import { scrollSearchResultsToTop } from "@/src/lib/scrollSearchResultsToTop"

interface VersionBFixedFilterPillsProps {
  filterState: UseJobFiltersReturn
  variant?: "navy" | "compact"
  presentation?: "popover" | "sheet"
  /** Draft search for in-form preview (app / mobile search sheet) */
  searchOverride?: SearchQuery
  className?: string
}

/** Shared navy fixed filter pills — home and Version B SERP */
export function VersionBFixedFilterPills({
  filterState,
  variant = "navy",
  presentation = "popover",
  searchOverride,
  className,
}: VersionBFixedFilterPillsProps) {
  const { filters, search, applyFilters, clearFilter, closeMobileDetail } = filterState
  const activeSearch = searchOverride ?? search
  const isSheet = presentation === "sheet"

  const handleApplyFilters = (patch: Parameters<typeof applyFilters>[0]) => {
    applyFilters(patchClearingBlankSa(search, filters, patch))
    scrollSearchResultsToTop()
    closeMobileDetail()
  }

  const popoverProps = {
    filters,
    search: activeSearch,
    onApplyFilters: handleApplyFilters,
    showFooter: false,
    applyOnChange: true,
    presentation,
  }
  const contentVariant = isSheet ? ("sheet" as const) : ("popover" as const)

  const pills = (
    <>
      <FilterPill
        label="Pay"
        appliedLabel={getPayAppliedLabel(filters)}
        applied={!!getPayAppliedLabel(filters)}
        onClear={() => clearFilter("payMin")}
        popoverTitle={isSheet ? "Pay (AUD)" : "Pay"}
        popoverWidth={400}
        variant={variant}
        closeOnApply
        {...popoverProps}
      >
        <PayFilterContent variant={contentVariant} />
      </FilterPill>
      <FilterPill
        label="Type"
        appliedLabel={getWorkTypeAppliedLabel(filters)}
        applied={!!getWorkTypeAppliedLabel(filters)}
        onClear={() => clearFilter("workTypes")}
        popoverTitle="Work type"
        variant={variant}
        closeOnApply
        {...popoverProps}
      >
        <WorkTypeFilterContent variant={contentVariant} />
      </FilterPill>
      <FilterPill
        label="Remote"
        appliedLabel={getRemoteAppliedLabel(filters)}
        applied={!!getRemoteAppliedLabel(filters)}
        onClear={() => clearFilter("remoteOptions")}
        popoverTitle="Remote options"
        variant={variant}
        closeOnApply
        {...popoverProps}
      >
        <RemoteFilterContent variant={contentVariant} />
      </FilterPill>
      <FilterPill
        label={variant === "compact" ? "Class…" : "Classification"}
        appliedLabel={getClassificationAppliedLabel(filters)}
        applied={!!getClassificationAppliedLabel(filters)}
        onClear={() => clearFilter("classifications")}
        popoverTitle="Classification"
        popoverWidth={360}
        variant={variant}
        sheetShowClearAll={isSheet}
        sheetTall={isSheet}
        closeOnApply={false}
        {...popoverProps}
      >
        <ClassificationFilterContent variant={isSheet ? "modal" : contentVariant} />
      </FilterPill>
      <FilterPill
        label="Listing time"
        appliedLabel={getListingTimeAppliedLabel(filters, variant === "compact")}
        applied={!!getListingTimeAppliedLabel(filters, variant === "compact")}
        onClear={() => clearFilter("listingTime")}
        popoverTitle="Listing time"
        variant={variant}
        closeOnApply
        {...popoverProps}
      >
        <ListingTimeFilterContent variant={contentVariant} />
      </FilterPill>
    </>
  )

  if (className) {
    return <div className={className}>{pills}</div>
  }

  return pills
}
