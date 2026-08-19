import { forwardRef, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import {
  DEFAULT_FILTERS,
  areFilterStatesEqual,
  diffFilterState,
  getFilteredJobs,
  type FilterState,
} from "@/src/hooks/useJobFilters"
import { FilterSurfaceLayers, filterPillThemes } from "@/src/components/motion/FilterSurfaceButton"
import { FilterDraftProvider } from "./FilterDraftContext"
import { FilterPopover } from "./FilterPopover"
import { FilterPillSheet } from "./FilterPillSheet"
import { FilterPopoverFooter } from "./FilterPopoverFooter"

interface FilterPillProps {
  label: string
  appliedLabel?: string
  applied?: boolean
  onClear?: () => void
  children: ReactNode
  popoverTitle: string
  popoverWidth?: number
  className?: string
  measureOnly?: boolean
  /** navy = pills in search band; bar = personalised row on white; search = white field beside Where */
  variant?: "navy" | "bar" | "compact" | "search"
  /**
   * @deprecated Chevron always stays on applied pills — click opens the dropdown.
   * Kept for call-site compatibility (e.g. distance radius).
   */
  alwaysShowChevron?: boolean
  filters: FilterState
  search: SearchQuery
  /** Merge only the fields this pill changed onto the live filter state */
  onApplyFilters: (patch: Partial<FilterState>) => void
  /** Optional transform for Apply footer job count (Future Vision marketplace scale) */
  mapJobCount?: (draft: FilterState, search: SearchQuery) => number
  /** Show SEEK preview footer when draft changes (default true) */
  showFooter?: boolean
  /** Apply each filter change immediately (Version B app search sheet) */
  applyOnChange?: boolean
  /** Close popover/sheet after each apply-on-change selection */
  closeOnApply?: boolean
  /** Popover width matches anchor element width */
  matchAnchorWidth?: boolean
  /** popover = floating panel; sheet = app bottom sheet inside phone frame */
  presentation?: "popover" | "sheet"
  /** Classification sheet — Clear all + Done footer */
  sheetShowClearAll?: boolean
  /** Taller sheet body (classification list) */
  sheetTall?: boolean
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(value)
      else if (ref && typeof ref === "object") (ref as React.MutableRefObject<T | null>).current = value
    })
  }
}

export const FilterPill = forwardRef<HTMLButtonElement, FilterPillProps>(function FilterPill(
  {
    label,
    appliedLabel,
    applied = false,
    onClear: _onClear,
    children,
    popoverTitle,
    popoverWidth,
    className,
    measureOnly = false,
    variant = "bar",
    alwaysShowChevron: _alwaysShowChevron,
    filters,
    search,
    onApplyFilters,
    mapJobCount,
    showFooter = true,
    applyOnChange = false,
    closeOnApply = false,
    matchAnchorWidth = false,
    presentation = "popover",
    sheetShowClearAll = false,
    sheetTall = false,
  },
  forwardedRef,
) {
  void _onClear
  void _alwaysShowChevron
  const internalRef = useRef<HTMLButtonElement>(null)
  const buttonRef = mergeRefs(forwardedRef, internalRef)
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterState>(filters)
  const [baselineDraft, setBaselineDraft] = useState<FilterState>(filters)

  const displayText = applied && appliedLabel ? appliedLabel : label

  const hasDraftChanges = useMemo(
    () => !areFilterStatesEqual(draft, baselineDraft),
    [draft, baselineDraft],
  )

  const patchDraft = (patch: Partial<FilterState>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      if (applyOnChange) {
        onApplyFilters(patch)
        if (closeOnApply) {
          setBaselineDraft(next)
          setOpen(false)
        }
      }
      return next
    })
  }

  useEffect(() => {
    if (!applyOnChange || !open) return
    setDraft(filters)
    setBaselineDraft(filters)
  }, [applyOnChange, open, filters])

  const handleOpen = () => {
    if (measureOnly) return
    setDraft(filters)
    setBaselineDraft(filters)
    setOpen(true)
  }

  const commitDraft = () => {
    const patch = diffFilterState(baselineDraft, draft)
    if (Object.keys(patch).length > 0) onApplyFilters(patch)
  }

  // Closing without pressing Apply (switching pills, clicking outside, Esc)
  // Sheet mode commits only via Done; popover commits on close.
  const handleClose = () => {
    if (presentation === "sheet") {
      setDraft(filters)
      setBaselineDraft(filters)
    } else if (!applyOnChange) {
      commitDraft()
    }
    setOpen(false)
  }

  useEffect(() => {
    if (!open || presentation !== "sheet") return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, presentation])

  const filterContent = (
    <FilterDraftProvider draft={draft} patchDraft={patchDraft}>
      {children}
    </FilterDraftProvider>
  )

  const handleClearAll = () => {
    if (sheetShowClearAll) {
      setDraft((prev) => ({ ...prev, classifications: [] }))
      return
    }
    setDraft({ ...DEFAULT_FILTERS, sort: draft.sort })
  }

  const handleApply = () => {
    commitDraft()
    setOpen(false)
  }

  const previewCount = useMemo(
    () =>
      mapJobCount
        ? mapJobCount(draft, search)
        : getFilteredJobs(draft, search).length,
    [mapJobCount, draft, search],
  )

  const variantClasses = {
    navy: "h-10 rounded-full px-4 text-base",
    bar: "h-[41px] rounded-lg px-3 text-base",
    compact: "h-9 gap-1.5 rounded-full pl-4 pr-3 text-sm",
    search: cn(
      "h-12 justify-between rounded-lg bg-white px-4 text-base text-[#2E3849]",
      "hover:bg-[#F7F8FB]",
    ),
  }

  const usesMotionSurface = variant !== "search"
  const surfaceTheme =
    variant === "navy" || variant === "bar" || variant === "compact"
      ? filterPillThemes[variant]
      : null

  const pillActive = applied || (presentation === "sheet" && open)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => (open ? handleClose() : handleOpen())}
        className={cn(
          "relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden font-normal",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#051A49]",
          (variant === "bar" || variant === "search") && "focus-visible:ring-[#1E47A9] focus-visible:ring-offset-white",
          "active:scale-[0.98]",
          variantClasses[variant],
          usesMotionSurface && pillActive && "text-white",
          usesMotionSurface && !pillActive && variant === "bar" && "text-[#2E3849]",
          usesMotionSurface && !pillActive && variant !== "bar" && "text-white",
          presentation === "sheet" && variant === "compact" && !pillActive && "border-2 border-white/25",
          measureOnly && "pointer-events-none",
          className,
        )}
      >
        {usesMotionSurface && surfaceTheme ? (
          <FilterSurfaceLayers
            active={pillActive}
            theme={
              presentation === "sheet" && open && !applied
                ? {
                    ...surfaceTheme,
                    activeBg: "bg-[#2A60CD]",
                    inactiveBg: surfaceTheme.inactiveBg,
                    inactiveBorder: "border-transparent",
                  }
                : surfaceTheme
            }
          />
        ) : null}
        {variant === "search" ? (
          <>
            <span className="relative z-10 min-w-0 truncate whitespace-nowrap">{displayText}</span>
            <IconChevronDown
              className={cn(
                "relative z-10 h-[18px] w-[18px] shrink-0 text-[#5A6881] transition-transform duration-200 ease-out",
                open && "rotate-180",
              )}
            />
          </>
        ) : (
          <span className="relative z-10 inline-flex items-center gap-1.5">
            <span className="whitespace-nowrap">{displayText}</span>
            <IconChevronDown
              className={cn(
                "relative z-10 h-3 w-3 shrink-0 transition-transform duration-200 ease-out",
                open && "rotate-180",
              )}
            />
          </span>
        )}
      </button>

      {presentation === "sheet" ? (
        <FilterPillSheet
          open={open && !measureOnly}
          onClose={handleClose}
          title={popoverTitle}
          titleId={titleId}
          onDone={handleApply}
          showClearAll={sheetShowClearAll}
          onClearAll={sheetShowClearAll ? handleClearAll : undefined}
          tall={sheetTall}
        >
          {filterContent}
        </FilterPillSheet>
      ) : (
        <FilterPopover
          open={open && !measureOnly}
          onClose={handleClose}
          anchorRef={internalRef}
          title={popoverTitle}
          width={popoverWidth}
          matchAnchorWidth={matchAnchorWidth}
          footer={
            showFooter && hasDraftChanges ? (
              <FilterPopoverFooter
                jobCount={previewCount}
                onClearAll={handleClearAll}
                onApply={handleApply}
              />
            ) : undefined
          }
        >
          {filterContent}
        </FilterPopover>
      )}
    </>
  )
})
