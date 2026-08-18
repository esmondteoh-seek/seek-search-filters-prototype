import { IconLocation, IconSearch } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { LocationRadiusDropdown } from "@/src/components/FilterBar/LocationRadiusDropdown"
import { SaveSearchButton } from "@/src/components/shared/searchBand/SaveSearchButton"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { getFilteredJobs } from "@/src/hooks/useJobFilters"

interface SearchBandDesktopExpandedProps {
  filterState: UseJobFiltersReturn
  expanded: boolean
  locationPlaceholder?: string
  onKeyDown: (e: React.KeyboardEvent) => void
  onRestoreKeywordsIfEmpty: () => void
  onSubmitSearch: () => void
  /** Save-search heart — hidden in the vSAB concept (Figma 4166:28838) */
  showSaveSearch?: boolean
  /** Distance/radius beside location — hidden in delivery prototypes */
  showLocationRadius?: boolean
  /** Pink brand SEEK button — delivery prototypes (Figma Search---Strong-Applicant) */
  brandSeekButton?: boolean
}

export function SearchBandDesktopExpanded({
  filterState,
  expanded,
  locationPlaceholder,
  onKeyDown,
  onRestoreKeywordsIfEmpty,
  onSubmitSearch,
  showSaveSearch = true,
  showLocationRadius = true,
  brandSeekButton = false,
}: SearchBandDesktopExpandedProps) {
  const { draftSearch, updateDraftSearch, isSearchSaved, toggleSearchSaved, filters } = filterState

  const seekJobCount = getFilteredJobs(filters, draftSearch).length

  if (!expanded) return null

  return (
    <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
      <label
        className={cn(
          "flex h-12 min-w-0 flex-[1.6] items-center gap-3 bg-white px-4",
          brandSeekButton ? "rounded-xl" : "rounded-lg",
        )}
      >
        <IconSearch className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
        <input
          type="text"
          value={draftSearch.keywords}
          onChange={(e) => updateDraftSearch({ keywords: e.target.value })}
          onKeyDown={onKeyDown}
          onBlur={onRestoreKeywordsIfEmpty}
          className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none"
          aria-label="Keywords"
        />
        <SearchFieldClearButton
          visible={draftSearch.keywords.length > 0}
          onClear={() => updateDraftSearch({ keywords: "" })}
          label="Clear keywords"
        />
      </label>

      <div className="flex shrink-0 items-center gap-2">
        <label
          className={cn(
            "flex h-12 w-[min(353px,32vw)] items-center gap-3 bg-white px-4",
            brandSeekButton ? "rounded-xl" : "rounded-lg",
          )}
        >
          <IconLocation className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
          <input
            type="text"
            value={draftSearch.location}
            onChange={(e) => updateDraftSearch({ location: e.target.value })}
            onKeyDown={onKeyDown}
            placeholder={locationPlaceholder}
            className={cn(
              "search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none",
              locationPlaceholder && "placeholder:text-[#5A6881]",
            )}
            aria-label="Location"
          />
          <SearchFieldClearButton
            visible={draftSearch.location.length > 0}
            onClear={() => updateDraftSearch({ location: "" })}
            label="Clear location"
          />
        </label>
        {showLocationRadius ? <LocationRadiusDropdown filterState={filterState} /> : null}
      </div>

      <button
        type="button"
        onClick={onSubmitSearch}
        className={cn(
          "h-12 shrink-0 px-6 text-base font-semibold uppercase tracking-wide text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
          brandSeekButton ? "rounded-xl" : "rounded-lg",
          brandSeekButton
            ? "bg-[#E60278] hover:bg-[#C90268] focus-visible:ring-offset-[#0D1630]"
            : "bg-[#1C2330] hover:bg-[#0E131B] focus-visible:ring-offset-[#2E3849]",
        )}
      >
        SEEK {seekJobCount.toLocaleString()} {seekJobCount === 1 ? "job" : "jobs"}
      </button>

      {showSaveSearch && (
        <SaveSearchButton
          saved={isSearchSaved}
          onToggle={toggleSearchSaved}
          variant="expanded-desktop"
        />
      )}
    </div>
  )
}
