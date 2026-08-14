import { memo, useCallback, useEffect, useRef, useState } from "react"
import { createPortal, flushSync } from "react-dom"
import { Button, TextLink } from "@/components/braid"
import { Heading } from "@/components/braid"
import { Stack } from "@/components/braid"
import { IconClose, IconFilter } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { useMountTransition } from "@/src/hooks/useMountTransition"
import type { FilterState, SmartFilterCounts, SmartFilterKey, UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { DEFAULT_FILTERS, getFilteredJobs } from "@/src/hooks/useJobFilters"
import {
  ClassificationFilterContent,
  ListingTimeFilterContent,
  PayFilterContent,
  RemoteFilterContent,
  WorkTypeFilterContent,
} from "./filterControls"
import { SmartFilterChip } from "./SmartFilterChip"

interface AllFiltersSheetProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  search: { keywords: string; location: string }
  hasLocation: boolean
  showCompanyFilter: boolean
  onChange: UseJobFiltersReturn["updateFilters"]
  smartFilterCounts: SmartFilterCounts
  dismissedBadges: Record<SmartFilterKey, boolean>
  dismissSmartFilterBadge: (key: SmartFilterKey) => void
  title?: string
  showSmartFilters?: boolean
  onClearAll?: () => void
  /** sheet = full viewport; modal = centered; drawer = right panel (Figma 4166) */
  presentation?: "sheet" | "modal" | "drawer"
}

export function AllFiltersSheet({
  open,
  onClose,
  filters,
  search,
  hasLocation,
  showCompanyFilter,
  onChange,
  smartFilterCounts,
  dismissedBadges,
  dismissSmartFilterBadge,
  title = "All filters",
  showSmartFilters = true,
  onClearAll,
  presentation = "sheet",
}: AllFiltersSheetProps) {
  const [draft, setDraft] = useState(filters)
  const [draftDismissed, setDraftDismissed] = useState(dismissedBadges)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTopRef = useRef(0)
  const wasOpenRef = useRef(false)
  const isDrawer = presentation === "drawer"
  const drawerTransition = useMountTransition(isDrawer && open, 300)

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setDraft(filters)
      setDraftDismissed(dismissedBadges)
    }
    wasOpenRef.current = open
  }, [open, filters, dismissedBadges])

  useEffect(() => {
    const shouldLockScroll = isDrawer ? drawerTransition.mounted : open
    if (shouldLockScroll) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open, isDrawer, drawerTransition.mounted])

  useEffect(() => {
    const isActive = isDrawer ? drawerTransition.mounted : open
    if (!isActive) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, isDrawer, drawerTransition.mounted, onClose])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !isDrawer || !drawerTransition.mounted) return

    const handleScroll = () => {
      scrollTopRef.current = el.scrollTop
    }

    handleScroll()
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [isDrawer, drawerTransition.mounted, open])

  const patchDraft = useCallback((patch: Partial<FilterState>) => {
    const scrollTop = scrollRef.current?.scrollTop ?? scrollTopRef.current
    scrollTopRef.current = scrollTop

    flushSync(() => {
      setDraft((prev) => ({ ...prev, ...patch }))
    })

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollTop
    }
  }, [])

  if (isDrawer ? !drawerTransition.mounted : !open) return null

  const draftResultCount = getFilteredJobs(draft, search).length

  const handleSmartToggle = (key: SmartFilterKey) => {
    const next = !draft[key]
    if (!next) setDraftDismissed((prev) => ({ ...prev, [key]: true }))
    patchDraft({ [key]: next })
  }

  const handleClearAllDraft = () => {
    setDraft((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }))
    onClearAll?.()
  }

  const handleApply = () => {
    const nextDraft = { ...draft, jobsAtSeek: showCompanyFilter ? draft.jobsAtSeek : false }
    onChange(nextDraft)
    ;(["newToYou", "strongApplicant", "jobsAtSeek"] as SmartFilterKey[]).forEach((key) => {
      if (draftDismissed[key] && !dismissedBadges[key]) dismissSmartFilterBadge(key)
    })
    onClose()
  }

  const isModal = presentation === "modal"
  const filterVariant = isDrawer ? "drawer" : isModal ? "modal" : "sheet"

  const drawerFooter = (
    <DrawerActionFooterMemo
      jobCount={draftResultCount}
      showClearAll={Boolean(onClearAll)}
      onClearAll={handleClearAllDraft}
      onApply={handleApply}
    />
  )

  const panel = (
    <div
      className={cn(
        "flex flex-col bg-white",
        isDrawer &&
          "relative h-full w-full max-w-[678px] shrink-0 overflow-hidden px-4 pt-[26px] shadow-[-8px_0_24px_rgba(28,35,48,0.12)]",
        isDrawer &&
          (drawerTransition.visible
            ? "filter-drawer-panel-enter"
            : open
              ? "translate-x-full"
              : "filter-drawer-panel-exit"),
        isModal &&
          "max-h-[min(85vh,720px)] w-full max-w-[680px] overflow-hidden rounded-2xl shadow-[0px_0px_8px_rgba(28,35,48,0.08),0px_8px_16px_-4px_rgba(28,35,48,0.08)]",
        !isModal && !isDrawer && "h-full w-full",
      )}
      onClick={isModal ? (e) => e.stopPropagation() : undefined}
    >
      <header
        className={cn(
          "flex shrink-0 items-end justify-between",
          isDrawer ? "w-full pb-0" : "border-b border-[#EAECF1] px-6 py-4",
        )}
      >
        <Heading
          level="4"
          component="h2"
          weight={isDrawer ? "medium" : "strong"}
          className={cn(
            isDrawer && "text-2xl font-medium leading-[30px] text-black",
          )}
        >
          {title}
        </Heading>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "shrink-0 rounded-full text-[#2E3849] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]",
            isDrawer ? "p-0" : "p-1 text-[#5A6881]",
          )}
          aria-label="Close filters"
        >
          <IconClose className="h-6 w-6" />
        </button>
      </header>

      <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", isDrawer && "mt-[45px]")}>
        <div
          ref={isDrawer ? scrollRef : undefined}
          className={cn(
            "min-h-0 overflow-y-auto overscroll-contain",
            isDrawer ? "flex-1 w-full" : cn("py-6", !isModal && "px-6"),
          )}
          style={isDrawer ? { overflowAnchor: "none" } : undefined}
        >
          <Stack space={isDrawer ? "large" : isModal ? "gutter" : "xlarge"} className="w-full items-stretch">
            {showSmartFilters && (
              <FilterSection title="Smart filters" inset={isModal} showDivider={isDrawer}>
                <div className="flex flex-wrap gap-2">
                  <SmartFilterChip
                    label="New to you"
                    count={smartFilterCounts.newToYou}
                    active={draft.newToYou}
                    showBadge={!draftDismissed.newToYou}
                    onToggle={() => handleSmartToggle("newToYou")}
                  />
                  <SmartFilterChip
                    label="Strong applicant"
                    count={smartFilterCounts.strongApplicant}
                    active={draft.strongApplicant}
                    showBadge={!draftDismissed.strongApplicant}
                    onToggle={() => handleSmartToggle("strongApplicant")}
                  />
                  {showCompanyFilter && (
                    <SmartFilterChip
                      label="Jobs at SEEK"
                      count={smartFilterCounts.jobsAtSeek}
                      active={draft.jobsAtSeek}
                      showBadge={!draftDismissed.jobsAtSeek}
                      onToggle={() => handleSmartToggle("jobsAtSeek")}
                    />
                  )}
                </div>
              </FilterSection>
            )}

            <FilterSection title="Pay" inset={isModal} showDivider={isDrawer}>
              <PayFilterContent filters={draft} onChange={patchDraft} variant={filterVariant} />
            </FilterSection>

            <FilterSection title="Type" inset={isModal} showDivider={isDrawer}>
              <WorkTypeFilterContent filters={draft} onChange={patchDraft} variant={filterVariant} />
            </FilterSection>

            <FilterSection title="Model" inset={isModal} showDivider={isDrawer}>
              <RemoteFilterContent filters={draft} onChange={patchDraft} variant={filterVariant} />
            </FilterSection>

            <FilterSection title="Classification" inset={isModal} showDivider={isDrawer}>
              <ClassificationFilterContent filters={draft} onChange={patchDraft} variant={filterVariant} />
            </FilterSection>

            <FilterSection title="Listing time" inset={isModal} showDivider={false}>
              <ListingTimeFilterContent filters={draft} onChange={patchDraft} variant={filterVariant} />
            </FilterSection>
          </Stack>
        </div>

        {isDrawer ? (
          <footer className="shrink-0 border-t border-[#EAECF1] bg-white px-2 py-6 pb-[max(24px,env(safe-area-inset-bottom))]">
            {drawerFooter}
          </footer>
        ) : null}
      </div>

      {!isDrawer ? (
        <footer
          className={cn(
            "shrink-0 border-t border-[#EAECF1] bg-white",
            "px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]",
          )}
        >
          {onClearAll ? (
            <DrawerModalFooter
              jobCount={draftResultCount}
              onClearAll={handleClearAllDraft}
              onApply={handleApply}
            />
          ) : (
            <Button variant="solid" tone="brandAccent" className="w-full" onClick={handleApply}>
              Show {draftResultCount.toLocaleString("en-AU")} jobs
            </Button>
          )}
        </footer>
      ) : null}
    </div>
  )

  if (isDrawer) {
    return createPortal(
      <div
        className={cn("fixed inset-0 z-[60] flex", !drawerTransition.visible && "pointer-events-none")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          type="button"
          className={cn(
            "min-w-0 flex-1 bg-black/40",
            drawerTransition.visible
              ? "filter-drawer-backdrop-enter"
              : open
                ? "opacity-0"
                : "filter-drawer-backdrop-exit",
          )}
          aria-label="Close filters"
          onClick={onClose}
        />
        <div className="relative z-[1] h-full shrink-0">{panel}</div>
      </div>,
      document.body,
    )
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60]",
        isModal && "flex items-center justify-center bg-black/40 p-4",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={isModal ? onClose : undefined}
    >
      {panel}
    </div>
  )
}

function DrawerActionFooter({
  jobCount,
  showClearAll,
  onClearAll,
  onApply,
}: {
  jobCount: number
  showClearAll: boolean
  onClearAll: () => void
  onApply: () => void
}) {
  const countLabel = jobCount.toLocaleString("en-AU")

  if (!showClearAll) {
    return (
      <Button variant="solid" tone="brandAccent" className="w-full" onClick={onApply}>
        Show {countLabel} jobs
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-end gap-8">
      <TextLink
        href="#"
        className="text-base font-medium text-[#2E3849] no-underline hover:underline"
        onClick={(e) => {
          e.preventDefault()
          onClearAll()
        }}
      >
        Clear all
      </TextLink>
      <button
        type="button"
        className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-[#2E3849] px-6 text-base font-medium text-white transition-colors hover:bg-[#242C39] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
        onClick={onApply}
      >
        SEEK {countLabel} {jobCount === 1 ? "job" : "jobs"}
      </button>
    </div>
  )
}

const DrawerActionFooterMemo = memo(DrawerActionFooter)

function DrawerModalFooter({
  jobCount,
  onClearAll,
  onApply,
}: {
  jobCount: number
  onClearAll: () => void
  onApply: () => void
}) {
  const countLabel = jobCount.toLocaleString("en-AU")

  return (
    <div className="flex items-center justify-end gap-4">
      <TextLink
        href="#"
        className="text-base font-medium text-[#2E3849] no-underline hover:underline"
        onClick={(e) => {
          e.preventDefault()
          onClearAll()
        }}
      >
        Clear all
      </TextLink>
      <Button
        type="button"
        variant="solid"
        tone="brandAccent"
        className="h-12 shrink-0 px-6 text-base font-medium"
        onClick={onApply}
      >
        SEEK {countLabel} {jobCount === 1 ? "job" : "jobs"}
      </Button>
    </div>
  )
}

function FilterSection({
  title,
  children,
  inset = false,
  showDivider = false,
}: {
  title: string
  children: React.ReactNode
  inset?: boolean
  showDivider?: boolean
}) {
  return (
    <section className="w-full min-w-0">
      <div className={cn(inset && "px-6")}>
        <Heading level="4" component="h3" weight="medium" className="mb-6 text-xl leading-[25px] text-[#2E3849]">
          {title}
        </Heading>
      </div>
      <div className={cn("w-full min-w-0", inset && "px-6")}>{children}</div>
      {showDivider ? <div className="mt-6 h-0.5 w-full bg-[#EAECF1]" aria-hidden /> : null}
    </section>
  )
}

/** Sticky left pill for mobile horizontal scroll row — Figma SERP B "More" pattern */
export function AllFiltersPill({ onClick, activeCount }: { onClick: () => void; activeCount: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "sticky left-0 z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-normal shadow-sm",
        "bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
        activeCount > 0 ? "border-[#2E3849] text-[#2E3849]" : "border-[#EAECF1] text-[#2E3849]",
      )}
      aria-label="Open all filters"
    >
      <IconFilter className="h-4 w-4" aria-hidden />
      <span>All filters</span>
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-lg bg-[#2E3849] px-1 text-xs text-white tabular-nums">
          {activeCount}
        </span>
      )}
    </button>
  )
}
