import { useEffect, useState } from "react"
import { JobCard, JobCardSkeleton } from "@/src/components/Results/JobCard"
import { JobDetailPanel } from "@/src/components/Results/JobDetailPanel"
import { MobileJobDetailView } from "@/src/components/Results/MobileJobDetailView"
import { ResultsHeader } from "@/src/components/Results/ResultsHeader"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { Text } from "@/components/braid"
import { cn } from "@/lib/utils"

interface SearchResultsLayoutProps {
  filterState: UseJobFiltersReturn
  stickyTop: number
  /** Concept 2 — sort control in results header per Figma 4174:25227 */
  showSortInHeader?: boolean
  jobCardVariant?: "default" | "delivery"
}

/** Shared job list + detail split — presentation only; state lives in filterState */
export function SearchResultsLayout({
  filterState,
  stickyTop,
  showSortInHeader = false,
  jobCardVariant = "default",
}: SearchResultsLayoutProps) {
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
    updateFilters,
  } = filterState

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    const update = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      if (!mobile) closeMobileDetail()
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [closeMobileDetail])

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId)
    if (isMobile) openMobileDetail()
  }

  const handleBackToResults = () => {
    closeMobileDetail()
  }

  if (isMobile && mobileDetailOpen && selectedJob) {
    return (
      <MobileJobDetailView
        job={selectedJob}
        bookmarked={bookmarkedIds.has(selectedJob.id)}
        onBack={handleBackToResults}
        onBookmark={() => toggleBookmark(selectedJob.id)}
      />
    )
  }

  return (
    <main id="results" className="mx-auto max-w-[1280px] px-4 pb-16 md:px-0">
      {filteredJobs.length === 0 && !isLoading ? (
        <div className="flex flex-col gap-4 lg:w-[484px]">
          <ResultsHeader
            count={filteredJobs.length}
            isLoading={isLoading}
            sort={showSortInHeader ? filters.sort : undefined}
            onSortChange={showSortInHeader ? (sort) => updateFilters({ sort }) : undefined}
          />
          <div className="rounded-2xl border-2 border-[#EAECF1] bg-white p-12 text-center">
            <Text tone="secondary">No jobs match your search or filters. Try different keywords or clear filters.</Text>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[60px]">
          <div className={cn("flex flex-col lg:w-[484px] lg:shrink-0", showSortInHeader ? "gap-6" : "gap-4")}>
            <ResultsHeader
              count={filteredJobs.length}
              isLoading={isLoading}
              sort={showSortInHeader ? filters.sort : undefined}
              onSortChange={showSortInHeader ? (sort) => updateFilters({ sort }) : undefined}
            />
            <div className="flex flex-col gap-4 md:gap-6">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <JobCardSkeleton key={i} variant={jobCardVariant} />
                  ))
                : filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      selected={job.id === selectedJobId}
                      bookmarked={bookmarkedIds.has(job.id)}
                      onSelect={() => handleSelectJob(job.id)}
                      onBookmark={() => toggleBookmark(job.id)}
                      activeSmartFilters={{
                        newToYou: filterState.filters.newToYou,
                        strongApplicant: filterState.filters.strongApplicant,
                      }}
                      smartBadgeVariant={isMobile ? "neutral" : "semantic"}
                      variant={jobCardVariant}
                    />
                  ))}
            </div>
          </div>

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
            />
          </div>
        </div>
      )}
    </main>
  )
}
