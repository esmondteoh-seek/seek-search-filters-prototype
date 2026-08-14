import { useId, useState } from "react"
import {
  IconBookmark,
  IconBookmarkFilled,
  IconChevronDown,
} from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import {
  type Job,
  formatSalary,
  getStrongApplicantTier,
} from "@/src/data/jobs"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import type { JobCardSmartFilterState } from "@/src/components/Results/JobCard"
import { resolveJobCardSmartBadgeFilters } from "@/src/components/Results/JobCard"
import { CompanyLogo } from "@/src/components/shared/CompanyLogo"

function VersionBBadges({
  job,
  activeFilters,
}: {
  job: Job
  activeFilters?: JobCardSmartFilterState
}) {
  const resolved = activeFilters ? resolveJobCardSmartBadgeFilters(activeFilters) : null
  const showNew = resolved?.newToYou && job.isNewToYou
  const tier = getStrongApplicantTier(job)
  const showStrong = resolved?.strongApplicant && tier != null
  const showEarly = job.isEarlyApplicant

  if (!showNew && !showStrong && !showEarly) return null

  const base = "inline-flex shrink-0 items-center rounded-lg px-2.5 py-1.5 text-xs font-medium leading-none"

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      {showNew && (
        <span
          className={base}
          style={{
            backgroundColor: VERSION_B_TOKENS.ntyBadgeBg,
            color: VERSION_B_TOKENS.ntyBadgeText,
          }}
        >
          New to you
        </span>
      )}
      {showStrong && tier && (
        <span
          className={base}
          style={{
            backgroundColor:
              tier === "veryStrong" ? VERSION_B_TOKENS.strongBadgeText : VERSION_B_TOKENS.strongBadgeBg,
            color: tier === "veryStrong" ? "#FFFFFF" : VERSION_B_TOKENS.strongBadgeText,
          }}
        >
          {tier === "veryStrong" ? "Very strong applicant" : "Strong applicant"}
        </span>
      )}
      {showEarly && (
        <span
          className={base}
          style={{
            backgroundColor: VERSION_B_TOKENS.earlyBadgeBg,
            color: VERSION_B_TOKENS.earlyBadgeText,
          }}
        >
          Be an early applicant
        </span>
      )}
    </div>
  )
}

interface VersionBJobCardProps {
  job: Job
  selected: boolean
  bookmarked: boolean
  onSelect: () => void
  onBookmark: () => void
  activeSmartFilters?: JobCardSmartFilterState
  /** App — square logo top-left, no chevron */
  appLayout?: boolean
}

export function VersionBJobCard({
  job,
  selected,
  bookmarked,
  onSelect,
  onBookmark,
  activeSmartFilters,
  appLayout = false,
}: VersionBJobCardProps) {
  const postedShort = job.postedLabel.replace(/^Posted\s+/i, "")
  const classificationPanelId = useId()
  const [classificationOpen, setClassificationOpen] = useState(false)

  if (appLayout) {
    return (
      <article
        className={cn(
          "relative cursor-pointer rounded-xl border bg-white p-4 transition-colors duration-150",
          selected ? "border-2 border-[#2E3849]" : "border-[#E4E8EF] hover:border-[#D2D7DF]",
        )}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect()
          }
        }}
        tabIndex={0}
        aria-current={selected ? "true" : undefined}
      >
        <div className="flex gap-3">
          <CompanyLogo company={job.company} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-snug text-[#0D1630]">{job.title}</h3>
            <p className="mt-0.5 text-sm text-[#5A6881]">{job.company}</p>
          </div>
        </div>
        <div className="mt-2">
          <VersionBBadges job={job} activeFilters={activeSmartFilters} />
        </div>
        <div className="mt-2 space-y-0.5 text-sm text-[#5A6881]">
          <p>{job.workType}</p>
          <p>{job.location}</p>
          <p>{job.salaryLabel ?? formatSalary(job.salaryMin, job.salaryMax)}</p>
        </div>
        <ul className="mt-3 space-y-1 text-sm leading-5 text-[#5A6881]">
          {job.teaser.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="shrink-0" aria-hidden>
                •
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#5A6881]">{postedShort}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onBookmark()
            }}
            className="rounded-full p-1 hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark job"}
          >
            {bookmarked ? (
              <IconBookmarkFilled className="h-5 w-5 text-[#2E3849]" />
            ) : (
              <IconBookmark className="h-5 w-5 text-[#5A6881]" />
            )}
          </button>
        </div>
      </article>
    )
  }

  const showSubClassification =
    job.subClassification && job.subClassification !== job.classification

  return (
    <article
      className={cn(
        "relative cursor-pointer rounded-xl bg-white p-5 transition-colors duration-150 md:p-6",
        selected ? "border-2 border-[#2E3849]" : "border border-[#E4E8EF] hover:border-[#D2D7DF]",
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      tabIndex={0}
      aria-current={selected ? "true" : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-base font-semibold leading-[22px] text-[#0D1630] md:text-lg md:leading-6">
            {job.title}
          </h3>
          <p className="mt-1.5 text-sm leading-5 text-[#5A6881] md:text-[15px]">{job.company}</p>
        </div>
        <CompanyLogo company={job.company} size="card" />
      </div>

      <div className="mt-3">
        <VersionBBadges job={job} activeFilters={activeSmartFilters} />
      </div>

      <div className="mt-3 space-y-1 text-sm leading-5 text-[#5A6881]">
        <p>{job.location}</p>
        <p>{job.salaryLabel ?? formatSalary(job.salaryMin, job.salaryMax)}</p>
        <p>
          {job.workType}
          {job.remoteOption !== "On-site" && <span> ({job.remoteOption})</span>}
        </p>
      </div>

      <ul className="mt-3 space-y-1 text-sm leading-5 text-[#5A6881]">
        {job.teaser.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="shrink-0" aria-hidden>
              •
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs leading-4 text-[#5A6881]">{postedShort}</p>
        <div className="flex items-center gap-1 text-[#5A6881]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setClassificationOpen((open) => !open)
            }}
            className="inline-flex rounded-full p-1 hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-expanded={classificationOpen}
            aria-controls={classificationPanelId}
            aria-label={classificationOpen ? "Hide classification" : "Show classification"}
          >
            <IconChevronDown
              className={cn(
                "h-5 w-5 motion-safe:transition-transform motion-safe:duration-200",
                classificationOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onBookmark()
            }}
            className="rounded-full p-1 hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark job"}
          >
            {bookmarked ? (
              <IconBookmarkFilled className="h-5 w-5 text-[#2E3849]" />
            ) : (
              <IconBookmark className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {classificationOpen ? (
        <div
          id={classificationPanelId}
          className="mt-2 border-t border-[#EAECF1] pt-2 text-sm leading-5 text-[#5A6881]"
          onClick={(e) => e.stopPropagation()}
        >
          <p>{job.classification}</p>
          {showSubClassification ? <p className="mt-0.5">{job.subClassification}</p> : null}
        </div>
      ) : null}
    </article>
  )
}

export function VersionBJobCardSkeleton({ appLayout = false }: { appLayout?: boolean }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-[#E4E8EF] bg-white",
        appLayout ? "p-4" : "p-5 md:p-6",
      )}
    >
      <div className="flex gap-3">
        <div className={cn("shrink-0 bg-[#F3F5F7]", appLayout ? "h-12 w-12 rounded-lg" : "ml-auto h-12 w-[72px] rounded-lg md:h-14 md:w-20")} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-[#F3F5F7]" />
          <div className="h-4 w-1/2 rounded bg-[#F3F5F7]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[#F3F5F7]" />
        <div className="h-3 w-2/3 rounded bg-[#F3F5F7]" />
      </div>
    </div>
  )
}
