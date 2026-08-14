import { IconFilter } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface AllFiltersIconButtonProps {
  appliedCount: number
  onClick: () => void
  isMobile?: boolean
}

/** Concept 3 — square filter icon entry with applied-count badge (Figma 4154:24296) */
export function AllFiltersIconButton({ appliedCount, onClick, isMobile = false }: AllFiltersIconButtonProps) {
  const hasApplied = appliedCount > 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        hasApplied ? `All filters, ${appliedCount} filter${appliedCount === 1 ? "" : "s"} applied` : "All filters"
      }
      className={cn(
        "relative flex shrink-0 items-center justify-center border-2 border-white/65 text-white transition-colors",
        "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
        isMobile ? "size-9 rounded-full" : "size-10 rounded-lg",
      )}
    >
      <IconFilter className={isMobile ? "h-5 w-5" : "h-6 w-6"} aria-hidden />
      {hasApplied ? (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full font-medium tabular-nums",
            isMobile
              ? "-right-1 -top-1 size-4 bg-[#2455C9] text-[10px] leading-none text-white"
              : "-right-1.5 -top-2.5 min-w-6 px-1 py-0.5 bg-white text-xs text-black",
          )}
          aria-hidden
        >
          {appliedCount}
        </span>
      ) : null}
    </button>
  )
}
