import { IconHeart, IconHeartFilled } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

type SaveSearchButtonVariant = "expanded-desktop" | "expanded-mobile" | "compact-desktop" | "compact-mobile"

interface SaveSearchButtonProps {
  saved: boolean
  onToggle: () => void
  variant: SaveSearchButtonVariant
}

/** Save-search heart — outline when inactive, filled blue when saved */
export function SaveSearchButton({ saved, onToggle, variant }: SaveSearchButtonProps) {
  const isCompact = variant.startsWith("compact")
  const isMobile = variant.endsWith("mobile")

  const sizeClass = isCompact
    ? isMobile
      ? "h-9 w-9"
      : "h-10 w-10"
    : isMobile
      ? "h-9 w-9"
      : "h-12 w-12"

  const roundedClass = isCompact
    ? "rounded-full"
    : isMobile
      ? "rounded-full"
      : "rounded-lg"

  const iconClass = isCompact
    ? "h-[18px] w-[18px]"
    : isMobile
      ? "h-5 w-5"
      : "h-6 w-6"

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={saved ? "Remove saved search" : "Save search"}
      aria-pressed={saved}
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeClass,
        roundedClass,
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2E3849]",
        saved
          ? "bg-[#F0F7FE] hover:bg-[#E5F0FD]"
          : "border-2 border-white/65 hover:bg-white/10",
      )}
    >
      {saved ? (
        <IconHeartFilled className={cn(iconClass, "text-[#1E47A9]")} aria-hidden />
      ) : (
        <IconHeart className={cn(iconClass, "text-white")} aria-hidden />
      )}
    </button>
  )
}
