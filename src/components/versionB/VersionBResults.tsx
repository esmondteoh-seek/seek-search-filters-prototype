import { useEffect, useState } from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { SortFilterPill } from "@/src/components/FilterBar/SortFilterPill"
import { getDistanceDisplayLabel } from "@/src/components/FilterBar/filterControls"
import { JobDetailPanel } from "@/src/components/Results/JobDetailPanel"
import { MobileJobDetailView } from "@/src/components/Results/MobileJobDetailView"
import { ResultsHeader } from "@/src/components/Results/ResultsHeader"
import { VersionBJobCard, VersionBJobCardSkeleton } from "@/src/components/versionB/VersionBJobCard"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { Text } from "@/components/braid"
import { cn } from "@/lib/utils"
import type { VersionBPlatform, VersionBPreviewState } from "@/src/data/versionBPresets"
import { getVersionBDisplayJobCount, versionBUsesPresetJobCount } from "@/src/data/versionBPresets"

interface VersionBResultsProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  previewState: VersionBPreviewState
  stickyTop?: number
  /** Desktop split view */
  forceSplit?: boolean
  /** Single column (app / mobile-web) */
  singleColumn?: boolean
  onJobSelect?: (jobId: string) => void
}

function VersionBLocationLine({
  filterState,
  platform,
}: {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
}) {
  const { search, filters, hasLocation } = filterState
  if (platform === "app" || !hasLocation) return null

  const locationLabel = search.location.replace(/,\s*/g, " ").trim()
  const distanceLabel = getDistanceDisplayLabel(filters.distanceKm)

  return (
    <div className="flex items-start gap-2 text-sm leading-snug text-[#2E3849]">
      <span className="mt-0.5 inline-flex shrink-0 text-[#5A6881]" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      <p className="min-w-0">
        <span>Showing jobs within </span>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 font-medium text-[#2E3849]"
          aria-label={`Distance: ${distanceLabel}`}
        >
          {distanceLabel}
          <IconChevronDown className="h-4 w-4 text-[#5A6881]" aria-hidden />
        </button>
        <span> of {locationLabel}</span>
      </p>
    </div>
  )
}

/** Version B results — frame counts, sort on header, 50 km line, dedicated cards */
export function VersionBResults({
  filterState,
  platform,
  previewState,
  stickyTop = 0,
  forceSplit = false,
  singleColumn = false,
  onJobSelect,
}: VersionBResultsProps) {
  const {
    filteredJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    isLoading,
    bookmarkedIds,
    toggleBookmark,
    mobileDetailOpen,
    openMobileDetail,
    closeMobileDetail,
    filters,
    search,
    updateFilters,
    markNewToYouJobSeen,
  } = filterState

  const usePresetCount = versionBUsesPresetJobCount(platform, previewState, search)
  const frameCount =
    usePresetCount
      ? getVersionBDisplayJobCount(platform, previewState) ?? filteredJobs.length
      : filteredJobs.length
  const isApp = platform === "app"
  const [isNarrow, setIsNarrow] = useState(singleColumn)

  useEffect(() => {
    if (singleColumn || forceSplit) {
      setIsNarrow(singleColumn)
      return
    }
    const mq = window.matchMedia("(max-width: 1023px)")
    const update = () => setIsNarrow(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [forceSplit, singleColumn])

  const showMobileDetail = isNarrow && mobileDetailOpen && selectedJob && !isApp

  /** Desktop split pane — detail is visible for the selected job */
  useEffect(() => {
    if (isNarrow || !selectedJobId) return
    markNewToYouJobSeen(selectedJobId)
  }, [isNarrow, selectedJobId, markNewToYouJobSeen])

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId)
    onJobSelect?.(jobId)
    if (isNarrow || isApp) {
      openMobileDetail()
      markNewToYouJobSeen(jobId)
    }
  }

  if (showMobileDetail) {
    return (
      <MobileJobDetailView
        job={selectedJob}
        bookmarked={bookmarkedIds.has(selectedJob.id)}
        onBack={() => closeMobileDetail()}
        onBookmark={() => toggleBookmark(selectedJob.id)}
        contained={singleColumn}
      />
    )
  }

  const smartFilters = {
    newToYou: filters.newToYou,
    strongApplicant: filters.strongApplicant,
  }

  return (
    <main
      id="results"
      className={cn("pb-16", singleColumn ? (isApp ? "px-4 pt-3" : "px-4 pt-4") : "mx-auto max-w-[1280px] px-4 md:px-0")}
    >
      {filteredJobs.length === 0 && !isLoading ? (
        <div className={cn("flex flex-col", isApp ? "gap-3" : "gap-4", !isNarrow && "lg:w-[484px]")}>
          <div className="flex items-center justify-between gap-2">
            <ResultsHeader count={frameCount} isLoading={isLoading} />
            {!isApp ? (
              <SortFilterPill
                sort={filters.sort}
                onSortChange={(sort) => updateFilters({ sort })}
                variant="bar"
                iconOnly
                borderless
                menuAlign="end"
              />
            ) : null}
          </div>
          <VersionBLocationLine filterState={filterState} platform={platform} />
          <div className="rounded-2xl border-2 border-[#EAECF1] bg-white p-12 text-center">
            <Text tone="secondary">No jobs match your search or filters.</Text>
          </div>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-6", !isNarrow && "lg:flex-row lg:items-start lg:gap-[60px]")}>
          <div className={cn("flex flex-col", isApp ? "gap-3" : "gap-4", !isNarrow && "lg:w-[484px] lg:shrink-0")}>
            <div className="flex items-center justify-between gap-2">
              <ResultsHeader count={frameCount} isLoading={isLoading} />
              {!isApp ? (
                <SortFilterPill
                  sort={filters.sort}
                  onSortChange={(sort) => updateFilters({ sort })}
                  variant="bar"
                  iconOnly
                  borderless
                  menuAlign="end"
                />
              ) : null}
            </div>
            <VersionBLocationLine filterState={filterState} platform={platform} />

            <div className={cn("flex flex-col gap-4", singleColumn && "gap-3")}>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <VersionBJobCardSkeleton key={i} appLayout={isApp} />
                  ))
                : filteredJobs.map((job) => (
                    <VersionBJobCard
                      key={job.id}
                      job={job}
                      selected={job.id === selectedJobId}
                      bookmarked={bookmarkedIds.has(job.id)}
                      onSelect={() => handleSelectJob(job.id)}
                      onBookmark={() => toggleBookmark(job.id)}
                      activeSmartFilters={smartFilters}
                      appLayout={isApp}
                    />
                  ))}
            </div>
          </div>

          {!isNarrow ? (
            <div
              className="hidden min-w-0 flex-1 lg:block"
              style={{
                position: "sticky",
                top: stickyTop + 16,
                height: `calc(100dvh - ${stickyTop + 16}px - 16px)`,
              }}
            >
              <JobDetailPanel
                job={selectedJob}
                bookmarked={selectedJob ? bookmarkedIds.has(selectedJob.id) : false}
                onBookmark={selectedJob ? () => toggleBookmark(selectedJob.id) : undefined}
                chrome="delivery"
              />
            </div>
          ) : null}
        </div>
      )}
    </main>
  )
}
