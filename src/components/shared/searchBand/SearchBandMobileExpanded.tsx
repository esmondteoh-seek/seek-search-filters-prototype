import { IconSearch } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { SaveSearchButton } from "@/src/components/shared/searchBand/SaveSearchButton"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"

interface SearchBandMobileExpandedProps {
  filterState: UseJobFiltersReturn
  expanded: boolean
  searchLabel: string
  onOpenMobileSearch: () => void
}

export function SearchBandMobileExpanded({
  filterState,
  expanded,
  searchLabel,
  onOpenMobileSearch,
}: SearchBandMobileExpandedProps) {
  const { isSearchSaved, toggleSearchSaved } = filterState

  if (!expanded) return null

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSearch}
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
          )}
          aria-label={`Search: ${searchLabel}`}
        >
          <IconSearch className="h-[18px] w-[18px] shrink-0 text-[#5A6881]" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{searchLabel}</span>
        </button>
        <SaveSearchButton
          saved={isSearchSaved}
          onToggle={toggleSearchSaved}
          variant="expanded-mobile"
        />
      </div>
    </div>
  )
}
