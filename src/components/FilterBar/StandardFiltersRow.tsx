import type { FilterState, UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"
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
} from "./filterControls"
import { FilterPill } from "./FilterPill"
import { SortFilterPill } from "./SortFilterPill"

interface StandardFiltersRowProps {
  filterState: UseJobFiltersReturn
  variant?: "navy" | "compact"
  /** Sticky SERP row — filters sit inline beside search, no wrap */
  inline?: boolean
  /** Shorter pill labels (Pay, Type, …) for compact sticky bar */
  compactLabels?: boolean
  /** Append the round icon-only sort button after the pills (Concept 1 — Figma 4166:27330) */
  showSort?: boolean
  /** Wrap pills onto multiple lines instead of horizontal scroll + fade */
  wrap?: boolean
  /** Show SEEK preview footer in filter dropdowns (default true) */
  showFooter?: boolean
  /** Apply each filter change immediately (Version B) */
  applyOnChange?: boolean
  /** Close popover after each apply-on-change selection */
  closeOnApply?: boolean
  /** Override apply handler (e.g. Version B blank-SA clearing) */
  onApplyFilters?: (patch: Partial<FilterState>) => void
  className?: string
}

const filterPopoverProps = (filterState: UseJobFiltersReturn) => ({
  filters: filterState.filters,
  search: filterState.search,
  onApplyFilters: filterState.applyFilters,
})

/** Standard filters below search inputs — inside the navy search band per Figma SERP C */
export function StandardFiltersRow({
  filterState,
  variant = "navy",
  inline = false,
  compactLabels = false,
  showSort = false,
  wrap = false,
  showFooter = true,
  applyOnChange = false,
  closeOnApply = false,
  onApplyFilters,
  className,
}: StandardFiltersRowProps) {
  const { filters, clearFilter, updateFilters } = filterState
  const popoverProps = {
    ...filterPopoverProps(filterState),
    onApplyFilters: onApplyFilters ?? filterState.applyFilters,
    showFooter,
    applyOnChange,
    closeOnApply,
  }
  const isMobile = variant === "compact"
  const shortLabels = compactLabels || isMobile

  const payApplied = getPayAppliedLabel(filters)
  const classificationApplied = getClassificationAppliedLabel(filters)
  const workTypeApplied = getWorkTypeAppliedLabel(filters)
  const remoteApplied = getRemoteAppliedLabel(filters)
  const listingTimeApplied = getListingTimeAppliedLabel(filters)

  const classificationLabel =
    shortLabels && !classificationApplied ? "Class…" : "Classification"

  return (
    <div className={cn(className, inline && "min-w-0 flex-1")}>
      <div
        className={cn(
          wrap
            ? "flex flex-wrap items-center gap-2"
            : inline
              ? "flex min-w-0 flex-1 items-center gap-3 overflow-x-auto hide-scrollbar filter-scroll-fade-right"
              : isMobile
                ? "flex gap-2 overflow-x-auto hide-scrollbar pb-0.5 filter-scroll-fade-right"
                : "flex flex-wrap items-center gap-3",
        )}
        style={!wrap && (inline || isMobile) ? { WebkitOverflowScrolling: "touch" } : undefined}
      >
        <FilterPill
          label="Pay"
          appliedLabel={payApplied}
          applied={!!payApplied}
          onClear={() => clearFilter("payMin")}
          popoverTitle="Pay"
          popoverWidth={400}
          variant={variant}
          {...popoverProps}
        >
          <PayFilterContent variant="popover" />
        </FilterPill>

        <FilterPill
          label={classificationLabel}
          appliedLabel={classificationApplied}
          applied={!!classificationApplied}
          onClear={() => clearFilter("classifications")}
          popoverTitle="Classification"
          popoverWidth={360}
          variant={variant}
          {...popoverProps}
          closeOnApply={false}
        >
          <ClassificationFilterContent variant="popover" />
        </FilterPill>

        <FilterPill
          label={shortLabels ? "Type" : "Work type"}
          appliedLabel={workTypeApplied}
          applied={!!workTypeApplied}
          onClear={() => clearFilter("workTypes")}
          popoverTitle="Work type"
          variant={variant}
          closeOnApply={closeOnApply}
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
          variant={variant}
          closeOnApply={closeOnApply}
          {...popoverProps}
        >
          <RemoteFilterContent />
        </FilterPill>

        <FilterPill
          label={shortLabels ? "Listing time" : isMobile ? "Listing…" : "Listing time"}
          appliedLabel={listingTimeApplied}
          applied={!!listingTimeApplied}
          onClear={() => clearFilter("listingTime")}
          popoverTitle="Listing time"
          variant={variant}
          closeOnApply={closeOnApply}
          {...popoverProps}
        >
          <ListingTimeFilterContent />
        </FilterPill>

        {showSort ? (
          <SortFilterPill
            sort={filters.sort}
            onSortChange={(sort) => updateFilters({ sort })}
            variant="navy"
            iconOnly
            compact={isMobile}
            menuAlign="end"
          />
        ) : null}
      </div>
    </div>
  )
}
