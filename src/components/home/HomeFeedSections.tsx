import {
  IconBookmark,
  IconChevronDown,
  IconChevronRight,
  IconClose,
  IconInfo,
  IconTime,
} from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import {
  HOME_CLASSIFICATIONS,
  HOME_SAVED_JOB,
  HOME_SIDEBAR_SAVED_SEARCHES,
  type HomeRecommendedJob,
  type HomeRecentSearch,
  type HomeSavedSearchItem,
} from "@/src/data/homeFeed"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import { CompanyLogo } from "@/src/components/shared/CompanyLogo"

const BADGE_STYLES = {
  newToYou: "bg-[#E2F7F1] text-[#12784F]",
  strongApplicant: "bg-[#F9EBFD] text-[#7F35A9]",
  earlyApplicant: "bg-[#E3F2FB] text-[#1D559D]",
} as const

const BADGE_LABELS = {
  newToYou: "New to you",
  strongApplicant: "Strong applicant",
  earlyApplicant: "Be an early applicant",
} as const

interface HomeRecommendedCardProps {
  job: HomeRecommendedJob
  compact?: boolean
  onSelect?: () => void
}

export function HomeRecommendedCard({ job, compact = false, onSelect }: HomeRecommendedCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border-2 border-[#EAECF1] bg-white",
        compact ? "p-4" : "p-6 md:p-8",
        onSelect && "cursor-pointer transition-colors hover:border-[#D2D7DF]",
      )}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect()
              }
            }
          : undefined
      }
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className={cn("flex gap-4", compact ? "flex-row" : "flex-col md:flex-row md:gap-6")}>
        <CompanyLogo company={job.company} size={compact ? "md" : "wide"} />

        <div className="min-w-0 flex-1">
          <h3 className={cn("font-medium text-[#2E3849]", compact ? "text-base leading-snug" : "text-xl leading-snug")}>
            {job.title}
          </h3>
          <p className={cn("text-[#2E3849]", compact ? "mt-1 text-sm" : "mt-3 text-base")}>{job.company}</p>

          {job.badges.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.badges.map((badge) => (
                <span
                  key={badge}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-medium",
                    BADGE_STYLES[badge],
                  )}
                >
                  {BADGE_LABELS[badge]}
                </span>
              ))}
            </div>
          ) : null}

          <div className={cn("space-y-2 text-[#2E3849]", compact ? "mt-3 text-xs" : "mt-4 space-y-3 text-sm md:text-base")}>
            <p>{job.location}</p>
            <p>{job.salary}</p>
            <p>{job.workType}</p>
          </div>
        </div>
      </div>

      <ul className={cn("space-y-2 text-[#5A6881]", compact ? "mt-3 text-xs" : "mt-6 space-y-3 text-xs")}>
        {job.teasers.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div className={cn("flex items-center justify-between gap-3", compact ? "mt-4" : "mt-6")}>
        <p className="text-xs text-[#5A6881]">{job.postedLabel}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-1.5 text-[#5A6881] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label="Save job"
          >
            <IconBookmark className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-[#5A6881] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          >
            <IconClose className="h-4 w-4" aria-hidden />
            Hide
          </button>
        </div>
      </div>
    </article>
  )
}

interface HomeSidebarProps {
  onSavedSearchSelect: (query: SearchQuery) => void
  onSavedJobSelect: (query: SearchQuery) => void
  headerHidden?: boolean
}

export function resolveRecentSearchQuery(item: HomeRecentSearch): SearchQuery {
  return {
    keywords: item.searchKeywords ?? item.keywords,
    location: item.searchLocation ?? item.location,
  }
}

export function resolveSavedSearchQuery(item: HomeSavedSearchItem): SearchQuery {
  return {
    keywords: item.searchKeywords,
    location: item.searchLocation,
  }
}

export function HomeSidebar({ onSavedSearchSelect, onSavedJobSelect, headerHidden = false }: HomeSidebarProps) {
  return (
    <aside className="hidden w-[392px] shrink-0 lg:block">
      <div className={cn("sticky flex flex-col gap-8", headerHidden ? "top-4" : "top-[88px]")}>
        <section>
          <h2 className="text-lg font-medium text-[#2E3849]">Saved searches</h2>
          <div className="mt-4 flex flex-col gap-3">
            {HOME_SIDEBAR_SAVED_SEARCHES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSavedSearchSelect(resolveSavedSearchQuery(item))}
                className="rounded-2xl border-2 border-[#EAECF1] bg-white p-4 text-left transition-colors hover:border-[#D2D7DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
              >
                <p className="text-base font-medium text-[#2E3849]">{item.title}</p>
                {item.summary ? <p className="mt-2 text-sm text-[#5A6881]">{item.summary}</p> : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onSavedSearchSelect(resolveSavedSearchQuery(HOME_SIDEBAR_SAVED_SEARCHES[0]))}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1E47A9] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          >
            View all (18)
            <IconChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </section>

        <section>
          <h2 className="text-lg font-medium text-[#2E3849]">Saved jobs</h2>
          <button
            type="button"
            onClick={() =>
              onSavedJobSelect({
                keywords: HOME_SAVED_JOB.searchKeywords,
                location: HOME_SAVED_JOB.searchLocation,
              })
            }
            className="mt-4 w-full rounded-2xl border-2 border-[#EAECF1] bg-white p-4 text-left transition-colors hover:border-[#D2D7DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          >
            <div className="flex gap-4">
              <CompanyLogo company={HOME_SAVED_JOB.company} size="md" />
              <div className="min-w-0">
                <p className="font-medium text-[#2E3849]">{HOME_SAVED_JOB.title}</p>
                <p className="mt-1 text-sm text-[#2E3849]">{HOME_SAVED_JOB.company}</p>
                <p className="mt-2 text-sm text-[#5A6881]">{HOME_SAVED_JOB.location}</p>
                <p className="mt-1 text-sm text-[#5A6881]">{HOME_SAVED_JOB.salary}</p>
                <p className="mt-2 text-xs text-[#5A6881]">{HOME_SAVED_JOB.postedLabel}</p>
              </div>
            </div>
          </button>
        </section>
      </div>
    </aside>
  )
}

export function HomeRecommendedHeader({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h2 className={cn("font-medium text-[#2E3849]", mobile ? "text-xl" : "text-2xl")}>Recommended</h2>
        <button
          type="button"
          className="rounded-full p-1 text-[#5A6881] hover:bg-[#F3F5F7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          aria-label="About recommended jobs"
        >
          <IconInfo className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export function HomeRecentSearchChip({
  keywords,
  location,
  onClick,
}: {
  keywords: string
  location: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-3 rounded-lg bg-[#F3F5F7] px-3 py-2",
        "text-sm font-medium text-[#2E3849] hover:bg-[#EAECF1]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]",
      )}
    >
      <IconTime className="h-[18px] w-[18px] shrink-0 text-[#5A6881]" aria-hidden />
      <span>
        {keywords} jobs <span className="text-[#5A6881]">·</span> {location}
      </span>
    </button>
  )
}

export function HomeClassificationSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative h-12 w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full appearance-none rounded-lg bg-white px-4 pr-10 text-base text-[#2E3849] outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Classification"
      >
        {HOME_CLASSIFICATIONS.map((item) => (
          <option key={item} value={item === "Any classification" ? "" : item}>
            {item}
          </option>
        ))}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5A6881]" aria-hidden />
    </div>
  )
}
