import { IconSearch } from "@/components/braid/icons"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import { FutureVisionLocationField } from "@/src/components/futureVision/FutureVisionLocationField"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import {
  formatFutureVisionCompactPill,
  type FutureVisionLocationChrome,
} from "@/src/data/futureVisionPresets"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import { cn } from "@/lib/utils"

interface FutureVisionSearchFormProps {
  filterState: UseJobFiltersReturn
  compact?: boolean
  onOpenSearch?: () => void
  onSubmit?: () => void
  locationChrome?: FutureVisionLocationChrome
}

/** Future Vision search — location summary reflects 1 vs N locations */
export function FutureVisionSearchForm({
  filterState,
  compact = false,
  onOpenSearch,
  onSubmit,
  locationChrome = "multi-pills",
}: FutureVisionSearchFormProps) {
  const { draftSearch, updateDraftSearch, search } = filterState
  const { locations } = useFutureVisionLocations()
  const pillLabel = formatFutureVisionCompactPill(search.keywords, locations)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit?.()
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onOpenSearch}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-full bg-white px-3 text-left md:w-[min(480px,100%)] md:shrink-0",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
        )}
        style={{ ["--tw-ring-offset-color" as string]: VERSION_B_TOKENS.band }}
        aria-label={`Search: ${pillLabel}`}
      >
        <IconSearch className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{pillLabel}</span>
      </button>
    )
  }

  return (
    <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
      <label className="flex h-12 min-w-0 flex-[1.6] items-center gap-3 rounded-xl bg-white px-4">
        <IconSearch className="h-5 w-5 shrink-0 text-[#5A6881]" aria-hidden />
        <input
          type="text"
          value={draftSearch.keywords}
          onChange={(e) => updateDraftSearch({ keywords: e.target.value })}
          onKeyDown={handleKeyDown}
          className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none"
          aria-label="Keywords"
        />
        <SearchFieldClearButton
          visible={draftSearch.keywords.length > 0}
          onClear={() => updateDraftSearch({ keywords: "" })}
          label="Clear keywords"
        />
      </label>

      <div className="relative w-[min(353px,32vw)] shrink-0">
        <FutureVisionLocationField
          onSubmit={onSubmit}
          className="min-w-0 flex-1"
          withFieldChrome
          pillPlacement="dropdown"
          focusRingOffset="navy"
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="h-12 shrink-0 rounded-xl px-8 text-base font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        style={{
          backgroundColor: VERSION_B_TOKENS.seekPink,
          ["--tw-ring-offset-color" as string]: VERSION_B_TOKENS.band,
        }}
      >
        SEEK
      </button>
    </div>
  )
}

export function FutureVisionMobileSearchPill({
  label,
  onOpen,
}: {
  label: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-full bg-white px-3 text-left",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
      )}
      style={{ ["--tw-ring-offset-color" as string]: VERSION_B_TOKENS.band }}
      aria-label={`Search: ${label}`}
    >
      <IconSearch className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-sm text-[#2E3849]">{label}</span>
    </button>
  )
}
