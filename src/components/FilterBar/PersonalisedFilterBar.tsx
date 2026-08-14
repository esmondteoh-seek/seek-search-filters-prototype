import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { SmartFilterChip } from "./SmartFilterChip"

interface PersonalisedFilterBarProps {
  filterState: UseJobFiltersReturn
  showDivider?: boolean
}

/** Personalised chips below navy band — Concept 1 only (Figma 4174 / 4166) */
export function PersonalisedFilterBar({ filterState, showDivider = false }: PersonalisedFilterBarProps) {
  const {
    filters,
    smartFilterCounts,
    dismissedBadges,
    toggleSmartFilter,
    showCompanyFilter,
  } = filterState
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return (
    <div className={cn("bg-white transition-[border-color] duration-200 ease-out", showDivider && "border-b border-[#EAECF1]")}>
      <div className="mx-auto max-w-[1280px] px-4 py-3 md:px-0">
        <div
          className={cn(
            "flex items-center gap-2",
            isMobile && "overflow-x-auto hide-scrollbar filter-scroll-fade-right",
          )}
          style={isMobile ? { WebkitOverflowScrolling: "touch" } : undefined}
        >
          <SmartFilterChip
            label={isMobile ? "New" : "New to you"}
            count={smartFilterCounts.newToYou}
            active={filters.newToYou}
            showBadge={!dismissedBadges.newToYou}
            onToggle={() => toggleSmartFilter("newToYou")}
          />

          <SmartFilterChip
            label="Strong applicant"
            count={smartFilterCounts.strongApplicant}
            active={filters.strongApplicant}
            showBadge={!dismissedBadges.strongApplicant}
            onToggle={() => toggleSmartFilter("strongApplicant")}
          />

          {showCompanyFilter && (
            <SmartFilterChip
              label="Jobs at SEEK"
              count={smartFilterCounts.jobsAtSeek}
              active={filters.jobsAtSeek}
              showBadge={!dismissedBadges.jobsAtSeek}
              onToggle={() => toggleSmartFilter("jobsAtSeek")}
            />
          )}
        </div>
      </div>
    </div>
  )
}
