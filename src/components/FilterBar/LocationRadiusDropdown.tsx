import { FilterPill } from "@/src/components/FilterBar/FilterPill"
import { DistanceFilterContent, getDistanceDisplayLabel } from "@/src/components/FilterBar/filterControls"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"

interface LocationRadiusDropdownProps {
  filterState: UseJobFiltersReturn
  className?: string
}

/** Location radius beside the Where search field — white search-bar style (Figma 4166) */
export function LocationRadiusDropdown({ filterState, className }: LocationRadiusDropdownProps) {
  const { filters, hasLocation, applyFilters, search } = filterState

  if (!hasLocation) return null

  return (
    <FilterPill
      label="50 km"
      appliedLabel={getDistanceDisplayLabel(filters.distanceKm)}
      applied
      alwaysShowChevron
      popoverTitle="Distance"
      popoverWidth={360}
      variant="search"
      className={cn("w-[120px] shrink-0", className)}
      filters={filters}
      search={search}
      onApplyFilters={applyFilters}
    >
      <DistanceFilterContent />
    </FilterPill>
  )
}
