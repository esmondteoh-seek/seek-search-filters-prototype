import { TextLink } from "@/components/braid"

interface FilterPopoverFooterProps {
  jobCount: number
  onClearAll: () => void
  onApply: () => void
}

/** Clear all + pink SEEK with live job count — Future Vision filter dropdown footer */
export function FilterPopoverFooter({ jobCount, onClearAll, onApply }: FilterPopoverFooterProps) {
  const countLabel = jobCount.toLocaleString("en-AU")

  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#EAECF1] pt-4">
      <TextLink
        href="#"
        className="text-base font-medium text-[#2E3849] no-underline hover:underline"
        onClick={(e) => {
          e.preventDefault()
          onClearAll()
        }}
      >
        Clear all
      </TextLink>
      <button
        type="button"
        className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-[#E60278] px-6 text-base font-medium text-white hover:bg-[#CC0269] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
        onClick={onApply}
      >
        SEEK {countLabel} {jobCount === 1 ? "job" : "jobs"}
      </button>
    </div>
  )
}
