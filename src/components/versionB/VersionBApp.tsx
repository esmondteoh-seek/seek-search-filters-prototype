import { useEffect, useMemo, useRef, useState } from "react"
import { IconFilter } from "@/components/braid/icons"
import { VersionBAppOnboardingSheet } from "@/src/components/versionB/VersionBAppOnboardingSheet"
import { VersionBAppSearchSheet } from "@/src/components/versionB/VersionBAppSearchSheet"
import { VersionBStrongApplicantBlankSheet } from "@/src/components/versionB/VersionBStrongApplicantBlankSheet"
import { MobileJobDetailView } from "@/src/components/Results/MobileJobDetailView"
import { VersionBFilterChips } from "@/src/components/versionB/VersionBFilterChips"
import { VersionBResults } from "@/src/components/versionB/VersionBResults"
import {
  AppTabActivityIcon,
  AppTabHomeIcon,
  AppTabProfileIcon,
  AppTabRecommendedIcon,
  FilterAppliedDot,
} from "@/src/components/versionB/VersionBIcons"
import { formatVersionBAppTitle } from "@/src/data/versionBPresets"
import { PhoneFrame } from "@/src/components/shared/PhoneFrame"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters, getFilteredJobs } from "@/src/hooks/useJobFilters"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import { filtersIgnoringBlankSaLatch, isBlankSearch } from "@/src/lib/isBlankSearch"
import { cn } from "@/lib/utils"

interface VersionBAppProps {
  filterState: UseJobFiltersReturn
  previewState: VersionBPreviewState
}

/** Version B native app — back + sliders, white pill row, tab bar */
export function VersionBApp({ filterState, previewState }: VersionBAppProps) {
  const { search, filters, mobileDetailOpen, closeMobileDetail, bookmarkedIds, toggleBookmark } =
    filterState
  const { title, subtitle } = formatVersionBAppTitle(search)
  const hasFixedFilters = countModalFilters(filters) > 0

  const displayJobs = useMemo(
    () => getFilteredJobs(filtersIgnoringBlankSaLatch(search, filters), search),
    [filters, search],
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [refineSheetOpen, setRefineSheetOpen] = useState(false)
  const [onboardingSheetOpen, setOnboardingSheetOpen] = useState(false)
  const blankSearch = isBlankSearch(search)
  const prevStrongApplicant = useRef(filters.strongApplicant)

  useEffect(() => {
    setOnboardingSheetOpen(previewState === "onboarding" && !refineSheetOpen)
  }, [previewState, refineSheetOpen])

  useEffect(() => {
    const turnedOn = filters.strongApplicant && !prevStrongApplicant.current
    prevStrongApplicant.current = filters.strongApplicant

    if (turnedOn && blankSearch) {
      setRefineSheetOpen(true)
      setOnboardingSheetOpen(false)
    }
    if (!filters.strongApplicant || !blankSearch) {
      setRefineSheetOpen(false)
    }
  }, [filters.strongApplicant, blankSearch])

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

  if (mobileDetailOpen && selectedJob) {
    return (
      <PhoneFrame className="bg-[#F7F8FB]">
        <MobileJobDetailView
          job={selectedJob}
          bookmarked={bookmarkedIds.has(selectedJob.id)}
          onBack={() => closeMobileDetail()}
          onBookmark={() => toggleBookmark(selectedJob.id)}
          contained
          chrome="delivery"
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
              onClick={() => setSheetOpen(true)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2E3849] hover:bg-[#F5F7FA]"
              aria-label={hasFixedFilters ? "Filters applied" : "Filters"}
            >
              <IconFilter className="h-5 w-5" aria-hidden />
              {hasFixedFilters ? <FilterAppliedDot /> : null}
            </button>
          </header>

          <div className="border-b border-[#EAECF1] bg-white px-4 py-3">
            <VersionBFilterChips
              filterState={filterState}
              platform="app"
              previewState={previewState}
              layout="inline"
            />
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain" data-version-b-scroll>
          <VersionBResults
            filterState={filterState}
            platform="app"
            previewState={previewState}
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

      <VersionBAppSearchSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filterState={filterState}
      />

      <VersionBStrongApplicantBlankSheet
        open={refineSheetOpen}
        onClose={() => setRefineSheetOpen(false)}
        onEditSearch={() => setSheetOpen(true)}
      />

      <VersionBAppOnboardingSheet
        open={onboardingSheetOpen && !refineSheetOpen}
        onClose={() => setOnboardingSheetOpen(false)}
      />
    </PhoneFrame>
  )
}
