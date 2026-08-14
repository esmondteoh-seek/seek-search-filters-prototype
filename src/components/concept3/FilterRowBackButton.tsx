import { IconArrowLeft } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface FilterRowBackButtonProps {
  onClick: () => void
  isMobile?: boolean
}

/** Concept 3 — back to discovery filter row (Figma 4154:24350) */
export function FilterRowBackButton({ onClick, isMobile = false }: FilterRowBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to filter suggestions"
      className={cn(
        "flex shrink-0 items-center justify-center border-2 border-white/65 text-white transition-colors",
        "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
        isMobile ? "size-9 rounded-full" : "size-10 rounded-lg",
      )}
    >
      <IconArrowLeft className={isMobile ? "h-5 w-5" : "h-5 w-5"} aria-hidden />
    </button>
  )
}
