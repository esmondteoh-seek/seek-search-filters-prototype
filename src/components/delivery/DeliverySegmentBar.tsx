import { IconTick } from "@/components/braid/icons"
import { SortFilterPill } from "@/src/components/FilterBar/SortFilterPill"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { formatSmartFilterBadgeLabel } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"

/** Filled diamond — Strong applicant (Figma 17292:45149) */
function IconDiamond({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 2 3 8.2v3.6L10 18l7-6.2V8.2L10 2Z" />
    </svg>
  )
}

interface DeliverySegmentBarProps {
  filterState: UseJobFiltersReturn
  jobCount: number
  isLoading?: boolean
  newToYouCount?: number
  strongApplicantCount?: number
}

/**
 * Results segments — Figma 17292:45149
 * Row 1: white “New to you” + blue “Strong applicant” (when on)
 * Row 2: job count + borderless sort
 */
export function DeliverySegmentBar({
  filterState,
  jobCount,
  isLoading = false,
  newToYouCount,
}: DeliverySegmentBarProps) {
  const { filters, smartFilterCounts, toggleSmartFilter, updateFilters } = filterState

  const newCountValue = newToYouCount ?? smartFilterCounts.newToYou
  const newCount = newCountValue > 0 ? formatSmartFilterBadgeLabel(newCountValue) : undefined
  const countLabel = `${jobCount.toLocaleString("en-AU")} ${jobCount === 1 ? "job" : "jobs"}`

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter results by match type"
      >
        {isLoading ? (
          <>
            <div className="h-10 w-[8.75rem] shimmer rounded-xl" />
            <div className="h-10 w-[10.75rem] shimmer rounded-xl" />
          </>
        ) : (
          <>
            <button
              type="button"
              role="switch"
              aria-checked={filters.newToYou}
              onClick={() => toggleSmartFilter("newToYou")}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl border-2 bg-white px-3 text-base font-normal text-[#2E3849]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
                filters.newToYou
                  ? "border-[#1E47A9]"
                  : "border-[#EAECF1] hover:bg-[#F7F8FB]",
              )}
            >
              {filters.newToYou ? (
                <IconTick className="h-5 w-5 shrink-0 text-[#1E47A9]" aria-hidden />
              ) : null}
              <span className="whitespace-nowrap">New to you</span>
              {newCount ? (
                <span className="inline-flex shrink-0 items-center rounded-lg bg-[#E2F7F1] px-2 py-1.5 text-xs font-medium leading-none tabular-nums text-[#12784F]">
                  {newCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={filters.strongApplicant}
              onClick={() => toggleSmartFilter("strongApplicant")}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl border-2 px-3 text-base font-normal",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
                filters.strongApplicant
                  ? "border-[#1E47A9] bg-[#1E47A9] text-white"
                  : "border-[#EAECF1] bg-white text-[#2E3849] hover:bg-[#F7F8FB]",
              )}
            >
              <IconDiamond
                className={cn(
                  "h-4 w-4 shrink-0",
                  filters.strongApplicant ? "text-white" : "text-[#1E47A9]",
                )}
              />
              <span className="whitespace-nowrap">Strong applicant</span>
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="h-7 w-24 shimmer rounded" aria-hidden />
        ) : (
          <p
            className="text-lg font-medium leading-[27px] text-[#2E3849] tabular-nums"
            aria-live="polite"
          >
            {countLabel}
          </p>
        )}
        {!isLoading && (
          <SortFilterPill
            sort={filters.sort}
            onSortChange={(sort) => updateFilters({ sort })}
            iconOnly
            borderless
            menuAlign="start"
            className="shrink-0"
          />
        )}
      </div>
    </div>
  )
}
