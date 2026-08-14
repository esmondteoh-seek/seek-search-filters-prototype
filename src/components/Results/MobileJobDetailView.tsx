import { useEffect } from "react"
import { IconChevronLeft } from "@/components/braid/icons"
import { JobDetailActions, JobDetailPanel } from "@/src/components/Results/JobDetailPanel"
import type { Job } from "@/src/data/jobs"
import { cn } from "@/lib/utils"

interface MobileJobDetailViewProps {
  job: Job
  bookmarked: boolean
  onBack: () => void
  onBookmark: () => void
  vsab?: boolean
  /** Fill the phone frame instead of the viewport */
  contained?: boolean
}

/** Full-screen job detail on mobile with back navigation to SERP */
export function MobileJobDetailView({
  job,
  bookmarked,
  onBack,
  onBookmark,
  vsab = false,
  contained = false,
}: MobileJobDetailViewProps) {
  useEffect(() => {
    if (contained) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [contained])

  return (
    <div
      className={cn(
        "flex flex-col bg-white",
        contained ? "absolute inset-0 z-50" : "fixed inset-0 z-50 lg:hidden",
      )}
    >
      <div className="sticky top-0 z-20 shrink-0 border-b border-[#EAECF1] bg-white">
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center gap-2 px-4 py-3 text-left text-base font-medium text-[#1E47A9] hover:bg-[#F7F8FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E47A9]"
        >
          <IconChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
          Back to results
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-24">
        <JobDetailPanel
          job={job}
          variant="page"
          bookmarked={bookmarked}
          onBookmark={onBookmark}
          hideActions
          vsab={vsab}
        />
      </div>

      <div
        className={cn(
          "z-30 border-t border-[#EAECF1] bg-white px-3 py-4",
          contained ? "absolute inset-x-0 bottom-0" : "fixed inset-x-0 bottom-0",
        )}
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <JobDetailActions
          bookmarked={bookmarked}
          onBookmark={onBookmark}
          applyLabel="Quick apply"
          saveVariant="form"
        />
      </div>
    </div>
  )
}
