import { useEffect, useMemo, useState } from "react"
import { SortFilterPill } from "@/src/components/FilterBar/SortFilterPill"
import { JobDetailPanel } from "@/src/components/Results/JobDetailPanel"
import { MobileJobDetailView } from "@/src/components/Results/MobileJobDetailView"
import { ResultsHeader } from "@/src/components/Results/ResultsHeader"
import { VersionBJobCard, VersionBJobCardSkeleton } from "@/src/components/versionB/VersionBJobCard"
import { FutureVisionRadiusDropdown } from "@/src/components/futureVision/FutureVisionRadiusDropdown"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import { applySelectedLocationToJob } from "@/src/data/futureVisionJobLocation"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { Text } from "@/components/braid"
import { cn } from "@/lib/utils"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import { getFutureVisionScaledJobCount } from "@/src/data/futureVisionPresets"
import type { FutureVisionLocationChrome } from "@/src/data/futureVisionPresets"

interface FutureVisionResultsProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  stickyTop?: number
  forceSplit?: boolean
  singleColumn?: boolean
  onJobSelect?: (jobId: string) => void
  locationChrome?: FutureVisionLocationChrome
}

/** Future Vision results — frame counts, 50 km line, Version B job cards */
export function FutureVisionResults({
  filterState,
  platform,
  stickyTop = 0,
  forceSplit = false,
  singleColumn = false,
  onJobSelect,
  locationChrome = "multi-pills",
}: FutureVisionResultsProps) {
  const {
    filteredJobs,
    selectedJobId,
    setSelectedJobId,
    isLoading,
    bookmarkedIds,
    toggleBookmark,
    mobileDetailOpen,
    openMobileDetail,
    closeMobileDetail,
    filters,
    updateFilters,
    markNewToYouJobSeen,
    search,
  } = filterState

  const displayJobCount = getFutureVisionScaledJobCount(platform, filters, search)
  const isApp = platform === "app"
  const isMobileWeb = platform === "mobile-web"
  const { locations, selectedLocationIndex, isMultiLocation } = useFutureVisionLocations()
  const selectedDisplayLocation =
    locations[selectedLocationIndex] ?? locations[0] ?? ""
  const [isNarrow, setIsNarrow] = useState(singleColumn)

  const displayJobs = useMemo(
    () =>
      filteredJobs.map((job, index) =>
        applySelectedLocationToJob(job, selectedDisplayLocation, index),
      ),
    [filteredJobs, selectedDisplayLocation],
  )

  const displaySelectedJob = useMemo(
    () => displayJobs.find((j) => j.id === selectedJobId) ?? null,
    [displayJobs, selectedJobId],
  )

  const showCardSelected = platform === "desktop"
  const resultsTopPadding =
    singleColumn && isMultiLocation ? "pt-1" : singleColumn ? "pt-2" : undefined

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

  const showMobileDetail = isNarrow && mobileDetailOpen && displaySelectedJob && !isApp

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
        job={displaySelectedJob}
        bookmarked={bookmarkedIds.has(displaySelectedJob.id)}
        onBack={() => closeMobileDetail()}
        onBookmark={() => toggleBookmark(displaySelectedJob.id)}
        contained={singleColumn}
      />
    )
  }

  const smartFilters = {
    newToYou: filters.newToYou,
    strongApplicant: filters.strongApplicant,
  }

  const resultsChrome = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <ResultsHeader count={displayJobCount} isLoading={isLoading} />
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
      <FutureVisionRadiusDropdown
        filterState={filterState}
        platform={platform}
        locationChrome={locationChrome}
      />
    </div>
  )

  return (
    <main
      id="results"
      className={cn(
        "pb-16",
        singleColumn
          ? cn(isMobileWeb ? "px-5" : "px-4", resultsTopPadding)
          : "mx-auto max-w-[1280px] px-4 md:px-0",
      )}
    >
      {filteredJobs.length === 0 && !isLoading ? (
        <div
          className={cn(
            "flex flex-col",
            isApp ? "gap-3" : "gap-4",
            !isNarrow && "lg:w-[484px]",
          )}
        >
          {resultsChrome}
          <div className="rounded-2xl border-2 border-[#EAECF1] bg-white p-12 text-center">
            <Text tone="secondary">No jobs match your search or filters.</Text>
          </div>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-6", !isNarrow && "lg:flex-row lg:items-start lg:gap-[60px]")}>
          <div
            className={cn(
              "flex flex-col",
              isApp ? "gap-3" : "gap-4",
              !isNarrow && "lg:w-[484px] lg:shrink-0",
            )}
          >
            {resultsChrome}

            <div className={cn("flex flex-col gap-4", singleColumn && "gap-3")}>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <VersionBJobCardSkeleton key={i} appLayout={isApp} />
                  ))
                : displayJobs.map((job) => (
                    <VersionBJobCard
                      key={job.id}
                      job={job}
                      selected={showCardSelected && job.id === selectedJobId}
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
                job={displaySelectedJob}
                bookmarked={displaySelectedJob ? bookmarkedIds.has(displaySelectedJob.id) : false}
                onBookmark={
                  displaySelectedJob ? () => toggleBookmark(displaySelectedJob.id) : undefined
                }
                chrome="delivery"
              />
            </div>
          ) : null}
        </div>
      )}
    </main>
  )
}
