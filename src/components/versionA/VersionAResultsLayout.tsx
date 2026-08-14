import { useEffect, useMemo, useState } from "react"
import { JobCard, JobCardSkeleton } from "@/src/components/Results/JobCard"
import { JobDetailPanel } from "@/src/components/Results/JobDetailPanel"
import { MobileJobDetailView } from "@/src/components/Results/MobileJobDetailView"
import { VersionATopFilterBar } from "@/src/components/versionA/VersionATopFilterBar"
import { getFilteredJobs } from "@/src/hooks/useJobFilters"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { Text } from "@/components/braid"

interface VersionAResultsLayoutProps {
  filterState: UseJobFiltersReturn
  stickyTop: number
}

/** Version A results — segment pills filter results (Figma 17292:45149 / 17290:39535) */
export function VersionAResultsLayout({ filterState, stickyTop }: VersionAResultsLayoutProps) {
  const {
    isLoading,
    bookmarkedIds,
    toggleBookmark,
    mobileDetailOpen,
    openMobileDetail,
    closeMobileDetail,
    filters,
    search,
  } = filterState

  const { newToYouJobs, strongApplicantJobs } = useMemo(() => {
    const build = (segment: "newToYou" | "strongApplicant") =>
      getFilteredJobs(
        {
          ...filters,
          newToYou: segment === "newToYou",
          strongApplicant: segment === "strongApplicant",
          jobsAtSeek: false,
        },
        search,
      )
    return {
      newToYouJobs: build("newToYou"),
      strongApplicantJobs: build("strongApplicant"),
    }
  }, [filters, search])

  const displayJobs = useMemo(
    () => getFilteredJobs({ ...filters, jobsAtSeek: false }, search),
    [filters, search],
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)

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
    setSelectedId(jobId)
    if (isMobile) openMobileDetail()
  }

  const jobCount = displayJobs.length

  if (isMobile && mobileDetailOpen && selectedJob) {
    return (
      <MobileJobDetailView
        job={selectedJob}
        bookmarked={bookmarkedIds.has(selectedJob.id)}
        onBack={() => closeMobileDetail()}
        onBookmark={() => toggleBookmark(selectedJob.id)}
      />
    )
  }

  return (
    <main id="results" className="bg-[#F7F8FB]">
      <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-4 md:px-0 md:pt-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <VersionATopFilterBar
            filterState={filterState}
            jobCount={jobCount}
            isLoading={isLoading}
            newToYouCount={newToYouJobs.length}
            strongApplicantCount={strongApplicantJobs.length}
          />

          {displayJobs.length === 0 && !isLoading ? (
            <div className="rounded-2xl border border-[#EAECF1] bg-white p-10 text-center md:p-12 lg:w-[484px]">
              <Text tone="secondary">
                No jobs match your search or filters. Try different keywords or clear filters.
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-start lg:gap-[60px]">
              <div className="flex flex-col gap-3 lg:w-[484px] lg:shrink-0">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <JobCardSkeleton key={i} variant="delivery" />
                    ))
                  : displayJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        selected={job.id === selectedId}
                        bookmarked={bookmarkedIds.has(job.id)}
                        onSelect={() => handleSelectJob(job.id)}
                        onBookmark={() => toggleBookmark(job.id)}
                        activeSmartFilters={{
                          newToYou: filters.newToYou,
                          strongApplicant: filters.strongApplicant,
                        }}
                        smartBadgeVariant={isMobile ? "neutral" : "semantic"}
                        strongApplicantBadgeMode="tiered"
                        variant="delivery"
                      />
                    ))}
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
                  chrome="delivery"
                  hideActions
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
