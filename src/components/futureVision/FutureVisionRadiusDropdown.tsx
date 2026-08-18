import { useRef, useState } from "react"
import { RadioGroup, RadioItem, Strong, Text } from "@/components/braid"
import { IconChevronDown, IconLocation } from "@/components/braid/icons"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import { FilterPopover } from "@/src/components/FilterBar/FilterPopover"
import { getDistanceDisplayLabel } from "@/src/components/FilterBar/filterControls"
import { DISTANCE_FILTER_OPTIONS } from "@/src/data/jobs"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import type { FutureVisionLocationChrome } from "@/src/data/futureVisionPresets"
import { type UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"

interface FutureVisionRadiusDropdownProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  locationChrome?: FutureVisionLocationChrome
}

/** Results radius control — location pin, listed places, radio list */
export function FutureVisionRadiusDropdown({
  filterState,
  platform,
  locationChrome: locationChromeProp,
}: FutureVisionRadiusDropdownProps) {
  const { filters, applyFilters } = filterState
  const { locations, locationChrome: locationChromeFromContext } = useFutureVisionLocations()
  const locationChrome = locationChromeProp ?? locationChromeFromContext
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [draftDistanceKm, setDraftDistanceKm] = useState(filters.distanceKm)

  const appliedDistanceKm = filters.distanceKm
  const distanceLabel = getDistanceDisplayLabel(appliedDistanceKm)
  const locationLabel = locations.join(", ")
  const listLocations = locationChrome === "multi-pills"
  const ariaLabel = listLocations
    ? `Showing jobs within ${distanceLabel} of ${locationLabel}. Change distance.`
    : `Showing jobs within ${distanceLabel}. Change distance.`

  if (platform === "app" || locations.length === 0) return null

  const handleOpen = () => {
    setDraftDistanceKm(appliedDistanceKm)
    setOpen(true)
  }

  const commitDraft = (draft: number) => {
    if (draft !== appliedDistanceKm) {
      applyFilters({ distanceKm: draft })
    }
  }

  const handleClose = () => {
    commitDraft(draftDistanceKm)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => (open ? handleClose() : handleOpen())}
        className={cn(
          "inline-flex items-start gap-2 text-left text-sm leading-snug text-[#2E3849]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
        )}
      >
        <IconLocation
          className="mt-0.5 h-4 w-4 shrink-0 text-[#5A6881]"
          aria-hidden
        />
        <Text component="span" size="small" className="min-w-0">
          Showing jobs within{" "}
          <span className="inline-flex items-center gap-0.5 align-middle">
            <Strong>{distanceLabel}</Strong>
            <IconChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-[#5A6881] transition-transform duration-200 ease-out",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </span>
          {listLocations ? (
            <>
              {" of "}
              {locationLabel}
            </>
          ) : null}
        </Text>
      </button>

      <FilterPopover
        open={open}
        onClose={handleClose}
        anchorRef={buttonRef}
        title="Distance"
        width={360}
      >
        <RadioGroup
          name="future-vision-distance"
          value={String(draftDistanceKm)}
          onChange={(value) => setDraftDistanceKm(Number(value))}
          className="gap-2"
        >
          {DISTANCE_FILTER_OPTIONS.map((option) => (
            <RadioItem
              key={option.value}
              value={String(option.value)}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FilterPopover>
    </>
  )
}
