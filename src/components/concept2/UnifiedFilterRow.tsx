import { useState } from "react"
import { cn } from "@/lib/utils"
import { AllFiltersSheet } from "@/src/components/FilterBar/AllFiltersSheet"
import { SortFilterPill } from "@/src/components/FilterBar/SortFilterPill"
import { SmartFilterChip } from "@/src/components/FilterBar/SmartFilterChip"
import { FiltersEntryControl } from "@/src/components/concept2/FiltersEntryControl"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters } from "@/src/hooks/useJobFilters"

interface UnifiedFilterRowProps {
  filterState: UseJobFiltersReturn
  /** Mobile SERP row — Filters opens search form; desktop opens filters modal */
  isMobile?: boolean
  /** Mobile — opens Concept 1 search sheet (Figma 4128:21899) */
  onOpenSearchForm?: () => void
  /** Inline beside compact search pill — no wrap, horizontal scroll */
  inline?: boolean
  /** Compact sticky bar — icon-only Filters on mobile */
  compactSticky?: boolean
}

/** Concept 2 — smart chips + More in compact row; Filters + Sort when expanded (Figma 4174) */
export function UnifiedFilterRow({
  filterState,
  isMobile = false,
  onOpenSearchForm,
  inline = false,
  compactSticky = false,
}: UnifiedFilterRowProps) {
  const {
    filters,
    smartFilterCounts,
    dismissedBadges,
    toggleSmartFilter,
    showCompanyFilter,
    search,
    updateFilters,
    clearAllFilters,
    dismissSmartFilterBadge,
  } = filterState

  const [sheetOpen, setSheetOpen] = useState(false)
  const modalFilterCount = countModalFilters(filters)

  const newToYouChip = (
    <SmartFilterChip
      label={isMobile ? "New" : "New to you"}
      count={smartFilterCounts.newToYou}
      active={filters.newToYou}
      showBadge={!dismissedBadges.newToYou}
      onToggle={() => toggleSmartFilter("newToYou")}
      variant="navy"
    />
  )

  const strongApplicantChip = (
    <SmartFilterChip
      label="Strong applicant"
      count={smartFilterCounts.strongApplicant}
      active={filters.strongApplicant}
      showBadge={!dismissedBadges.strongApplicant}
      onToggle={() => toggleSmartFilter("strongApplicant")}
      variant="navy"
    />
  )

  const companyChip =
    showCompanyFilter ? (
      <SmartFilterChip
        label="Jobs at SEEK"
        count={smartFilterCounts.jobsAtSeek}
        active={filters.jobsAtSeek}
        showBadge={!dismissedBadges.jobsAtSeek}
        onToggle={() => toggleSmartFilter("jobsAtSeek")}
        variant="navy"
      />
    ) : null

  const filtersEntry = (
    <FiltersEntryControl
      appliedCount={modalFilterCount}
      opensSearchForm={isMobile}
      iconOnly={compactSticky && isMobile}
      shape="pill"
      label="More"
      onClick={isMobile ? onOpenSearchForm : () => setSheetOpen(true)}
    />
  )

  const sortPill = (
    <SortFilterPill
      sort={filters.sort}
      onSortChange={(sort) => updateFilters({ sort })}
      variant="navy"
      iconOnly
      compact={isMobile}
      menuAlign="end"
    />
  )

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2",
          inline && "min-w-0 flex-1 overflow-x-auto hide-scrollbar filter-scroll-fade-right",
          isMobile && !inline && "overflow-x-auto hide-scrollbar filter-scroll-fade-right",
          !isMobile && !inline && "flex-wrap gap-2",
        )}
        style={inline || isMobile ? { WebkitOverflowScrolling: "touch" } : undefined}
      >
        {inline ? (
          <>
            {newToYouChip}
            {strongApplicantChip}
            {companyChip}
            {filtersEntry}
            {sortPill}
          </>
        ) : (
          <>
            {newToYouChip}
            {strongApplicantChip}
            {filtersEntry}
            {companyChip}
            {sortPill}
          </>
        )}
      </div>

      {!isMobile && (
        <AllFiltersSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          filters={filters}
          search={search}
          hasLocation={filterState.hasLocation}
          showCompanyFilter={showCompanyFilter}
          onChange={updateFilters}
          smartFilterCounts={smartFilterCounts}
          dismissedBadges={dismissedBadges}
          dismissSmartFilterBadge={dismissSmartFilterBadge}
          title="Filters"
          showSmartFilters={false}
          onClearAll={clearAllFilters}
          presentation="drawer"
        />
      )}
    </>
  )
}
