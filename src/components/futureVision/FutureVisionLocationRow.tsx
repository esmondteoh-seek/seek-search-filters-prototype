import { FutureVisionLocationChips } from "@/src/components/futureVision/FutureVisionLocationChips"
import { cn } from "@/lib/utils"
import type { VersionBPlatform } from "@/src/data/versionBPresets"

interface FutureVisionLocationRowProps {
  platform: VersionBPlatform
  /** Collapse the row (scroll-down chrome) */
  hidden?: boolean
  /** Skip height animation when reduced motion is preferred */
  instant?: boolean
}

/** Animated grid wrapper for hanging location tabs — shared by FilterChips and desktop band */
export function FutureVisionLocationRow({
  platform,
  hidden = false,
  instant = false,
}: FutureVisionLocationRowProps) {
  const isApp = platform === "app"
  const isDesktop = platform === "desktop"
  const isMobileWeb = platform === "mobile-web"

  return (
    <div
      className={cn(
        "grid",
        isMobileWeb && "-mx-5",
        isApp && "-mx-3",
        !instant && "transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
        hidden ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(
            "min-h-0",
            isApp && "pt-0",
            isMobileWeb && "pt-2",
            isDesktop && "pt-4",
          )}
        >
          <FutureVisionLocationChips platform={platform} />
        </div>
      </div>
    </div>
  )
}
