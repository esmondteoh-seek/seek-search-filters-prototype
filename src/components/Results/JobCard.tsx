import { IconBookmark, IconBookmarkFilled, IconChevronDown, IconOverflow } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { type Job, formatSalary, getStrongApplicantTier, type StrongApplicantTier } from "@/src/data/jobs"
import { CompanyLogo } from "@/src/components/shared/CompanyLogo"

export interface JobCardSmartFilterState {
  newToYou: boolean
  strongApplicant: boolean
}

/** Badge visibility — all-jobs view shows job flags; filtered views show matching badges only */
export function resolveJobCardSmartBadgeFilters(filters: JobCardSmartFilterState): JobCardSmartFilterState {
  const allJobsView = !filters.newToYou && !filters.strongApplicant
  return {
    newToYou: allJobsView || filters.newToYou,
    strongApplicant: allJobsView || filters.strongApplicant,
  }
}

interface JobCardProps {
  job: Job
  selected: boolean
  bookmarked: boolean
  onSelect: () => void
  onBookmark: () => void
  activeSmartFilters?: JobCardSmartFilterState
  smartBadgeVariant?: "semantic" | "neutral"
  /** standard = always "Strong"; vsab = Very strong only; tiered = both tiers (Version A) */
  strongApplicantBadgeMode?: "standard" | "vsab" | "tiered"
  /** Delivery prototypes — Figma 17292:45149 / 17291:43226 */
  variant?: "default" | "delivery"
  /** App shell — square logo top-left, no expand chevron */
  appLayout?: boolean
}

const SMART_BADGE_LABELS = {
  newToYou: "New to you",
} as const

const STRONG_APPLICANT_BADGES: Record<
  StrongApplicantTier,
  { label: string; semanticClass: string; neutralClass: string }
> = {
  veryStrong: {
    label: "Very strong applicant",
    semanticClass: "bg-[#7F35A9] text-white",
    neutralClass: "bg-[#F3F5F7] text-[#2E3849]",
  },
  strong: {
    label: "Strong applicant",
    semanticClass: "bg-[#F9EBFD] text-[#7F35A9]",
    neutralClass: "bg-[#F3F5F7] text-[#2E3849]",
  },
}

const SEMANTIC_BADGE_STYLES = {
  newToYou: "bg-[#E2F7F1] text-[#12784F]",
} as const

function resolveStrongApplicantDisplayTier(
  tier: StrongApplicantTier | null,
  mode: "standard" | "vsab" | "tiered",
): StrongApplicantTier | null {
  if (!tier) return null
  if (mode === "tiered") return tier
  if (mode === "vsab") return tier === "veryStrong" ? "veryStrong" : null
  return "strong"
}

function JobCardBadges({
  job,
  activeFilters,
  variant,
  strongApplicantBadgeMode = "standard",
  delivery = false,
}: {
  job: Job
  activeFilters?: JobCardSmartFilterState
  variant: "semantic" | "neutral"
  strongApplicantBadgeMode?: "standard" | "vsab" | "tiered"
  delivery?: boolean
}) {
  const resolved = activeFilters ? resolveJobCardSmartBadgeFilters(activeFilters) : null
  const showNew = resolved?.newToYou && job.isNewToYou
  const strongTier = getStrongApplicantTier(job)
  const displayTier = resolveStrongApplicantDisplayTier(strongTier, strongApplicantBadgeMode)
  const showStrong = resolved?.strongApplicant && displayTier != null

  if (!showNew && !showStrong) return null

  const badgeBase = delivery
    ? "inline-flex shrink-0 items-center rounded-lg px-2.5 py-1.5 text-xs font-medium leading-none"
    : "inline-flex shrink-0 items-center rounded-lg px-3 py-2 text-xs font-medium leading-none"

  const newBadgeClass = cn(
    badgeBase,
    variant === "semantic" ? SEMANTIC_BADGE_STYLES.newToYou : "bg-[#F3F5F7] text-[#2E3849]",
  )

  const strongBadgeClass = (tier: StrongApplicantTier) =>
    cn(
      badgeBase,
      variant === "semantic"
        ? STRONG_APPLICANT_BADGES[tier].semanticClass
        : STRONG_APPLICANT_BADGES[tier].neutralClass,
    )

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      {showNew && <span className={newBadgeClass}>{SMART_BADGE_LABELS.newToYou}</span>}
      {showStrong && displayTier && (
        <span className={strongBadgeClass(displayTier)}>{STRONG_APPLICANT_BADGES[displayTier].label}</span>
      )}
    </div>
  )
}

export function JobCard({
  job,
  selected,
  bookmarked,
  onSelect,
  onBookmark,
  activeSmartFilters,
  smartBadgeVariant = "semantic",
  strongApplicantBadgeMode = "standard",
  variant = "default",
  appLayout = false,
}: JobCardProps) {
  const isDelivery = variant === "delivery"

  if (isDelivery && appLayout) {
    return (
      <article
        className={cn(
          "relative cursor-pointer rounded-xl border bg-white transition-colors duration-150",
          "p-4",
          selected ? "border-[#2E3849] border-2" : "border-[#E4E8EF] hover:border-[#D2D7DF]",
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
          <JobCardBadges
            job={job}
            activeFilters={activeSmartFilters}
            variant={smartBadgeVariant}
            strongApplicantBadgeMode={strongApplicantBadgeMode}
            delivery
          />
        </div>

        <div className="mt-2 space-y-0.5 text-sm text-[#5A6881]">
          <p>{job.workType}</p>
          <p>{job.location}</p>
          <p>{job.salaryLabel ?? formatSalary(job.salaryMin, job.salaryMax)}</p>
        </div>

        <ul className="mt-2 space-y-0.5 text-sm text-[#5A6881]">
          {job.teaser.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="shrink-0" aria-hidden>
                •
              </span>
              <span className="line-clamp-1">{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-2 line-clamp-1 text-sm text-[#5A6881]">{job.teaser[0]}</p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#5A6881]">{job.postedLabel}</p>
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

  if (isDelivery) {
    return (
      <article
        className={cn(
          "relative cursor-pointer rounded-xl bg-white transition-colors duration-150",
          "p-5 md:p-6",
          selected
            ? "border-2 border-[#2E3849]"
            : "border border-[#E4E8EF] hover:border-[#D2D7DF]",
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
            <p className="mt-1.5 text-sm leading-5 text-[#5A6881] md:text-[15px]">
              {job.company}
            </p>
          </div>
          <CompanyLogo company={job.company} size="card" />
        </div>

        <div className="mt-3">
          <JobCardBadges
            job={job}
            activeFilters={activeSmartFilters}
            variant={smartBadgeVariant}
            strongApplicantBadgeMode={strongApplicantBadgeMode}
            delivery
          />
        </div>

        <div className="mt-3 space-y-1 text-sm leading-5 text-[#5A6881]">
          <p>{job.location}</p>
          <p>{job.salaryLabel ?? formatSalary(job.salaryMin, job.salaryMax)}</p>
          <p>
            {job.workType}
            {job.remoteOption !== "On-site" && (
              <span> ({job.remoteOption})</span>
            )}
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
          <p className="text-xs leading-4 text-[#5A6881]">{job.postedLabel}</p>
          <div className="flex items-center gap-1 text-[#5A6881]">
            <span className="inline-flex p-1" aria-hidden>
              <IconChevronDown className="h-5 w-5" />
            </span>
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
      </article>
    )
  }

  return (
    <article
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 bg-white transition-colors duration-150",
        "p-6 md:p-8",
        selected ? "border-[#2E3849]" : "border-[#EAECF1] hover:border-[#D2D7DF]",
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
      <div className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <CompanyLogo company={job.company} size="wide" />

          <h3 className="text-xl font-medium leading-snug text-[#2E3849]">{job.title}</h3>
          <p className="text-base text-[#2E3849]">{job.company}</p>

          <JobCardBadges
            job={job}
            activeFilters={activeSmartFilters}
            variant={smartBadgeVariant}
            strongApplicantBadgeMode={strongApplicantBadgeMode}
          />
        </div>

        <div className="hidden shrink-0 gap-6 md:flex">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-1 text-[#5A6881] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label="More options"
          >
            <IconOverflow className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onBookmark()
            }}
            className="rounded-full p-1 text-[#5A6881] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark job"}
          >
            {bookmarked ? (
              <IconBookmarkFilled className="h-6 w-6 text-[#2E3849]" />
            ) : (
              <IconBookmark className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm text-[#2E3849] md:mt-6 md:space-y-4">
        <p>{job.location}</p>
        <p>{formatSalary(job.salaryMin, job.salaryMax)}</p>
        <p>
          {job.workType}
          {job.remoteOption !== "On-site" && (
            <span className="text-[#5A6881]"> ({job.remoteOption})</span>
          )}
        </p>
      </div>

      <ul className="mt-4 space-y-3 text-xs leading-snug text-[#5A6881] md:mt-6">
        {job.teaser.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-[#2E3849]">{job.postedLabel}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onBookmark()
          }}
          className="rounded-full p-1 text-[#5A6881] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] md:hidden"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark job"}
        >
          {bookmarked ? (
            <IconBookmarkFilled className="h-5 w-5 text-[#2E3849]" />
          ) : (
            <IconBookmark className="h-5 w-5" />
          )}
        </button>
      </div>
    </article>
  )
}

export function JobCardSkeleton({
  variant = "default",
  appLayout = false,
}: {
  variant?: "default" | "delivery"
  appLayout?: boolean
}) {
  if (variant === "delivery" && appLayout) {
    return (
      <div className="rounded-xl border border-[#E4E8EF] bg-white p-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 shrink-0 shimmer rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/2 shimmer rounded" />
          </div>
        </div>
        <div className="mt-3 h-6 w-2/3 shimmer rounded-lg" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-1/3 shimmer rounded" />
          <div className="h-3 w-2/5 shimmer rounded" />
        </div>
      </div>
    )
  }

  if (variant === "delivery") {
    return (
      <div className="rounded-xl border border-[#E4E8EF] bg-white p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/2 shimmer rounded" />
          </div>
          <div className="h-12 w-[72px] shrink-0 shimmer rounded-lg md:h-14 md:w-20" />
        </div>
        <div className="mt-3 h-6 w-2/3 shimmer rounded-lg" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-1/3 shimmer rounded" />
          <div className="h-3 w-2/5 shimmer rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-[#EAECF1] bg-white p-6 md:p-8">
      <div className="mb-4 h-16 w-32 shimmer rounded-lg" />
      <div className="space-y-3">
        <div className="h-6 w-3/4 shimmer rounded" />
        <div className="h-5 w-1/2 shimmer rounded" />
        <div className="h-4 w-2/3 shimmer rounded" />
      </div>
    </div>
  )
}
