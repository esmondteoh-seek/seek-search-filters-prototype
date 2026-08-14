import type { ReactNode } from "react"
import { IconSearch } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { StandardFiltersRow } from "@/src/components/FilterBar/StandardFiltersRow"
import { SaveSearchButton } from "@/src/components/shared/searchBand/SaveSearchButton"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

interface SearchBandCompactRowProps {
  filterState: UseJobFiltersReturn
  searchPillLabel: string
  onOpenSearch?: () => void
  /** Concept-specific filters for landing row; defaults to standard filter pills (Concept 1) */
  desktopFilters?: ReactNode
  mobileFilters?: ReactNode
  /** Save-search heart — hidden in the vSAB concept (Figma 4166:28838) */
  showSaveSearch?: boolean
  /** Append the round sort button to the default filter rows (Concept 1) */
  showSort?: boolean
}

/** Compact SERP row — combined search pill + save + inline filters */
export function SearchBandCompactRow({
  filterState,
  searchPillLabel,
  onOpenSearch,
  desktopFilters,
  mobileFilters,
  showSaveSearch = true,
  showSort = false,
}: SearchBandCompactRowProps) {
  const { isSearchSaved, toggleSearchSaved } = filterState

  const defaultDesktopFilters = (
    <StandardFiltersRow
      filterState={filterState}
      variant="navy"
      inline
      compactLabels
      showSort={showSort}
      className="min-w-0 flex-1"
    />
  )

  const defaultMobileFilters = (
    <StandardFiltersRow
      filterState={filterState}
      variant="compact"
      inline
      compactLabels
      showSort={showSort}
      className="max-w-[45%] shrink-0"
    />
  )

  return (
    <>
      <div className="hidden min-w-0 w-full items-center gap-3 md:flex">
        <button
          type="button"
          onClick={onOpenSearch}
          className={cn(
            "flex h-10 w-[min(480px,100%)] shrink-0 items-center gap-2 rounded-full bg-white px-3 text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
          )}
          aria-label={`Search: ${searchPillLabel}`}
        >
          <IconSearch className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{searchPillLabel}</span>
        </button>

        {showSaveSearch && (
          <SaveSearchButton
            saved={isSearchSaved}
            onToggle={toggleSearchSaved}
            variant="compact-desktop"
          />
        )}

        {desktopFilters ?? defaultDesktopFilters}
      </div>

      <div className="flex min-w-0 w-full items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={onOpenSearch}
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
          )}
          aria-label={`Search: ${searchPillLabel}`}
        >
          <IconSearch className="h-[18px] w-[18px] shrink-0 text-[#5A6881]" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{searchPillLabel}</span>
        </button>

        {showSaveSearch && (
          <SaveSearchButton
            saved={isSearchSaved}
            onToggle={toggleSearchSaved}
            variant="compact-mobile"
          />
        )}

        {mobileFilters ?? defaultMobileFilters}
      </div>
    </>
  )
}
