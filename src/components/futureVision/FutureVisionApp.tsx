import { useEffect, useMemo, useRef, useState } from "react"
import { IconFilter } from "@/components/braid/icons"
import { FutureVisionMobileSearchSheet } from "@/src/components/futureVision/FutureVisionMobileSearchSheet"
import { MobileJobDetailView } from "@/src/components/Results/MobileJobDetailView"
import { FutureVisionFilterChips } from "@/src/components/futureVision/FutureVisionFilterChips"
import { FutureVisionResults } from "@/src/components/futureVision/FutureVisionResults"
import {
  AppTabActivityIcon,
  AppTabHomeIcon,
  AppTabProfileIcon,
  AppTabRecommendedIcon,
} from "@/src/components/versionB/VersionBIcons"
import { formatFutureVisionAppTitle } from "@/src/data/futureVisionPresets"
import { applySelectedLocationToJob } from "@/src/data/futureVisionJobLocation"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import { useFutureVisionSubmit } from "@/src/components/futureVision/useFutureVisionSubmit"
import { PhoneFrame } from "@/src/components/shared/PhoneFrame"
import { useHideOnScrollDown } from "@/src/hooks/useHideOnScrollDown"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { getFilteredJobs, countModalFilters } from "@/src/hooks/useJobFilters"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import { cn } from "@/lib/utils"

interface FutureVisionAppProps {
  filterState: UseJobFiltersReturn
}

/** Future Vision native app — location chips when multi, filter dot when standard filters applied */
export function FutureVisionApp({ filterState }: FutureVisionAppProps) {
  const { search, filters, mobileDetailOpen, closeMobileDetail, bookmarkedIds, toggleBookmark } =
    filterState
  const { locations, selectedLocationIndex, isMultiLocation } = useFutureVisionLocations()
  const { title, subtitle } = formatFutureVisionAppTitle(search.keywords, locations)
  const { submitSearch, openSearchDraft } = useFutureVisionSubmit(filterState)

  const selectedDisplayLocation =
    locations[selectedLocationIndex] ?? locations[0] ?? ""

  const displayJobs = useMemo(() => {
    const jobs = getFilteredJobs(filters, search)
    return jobs.map((job, index) =>
      applySelectedLocationToJob(job, selectedDisplayLocation, index),
    )
  }, [filters, search, selectedDisplayLocation])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { hidden: locationsHidden, reveal, instant } = useHideOnScrollDown(scrollRef, {
    forceVisible: sheetOpen,
    enabled: isMultiLocation && !mobileDetailOpen,
  })

  useEffect(() => {
    if (displayJobs.length === 0) {
      setSelectedId(null)
      return
    }
    setSelectedId((prev) =>
      prev && displayJobs.some((j) => j.id === prev) ? prev : displayJobs[0].id,
    )
  }, [displayJobs])

  const selectedJob = useMemo(
    () => displayJobs.find((j) => j.id === selectedId) ?? null,
    [displayJobs, selectedId],
  )

  const appliedFilterCount = countModalFilters(filters)
  const showFilterDot = appliedFilterCount > 0

  const handleOpenSheet = () => {
    reveal()
    openSearchDraft()
    setSheetOpen(true)
  }

  const handleSheetSubmit = () => {
    submitSearch()
  }

  if (mobileDetailOpen && selectedJob) {
    return (
      <PhoneFrame className="bg-[#F7F8FB]">
        <MobileJobDetailView
          job={selectedJob}
          bookmarked={bookmarkedIds.has(selectedJob.id)}
          onBack={() => closeMobileDetail()}
          onBookmark={() => toggleBookmark(selectedJob.id)}
          contained
        />
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame className="bg-[#F7F8FB]">
        <div className="flex shrink-0 items-center justify-between px-6 pb-1 pt-3 text-xs font-semibold text-[#2E3849]">
          <span>9:41</span>
          <div className="flex items-center gap-1" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-sm bg-[#2E3849]" />
            <span className="h-2.5 w-2.5 rounded-sm bg-[#2E3849]" />
            <span className="h-2.5 w-3.5 rounded-sm bg-[#2E3849]" />
          </div>
        </div>

        <div className="shrink-0 bg-white">
          <header className="flex items-center gap-2 border-b border-[#EAECF1] px-3 py-2.5">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2E3849] hover:bg-[#F5F7FA]"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M14.5 5 8 12l6.5 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-sm font-medium text-[#2E3849]">{title}</p>
              <p className="truncate text-xs text-[#697586]">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={handleOpenSheet}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2E3849] hover:bg-[#F5F7FA]"
              aria-label={
                showFilterDot
                  ? `Filters, ${appliedFilterCount} applied`
                  : "Filters"
              }
            >
              <IconFilter className="h-5 w-5" aria-hidden />
              {showFilterDot ? (
                <span
                  className="absolute right-1.5 top-1.5 size-2.5 rounded-full"
                  style={{ backgroundColor: VERSION_B_TOKENS.formAccent }}
                  aria-hidden
                />
              ) : null}
            </button>
          </header>

          <div className="border-b border-[#EAECF1] bg-white px-3 py-3">
            <FutureVisionFilterChips
              filterState={filterState}
              platform="app"
              layout="inline"
              hideLocationRow={locationsHidden}
              locationRowInstant={instant}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
          data-version-b-scroll
        >
          <FutureVisionResults
            filterState={filterState}
            platform="app"
            singleColumn
            onJobSelect={setSelectedId}
          />
        </div>

        <nav
          className="flex shrink-0 items-center justify-around border-t border-[#EAECF1] bg-white px-1 py-2"
          aria-label="App navigation"
        >
          {[
            { label: "Home", active: true, badge: null as string | null, Icon: AppTabHomeIcon },
            {
              label: "Recommended",
              active: false,
              badge: "99+",
              Icon: AppTabRecommendedIcon,
            },
            { label: "My Activity", active: false, badge: null, Icon: AppTabActivityIcon },
            { label: "Profile", active: false, badge: null, Icon: AppTabProfileIcon },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={cn(
                "relative flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium",
                tab.active ? "text-[#1E47A9]" : "text-[#697586]",
              )}
              aria-current={tab.active ? "page" : undefined}
            >
              <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden>
                <tab.Icon active={tab.active} />
                {tab.badge ? (
                  <span
                    className="absolute -right-2 -top-1 rounded-full px-1 text-[9px] font-bold leading-tight text-white"
                    style={{ backgroundColor: VERSION_B_TOKENS.seekPink }}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex justify-center pb-2 pt-1">
          <div className="h-1 w-28 rounded-full bg-[#2E3849]/20" aria-hidden />
        </div>

        <FutureVisionMobileSearchSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          filterState={filterState}
          onSubmit={handleSheetSubmit}
          contained
        />
    </PhoneFrame>
  )
}
