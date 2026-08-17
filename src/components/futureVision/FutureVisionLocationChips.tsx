import { IconClose, IconLocation } from "@/components/braid/icons"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import { cn } from "@/lib/utils"

interface FutureVisionLocationChipsProps {
  platform: VersionBPlatform
}

interface LocationTabProps {
  label: string
  selected: boolean
  onSelect: () => void
  onRemove: () => void
  platform: VersionBPlatform
}

function LocationTab({ label, selected, onSelect, onRemove, platform }: LocationTabProps) {
  const isApp = platform === "app"
  const isDesktop = platform === "desktop"
  const isMobileWeb = platform === "mobile-web"

  if (isDesktop) {
    return (
      <div
        className={cn(
          "flex h-10 max-w-[min(100%,340px)] shrink-0 items-center gap-1.5 rounded-t-xl px-3 text-sm",
          selected
            ? "bg-white text-[#2E3849]"
            : "rounded-t-xl border border-b-0 border-white/20 bg-white/10 text-white",
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5 text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#051A49]",
            !selected && "text-white",
          )}
          aria-pressed={selected}
          aria-label={`Location: ${label}`}
        >
          <IconLocation
            className={cn("h-4 w-4 shrink-0", selected ? "text-[#5A6881]" : "text-white/90")}
            aria-hidden
          />
          <span className="min-w-0 truncate">{label}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            selected
              ? "text-[#697586] hover:bg-[#F0F2F5]"
              : "text-white/80 hover:bg-white/10",
          )}
          aria-label={`Remove ${label}`}
        >
          <IconClose className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }

  if (isMobileWeb) {
    return (
      <div
        className={cn(
          "flex h-10 max-w-[min(100%,300px)] shrink-0 items-center gap-1.5 rounded-t-xl px-3 text-sm",
          selected
            ? "bg-white text-[#2E3849]"
            : "border border-b-0 border-white/20 bg-white/10 text-white",
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5 text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            !selected && "text-white",
          )}
          aria-pressed={selected}
          aria-label={`Location: ${label}`}
        >
          <IconLocation
            className={cn("h-4 w-4 shrink-0", selected ? "text-[#5A6881]" : "text-white/90")}
            aria-hidden
          />
          <span className="min-w-0 truncate">{label}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            selected
              ? "text-[#697586] hover:bg-[#F0F2F5]"
              : "text-white/80 hover:bg-white/10",
          )}
          aria-label={`Remove ${label}`}
        >
          <IconClose className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }

  if (isApp) {
    return (
      <div
        className={cn(
          "flex h-9 max-w-[min(100%,280px)] shrink-0 items-center gap-1.5 rounded-full px-3 text-sm",
          selected
            ? "border border-[#2455C9] bg-[#2455C9] text-white"
            : "border border-[#EAECF1] bg-[#F0F2F5] text-[#2E3849]",
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          aria-pressed={selected}
          aria-label={`Location: ${label}`}
        >
          <IconLocation
            className={cn("h-4 w-4 shrink-0", selected ? "text-white" : "text-[#5A6881]")}
            aria-hidden
          />
          <span className="min-w-0 truncate">{label}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]",
            selected
              ? "text-white/90 hover:bg-white/10"
              : "text-[#697586] hover:bg-[#EAECF1]",
          )}
          aria-label={`Remove ${label}`}
        >
          <IconClose className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }

  return null
}

/** Tab-style location chips — pin + canonical displayName + remove */
export function FutureVisionLocationChips({ platform }: FutureVisionLocationChipsProps) {
  const { locations, selectedLocationIndex, selectLocationTab, removeLocation } =
    useFutureVisionLocations()

  const isApp = platform === "app"
  const isDesktop = platform === "desktop"
  const isMobileWeb = platform === "mobile-web"

  return (
    <div
      className={cn(
        "flex min-w-0",
        isDesktop || isMobileWeb
          ? "flex-nowrap items-end gap-3 overflow-x-auto hide-scrollbar"
          : "items-center gap-2 overflow-x-auto hide-scrollbar flex-nowrap",
        isDesktop && "flex-wrap",
      )}
      data-fv-explain="multi-location"
      style={!isDesktop ? { WebkitOverflowScrolling: "touch" } : undefined}
    >
      {locations.map((location, index) => (
        <LocationTab
          key={`${location}-${index}`}
          label={location}
          selected={index === selectedLocationIndex}
          platform={platform}
          onSelect={() => selectLocationTab(index)}
          onRemove={() => removeLocation(index)}
        />
      ))}
    </div>
  )
}
