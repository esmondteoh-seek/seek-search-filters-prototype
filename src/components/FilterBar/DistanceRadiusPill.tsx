import { FilterPill } from "@/src/components/FilterBar/FilterPill"
import { DistanceFilterContent, getDistanceDisplayLabel } from "@/src/components/FilterBar/filterControls"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

interface DistanceRadiusPillProps {
  filterState: UseJobFiltersReturn
  /** bar = white personalised row (Concept 1); compact = navy unified row */
  variant?: "bar" | "compact"
}

/** Location radius filter — shared between Concept 1 and Concept 2 */
export function DistanceRadiusPill({ filterState, variant = "bar" }: DistanceRadiusPillProps) {
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
      variant={variant}
      filters={filters}
      search={search}
      onApplyFilters={applyFilters}
    >
      <DistanceFilterContent />
    </FilterPill>
  )
}
