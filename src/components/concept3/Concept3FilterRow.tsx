import { FilterPill } from "@/src/components/FilterBar/FilterPill"
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
import { SmartFilterChip } from "@/src/components/FilterBar/SmartFilterChip"
import { SortFilterPill } from "@/src/components/FilterBar/SortFilterPill"
import { FiltersEntryControl } from "@/src/components/concept2/FiltersEntryControl"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters } from "@/src/hooks/useJobFilters"

interface Concept3FilterRowProps {
  filterState: UseJobFiltersReturn
  /** Sticky compact row — smart chips always shown; standard filters behind "More" */
  inline?: boolean
  /** Compact row "More" action — expands the band back to its default state */
  onExpand?: () => void
}

/** Concept 3 — unified navy filter row: standard pills + smart chips + sort (Figma 4199:25045 / 4199:26031) */
export function Concept3FilterRow({ filterState, inline = false, onExpand }: Concept3FilterRowProps) {
  const {
    filters,
    search,
    applyFilters,
    clearFilter,
    smartFilterCounts,
    dismissedBadges,
    toggleSmartFilter,
    showCompanyFilter,
    updateFilters,
  } = filterState

  const popoverProps = { filters, search, onApplyFilters: applyFilters }

  const payApplied = getPayAppliedLabel(filters)
  const classificationApplied = getClassificationAppliedLabel(filters)
  const workTypeApplied = getWorkTypeAppliedLabel(filters)
  const remoteApplied = getRemoteAppliedLabel(filters)
  const listingTimeApplied = getListingTimeAppliedLabel(filters)

  const standardPills = (
    <>
      <FilterPill
        label="Pay"
        appliedLabel={payApplied}
        applied={!!payApplied}
        onClear={() => clearFilter("payMin")}
        popoverTitle="Pay"
        popoverWidth={400}
        variant="navy"
        {...popoverProps}
      >
        <PayFilterContent variant="popover" />
      </FilterPill>

      <FilterPill
        label="Classification"
        appliedLabel={classificationApplied}
        applied={!!classificationApplied}
        onClear={() => clearFilter("classifications")}
        popoverTitle="Classification"
        popoverWidth={360}
        variant="navy"
        {...popoverProps}
      >
        <ClassificationFilterContent variant="popover" />
      </FilterPill>

      <FilterPill
        label="Work type"
        appliedLabel={workTypeApplied}
        applied={!!workTypeApplied}
        onClear={() => clearFilter("workTypes")}
        popoverTitle="Work type"
        variant="navy"
        {...popoverProps}
      >
        <WorkTypeFilterContent />
      </FilterPill>

      <FilterPill
        label="Remote"
        appliedLabel={remoteApplied}
        applied={!!remoteApplied}
        onClear={() => clearFilter("remoteOptions")}
        popoverTitle="Remote options"
        variant="navy"
        {...popoverProps}
      >
        <RemoteFilterContent />
      </FilterPill>

      <FilterPill
        label="Listing time"
        appliedLabel={listingTimeApplied}
        applied={!!listingTimeApplied}
        onClear={() => clearFilter("listingTime")}
        popoverTitle="Listing time"
        variant="navy"
        {...popoverProps}
      >
        <ListingTimeFilterContent />
      </FilterPill>
    </>
  )

  const smartChips = (
    <>
      <SmartFilterChip
        label="New to you"
        count={smartFilterCounts.newToYou}
        active={filters.newToYou}
        showBadge={!dismissedBadges.newToYou}
        onToggle={() => toggleSmartFilter("newToYou")}
        variant="navy"
      />

      <SmartFilterChip
        label="Strong applicant"
        count={smartFilterCounts.strongApplicant}
        active={filters.strongApplicant}
        showBadge={!dismissedBadges.strongApplicant}
        onToggle={() => toggleSmartFilter("strongApplicant")}
        variant="navy"
      />

      {showCompanyFilter ? (
        <SmartFilterChip
          label="Jobs at SEEK"
          count={smartFilterCounts.jobsAtSeek}
          active={filters.jobsAtSeek}
          showBadge={!dismissedBadges.jobsAtSeek}
          onToggle={() => toggleSmartFilter("jobsAtSeek")}
          variant="navy"
        />
      ) : null}
    </>
  )

  const sortPill = (
    <SortFilterPill
      sort={filters.sort}
      onSortChange={(sort) => updateFilters({ sort })}
      variant="navy"
      iconOnly
      menuAlign="end"
    />
  )

  // Default (expanded band): all pills wrap onto multiple lines
  if (!inline) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {smartChips}
        {standardPills}
        {sortPill}
      </div>
    )
  }

  // Compact sticky row (Figma 4199:26005 / 4199:25286):
  // always [New to you] [Strong applicant] [More (+count when applied)] [Sort]
  const appliedCount = countModalFilters(filters)

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto hide-scrollbar filter-scroll-fade-right"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {smartChips}
      <FiltersEntryControl
        appliedCount={appliedCount}
        onClick={onExpand}
        shape="pill"
        label="More"
      />
      {sortPill}
    </div>
  )
}
