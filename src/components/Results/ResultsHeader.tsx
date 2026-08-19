import type { SortOption } from "@/src/data/jobs"
import { SortFilterPill } from "@/src/components/FilterBar/SortFilterPill"
import { cn } from "@/lib/utils"

/** Job count header — optional sort for Concept 2 results row */
export interface ResultsHeaderProps {
  count: number
  isLoading?: boolean
  /** When set, replaces the "{count} jobs" label (e.g. blank search "All jobs") */
  title?: string
  sort?: SortOption
  onSortChange?: (sort: SortOption) => void
}

export function ResultsHeader({ count, isLoading, title, sort, onSortChange }: ResultsHeaderProps) {
  const showSort = sort != null && onSortChange != null

  return (
    <div className={cn("flex w-full items-center", showSort && "justify-between")}>
      <div aria-live="polite" aria-atomic="true">
        {isLoading ? (
          <div className="h-7 w-28 shimmer rounded" aria-label="Updating results…" />
        ) : title ? (
          <p className="text-lg font-medium leading-[27px] text-black">{title}</p>
        ) : (
          <p className="text-lg font-medium tabular-nums leading-[27px] text-black">
            {count.toLocaleString("en-AU")} {count === 1 ? "job" : "jobs"}
          </p>
        )}
      </div>
      {showSort && !isLoading ? (
        <SortFilterPill
          sort={sort}
          onSortChange={onSortChange}
          variant="bar"
          labelSize="compact"
          menuAlign="end"
        />
      ) : null}
    </div>
  )
}
