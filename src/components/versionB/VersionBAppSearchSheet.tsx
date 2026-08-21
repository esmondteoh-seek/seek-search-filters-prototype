import { useEffect, useMemo, useRef } from "react"
import { IconChevronRight, IconClose, IconHeart, IconSearch } from "@/components/braid/icons"
import { SearchFieldClearButton } from "@/src/components/shared/SearchFieldClearButton"
import { VersionBFixedFilterPills } from "@/src/components/versionB/VersionBFixedFilterPills"
import { VersionBLocationField } from "@/src/components/versionB/VersionBLocationField"
import { LAST_SEARCH, SAVED_SEARCHES, type SavedSearchItem } from "@/src/data/savedSearches"
import { getVersionBScaledJobCount } from "@/src/data/versionBPresets"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { normalizeSearchQuery } from "@/src/hooks/searchQuery"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import { useMountTransition } from "@/src/hooks/useMountTransition"
import { cn } from "@/lib/utils"

interface VersionBAppSearchSheetProps {
  open: boolean
  onClose: () => void
  filterState: UseJobFiltersReturn
  previewState: VersionBPreviewState
}

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

function SearchHistoryItem({
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
      {item.newCount > 0 ? (
        <span className="shrink-0 rounded-lg bg-[#E2F7F1] px-3 py-2 text-xs font-medium text-[#12784F]">
          {item.newCount} new
        </span>
      ) : null}
    </button>
  )
}

/** Version B app search — Figma Search Bar Improvements, contained in phone frame */
export function VersionBAppSearchSheet({
  open,
  onClose,
  filterState,
  previewState,
}: VersionBAppSearchSheetProps) {
  const {
    draftSearch,
    search,
    filters,
    updateDraftSearch,
    submitSearch,
    clearAllFilters,
  } = filterState

  const keywordRef = useRef<HTMLInputElement>(null)
  const { mounted, visible, durationMs } = useMountTransition(open, 280)

  const previewCount = useMemo(() => {
    const query = normalizeSearchQuery(draftSearch, search)
    return getVersionBScaledJobCount("app", previewState, filters, query)
  }, [draftSearch, search, filters, previewState])

  useEffect(() => {
    if (!open || !mounted) return
    const frame = requestAnimationFrame(() => keywordRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open, mounted])

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

  const handleClearAll = () => {
    updateDraftSearch({ keywords: "", location: "" })
    clearAllFilters()
  }

  const applySavedSearch = (item: SavedSearchItem) => {
    updateDraftSearch({ keywords: item.title })
    submitSearch()
    onClose()
  }

  if (!mounted) return null

  return (
    <div
      className={cn(
        "absolute inset-0 z-[100] flex flex-col overscroll-contain transition-transform",
        visible ? "translate-x-0" : "translate-x-full",
      )}
      style={{
        transitionDuration: `${durationMs}ms`,
        backgroundColor: VERSION_B_TOKENS.band,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search jobs"
      aria-hidden={!visible}
    >
      <div
        className="pointer-events-none absolute right-0 top-[102px] size-[168px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(230,2,120,0.35) 0%, rgba(230,2,120,0) 70%)",
        }}
        aria-hidden
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close search"
        >
          <IconClose className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-sm text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Clear all
        </button>
      </header>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label className="flex h-12 items-center gap-4 rounded-lg bg-white px-4">
              <IconSearch className="h-6 w-6 shrink-0 text-[#5A6881]" aria-hidden />
              <input
                ref={keywordRef}
                type="text"
                value={draftSearch.keywords}
                onChange={(e) => updateDraftSearch({ keywords: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSeek()
                }}
                placeholder="Describe what you're looking for"
                className="search-input-no-clear min-w-0 flex-1 bg-transparent text-sm text-[#2E3849] outline-none placeholder:text-[#5A6881]"
                aria-label="Keywords"
              />
              <SearchFieldClearButton
                visible={draftSearch.keywords.length > 0}
                onClear={() => updateDraftSearch({ keywords: "" })}
                label="Clear keywords"
              />
            </label>

            <VersionBLocationField
              value={draftSearch.location}
              onChange={(location) => updateDraftSearch({ location })}
              onSubmit={handleSeek}
              placeholder="Enter suburb, city, or region"
              focusRingOffset="overlay"
              rounded="lg"
              size="compact"
              iconClassName="h-6 w-6"
            />

            <VersionBFixedFilterPills
              filterState={filterState}
              variant="compact"
              presentation="sheet"
              searchOverride={draftSearch}
              className="flex flex-wrap items-center gap-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-white">Last search</p>
            <SearchHistoryItem
              item={LAST_SEARCH}
              icon={<IconClock className="text-white" />}
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
                <SearchHistoryItem
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

      <div
        className="absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4"
        style={{
          background: `linear-gradient(to top, ${VERSION_B_TOKENS.band} 60%, transparent)`,
        }}
      >
        <button
          type="button"
          onClick={handleSeek}
          className={cn(
            "flex h-12 w-full items-center justify-center rounded-lg px-4",
            "text-base font-semibold text-white hover:bg-[#C90268]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
          )}
          style={{
            backgroundColor: VERSION_B_TOKENS.seekPink,
            ["--tw-ring-offset-color" as string]: VERSION_B_TOKENS.band,
          }}
        >
          SEEK {previewCount.toLocaleString("en-AU")} {previewCount === 1 ? "job" : "jobs"}
        </button>
      </div>
    </div>
  )
}
