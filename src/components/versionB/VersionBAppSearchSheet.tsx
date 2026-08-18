import { useEffect, useMemo, useRef } from "react"
import { IconClose, IconLocation, IconSearch } from "@/components/braid/icons"
import {
  ListingTimeFilterContent,
  PayFilterContent,
  WorkTypeFilterContent,
  getListingTimeAppliedLabel,
  getPayAppliedLabel,
  getWorkTypeAppliedLabel,
} from "@/src/components/FilterBar/filterControls"
import { FilterPill } from "@/src/components/FilterBar/FilterPill"
import { FilterSurfaceButton } from "@/src/components/motion/FilterSurfaceButton"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import { LAST_SEARCH, SAVED_SEARCHES, type SavedSearchItem } from "@/src/data/savedSearches"
import { normalizeSearchQuery } from "@/src/hooks/searchQuery"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { getFilteredJobs } from "@/src/hooks/useJobFilters"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import { cn } from "@/lib/utils"

interface VersionBAppSearchSheetProps {
  open: boolean
  onClose: () => void
  filterState: UseJobFiltersReturn
}

const RECENT_SEARCHES: SavedSearchItem[] = [LAST_SEARCH, ...SAVED_SEARCHES]

const navyChipTheme = {
  rounded: "rounded-full",
  activeBg: "bg-[#2455C9]",
  inactiveBorder: "border-2 border-white/50",
  inactiveBg: "bg-transparent",
  textActive: "text-white focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
  textInactive: "text-white hover:bg-white/5 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
} as const

function IconClock({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function RecentSearchItem({
  item,
  onSelect,
}: {
  item: SavedSearchItem
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl py-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      <span className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-lg bg-white/[0.08] p-2">
        <IconClock className="text-white" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-white">{item.title}</span>
        {item.filtersSummary ? (
          <span className="mt-1 block truncate text-xs text-[#B6C7E0]">{item.filtersSummary}</span>
        ) : null}
      </span>
      {item.newCount > 0 ? (
        <span className="shrink-0 rounded-lg bg-[#E2F7F1] px-3 py-2 text-xs font-medium text-[#12784F]">
          {item.newCount} new
        </span>
      ) : null}
    </button>
  )
}

/** Version B app search — Figma board layout, contained in phone frame */
export function VersionBAppSearchSheet({ open, onClose, filterState }: VersionBAppSearchSheetProps) {
  const {
    draftSearch,
    search,
    filters,
    updateDraftSearch,
    submitSearch,
    applyFilters,
    toggleSmartFilter,
  } = filterState

  const keywordRef = useRef<HTMLInputElement>(null)

  const previewCount = useMemo(() => {
    const query = normalizeSearchQuery(draftSearch, search)
    return getFilteredJobs(filters, query).length
  }, [draftSearch, search, filters])

  const popoverProps = {
    filters,
    search: draftSearch,
    onApplyFilters: applyFilters,
    showFooter: false,
    applyOnChange: true,
  }

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => keywordRef.current?.focus())
    return () => cancelAnimationFrame(frame)
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
    submitSearch()
    onClose()
  }

  const applyRecentSearch = (item: SavedSearchItem) => {
    updateDraftSearch({ keywords: item.title })
    submitSearch()
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="absolute inset-0 z-[100] flex flex-col bg-[#2E3849] overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label="Search jobs"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Close search"
      >
        <IconClose className="h-6 w-6" />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-28 pt-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="flex h-12 items-center gap-3 rounded-xl bg-white px-4">
              <IconSearch className="h-6 w-6 shrink-0 text-[#5A6881]" aria-hidden />
              <input
                ref={keywordRef}
                type="text"
                value={draftSearch.keywords}
                onChange={(e) => updateDraftSearch({ keywords: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSeek()
                }}
                placeholder="Job title, keywords or company"
                className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                aria-label="Keywords"
              />
              <SearchFieldClearButton
                visible={draftSearch.keywords.length > 0}
                onClear={() => updateDraftSearch({ keywords: "" })}
                label="Clear keywords"
              />
            </label>

            <label className="flex h-12 items-center gap-3 rounded-xl bg-white px-4">
              <IconLocation className="h-6 w-6 shrink-0 text-[#5A6881]" aria-hidden />
              <input
                type="text"
                value={draftSearch.location}
                onChange={(e) => updateDraftSearch({ location: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSeek()
                }}
                placeholder="Enter city, suburb or region"
                className="search-input-no-clear min-w-0 flex-1 bg-transparent text-base text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                aria-label="Location"
              />
              <SearchFieldClearButton
                visible={draftSearch.location.length > 0}
                onClear={() => updateDraftSearch({ location: "" })}
                label="Clear location"
              />
            </label>

            <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto hide-scrollbar pt-1">
              <FilterSurfaceButton
                role="switch"
                aria-checked={filters.newToYou}
                onClick={() => toggleSmartFilter("newToYou")}
                active={filters.newToYou}
                theme={navyChipTheme}
                className="h-10 shrink-0 px-3 text-base"
              >
                <span className="whitespace-nowrap">New to you</span>
              </FilterSurfaceButton>
              <FilterPill
                label="Salary"
                appliedLabel={getPayAppliedLabel(filters)}
                applied={!!getPayAppliedLabel(filters)}
                popoverTitle="Pay"
                popoverWidth={400}
                variant="compact"
                {...popoverProps}
              >
                <PayFilterContent variant="popover" />
              </FilterPill>
              <FilterPill
                label="Work type"
                appliedLabel={getWorkTypeAppliedLabel(filters)}
                applied={!!getWorkTypeAppliedLabel(filters)}
                popoverTitle="Work type"
                variant="compact"
                {...popoverProps}
              >
                <WorkTypeFilterContent />
              </FilterPill>
              <FilterPill
                label="Listed"
                appliedLabel={getListingTimeAppliedLabel(filters, true)}
                applied={!!getListingTimeAppliedLabel(filters, true)}
                popoverTitle="Listing time"
                variant="compact"
                {...popoverProps}
              >
                <ListingTimeFilterContent />
              </FilterPill>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-white">Recent searches</p>
            <div className="flex flex-col">
              {RECENT_SEARCHES.map((item) => (
                <RecentSearchItem
                  key={item.id}
                  item={item}
                  onSelect={() => applyRecentSearch(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-[#2E3849] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
        <button
          type="button"
          onClick={handleSeek}
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-lg px-4",
            "text-base font-semibold text-white hover:bg-[#C90268]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
          )}
          style={{ backgroundColor: VERSION_B_TOKENS.seekPink }}
        >
          SEEK {previewCount.toLocaleString("en-AU")} {previewCount === 1 ? "job" : "jobs"}
        </button>
      </div>
    </div>
  )
}
