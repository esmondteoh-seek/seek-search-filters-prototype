import { FilterPill } from "@/src/components/FilterBar/FilterPill"
import { DistanceFilterContent, getDistanceDisplayLabel } from "@/src/components/FilterBar/filterControls"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"

interface LocationRadiusDropdownProps {
  filterState: UseJobFiltersReturn
  className?: string
  /** Show when Future Vision has locations but search.location is empty (multi-location) */
  forceVisible?: boolean
}

/** Location radius beside the Where search field — white search-bar style (Figma 4166) */
export function LocationRadiusDropdown({
  filterState,
  className,
  forceVisible = false,
}: LocationRadiusDropdownProps) {
  const { filters, hasLocation, applyFilters, search } = filterState

  if (!hasLocation && !forceVisible) return null

  return (
    <FilterPill
      label="50 km"
      appliedLabel={getDistanceDisplayLabel(filters.distanceKm)}
      applied
      alwaysShowChevron
      popoverTitle="Distance"
      popoverWidth={360}
      variant="search"
      className={cn("w-[104px] shrink-0 rounded-xl", className)}
      filters={filters}
      search={search}
      onApplyFilters={applyFilters}
    >
      <DistanceFilterContent />
    </FilterPill>
  )
}
