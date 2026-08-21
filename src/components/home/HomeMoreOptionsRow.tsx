import { useId, useState } from "react"
import { IconFilter } from "@/components/braid/icons"
import { VersionBFixedFilterPills } from "@/src/components/versionB/VersionBFixedFilterPills"
import { markVersionBHomeMoreOptions } from "@/src/lib/versionBHomeSession"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"

interface HomeMoreOptionsRowProps {
  filterState: UseJobFiltersReturn
  className?: string
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  spotlight?: VersionBPreviewState
}

/** au.seek.com home — More options reveals fixed filter pills (no personalised chips) */
export function HomeMoreOptionsRow({
  filterState,
  className,
  expanded: expandedProp,
  onExpandedChange,
  spotlight,
}: HomeMoreOptionsRowProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const expanded = expandedProp ?? internalExpanded
  const pillsId = useId()

  const expand = () => {
    markVersionBHomeMoreOptions()
    onExpandedChange?.(true)
    if (expandedProp === undefined) setInternalExpanded(true)
  }

  return (
    <div className={cn("flex min-w-0 w-full items-start", !expanded && "justify-end", className)}>
      {!expanded ? (
        <button
          type="button"
          onClick={expand}
          aria-expanded={false}
          aria-controls={pillsId}
          className={cn(
            "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border-2 border-white/70 px-4 text-sm font-medium text-white",
            "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
        >
          <IconFilter className="h-5 w-5" aria-hidden />
          More options
        </button>
      ) : (
        <nav
          id={pillsId}
          aria-label="Refine your search"
          data-vb-spotlight={spotlight}
          className="flex min-w-0 flex-1 flex-wrap items-center gap-3"
        >
          <VersionBFixedFilterPills filterState={filterState} />
        </nav>
      )}
    </div>
  )
}
