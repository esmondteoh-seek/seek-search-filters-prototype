import { useEffect, useMemo, useRef } from "react"
import { createPortal } from "react-dom"
import { IconChevronRight, IconClose, IconHeart, IconLocation, IconSearch } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { LAST_SEARCH, SAVED_SEARCHES, type SavedSearchItem } from "@/src/data/savedSearches"
import { LocationRadiusDropdown } from "@/src/components/FilterBar/LocationRadiusDropdown"
import { StandardFiltersRow } from "@/src/components/FilterBar/StandardFiltersRow"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import { getFilteredJobs } from "@/src/hooks/useJobFilters"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { normalizeSearchQuery } from "@/src/hooks/searchQuery"

interface MobileSearchSheetProps {
  open: boolean
  onClose: () => void
  filterState: UseJobFiltersReturn
  /** Distance/radius beside location — hidden in delivery prototypes */
  showLocationRadius?: boolean
  /** Pink brand SEEK button — delivery prototypes */
  brandSeekButton?: boolean
  /** Override default submit (e.g. Future Vision multi-location parsing) */
  onSubmit?: () => void
}

function SearchListItem({
  item,
  icon,
  onSelect,
}: {
  item: SavedSearchItem
  icon: React.ReactNode
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl py-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      <span className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-lg bg-white/[0.08] p-2">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-white">{item.title}</span>
        {item.filtersSummary ? (
          <span className="mt-1 block truncate text-xs text-[#B6C7E0]">{item.filtersSummary}</span>
        ) : null}
      </span>
      {item.newCount > 0 && (
        <span className="shrink-0 rounded-lg bg-[#E2F7F1] px-3 py-2 text-xs font-medium text-[#12784F]">
          {item.newCount} new
        </span>
      )}
    </button>
  )
}

/** Full-screen mobile search — Figma node 4128:21899 */
export function MobileSearchSheet({
  open,
  onClose,
  filterState,
  showLocationRadius = true,
  brandSeekButton = false,
  onSubmit,
}: MobileSearchSheetProps) {
  const {
    draftSearch,
    search,
    filters,
    updateDraftSearch,
    submitSearch,
    clearAllFilters,
  } = filterState

  const keywordRef = useRef<HTMLInputElement>(null)

  const previewCount = useMemo(() => {
    const query = normalizeSearchQuery(draftSearch, search)
    return getFilteredJobs(filters, query).length
  }, [draftSearch, search, filters])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const frame = requestAnimationFrame(() => keywordRef.current?.focus())
    return () => {
      document.body.style.overflow = ""
      cancelAnimationFrame(frame)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  const handleSeek = () => {
    if (onSubmit) {
      onSubmit()
    } else {
      submitSearch()
    }
    onClose()
  }

  const applySavedSearch = (item: SavedSearchItem) => {
    updateDraftSearch({ keywords: item.title })
    submitSearch()
    onClose()
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#2E3849]"
      role="dialog"
      aria-modal="true"
      aria-label="Search jobs"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Close search"
      >
        <IconClose className="h-6 w-6" />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label className="flex h-12 items-center gap-3 rounded-lg bg-white px-4">
              <IconSearch className="h-6 w-6 shrink-0 text-[#5A6881]" aria-hidden />
              <input
                ref={keywordRef}
                type="text"
                value={draftSearch.keywords}
                onChange={(e) => updateDraftSearch({ keywords: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSeek()
                }}
                placeholder="Start your search here"
                className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                aria-label="Keywords"
              />
              <SearchFieldClearButton
                visible={draftSearch.keywords.length > 0}
                onClear={() => updateDraftSearch({ keywords: "" })}
                label="Clear keywords"
              />
            </label>

            <div className="flex gap-2">
              <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg bg-white px-4">
                <IconLocation className="h-6 w-6 shrink-0 text-[#5A6881]" aria-hidden />
                <input
                  type="text"
                  value={draftSearch.location}
                  onChange={(e) => updateDraftSearch({ location: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSeek()
                  }}
                  placeholder="Location"
                  className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                  aria-label="Location"
                />
                <SearchFieldClearButton
                  visible={draftSearch.location.length > 0}
                  onClear={() => updateDraftSearch({ location: "" })}
                  label="Clear location"
                />
              </label>
              {showLocationRadius ? (
                <LocationRadiusDropdown filterState={filterState} className="w-[104px]" />
              ) : null}
            </div>

            <StandardFiltersRow filterState={filterState} variant="compact" className="-mx-4 px-4" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-white">Last search</p>
            <SearchListItem
              item={LAST_SEARCH}
              icon={<IconSearch className="h-6 w-6 text-white" aria-hidden />}
              onSelect={() => applySavedSearch(LAST_SEARCH)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white">Saved searches</p>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                See all ({SAVED_SEARCHES.length + 3})
                <IconChevronRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col">
              {SAVED_SEARCHES.map((item) => (
                <SearchListItem
                  key={item.id}
                  item={item}
                  icon={<IconHeart className="h-6 w-6 text-white" aria-hidden />}
                  onSelect={() => applySavedSearch(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex gap-3 border-t border-white/10 bg-[#2E3849] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
        <button
          type="button"
          onClick={() => clearAllFilters()}
          className={cn(
            "flex h-12 shrink-0 items-center justify-center rounded-lg border-2 border-white px-4",
            "text-base font-semibold text-white hover:bg-white/5",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={handleSeek}
          className={cn(
            "flex h-12 min-w-0 flex-1 items-center justify-center rounded-lg px-4",
            "text-base font-semibold text-white",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
            brandSeekButton
              ? "bg-[#E60278] hover:bg-[#C90268]"
              : "bg-[#1C2330] hover:bg-[#0E131B]",
          )}
        >
          SEEK {previewCount.toLocaleString("en-AU")} {previewCount === 1 ? "job" : "jobs"}
        </button>
      </div>
    </div>,
    document.body,
  )
}
