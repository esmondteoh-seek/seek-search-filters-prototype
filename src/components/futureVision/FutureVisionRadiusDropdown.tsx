import { useMemo, useRef, useState } from "react"
import { RadioGroup, RadioItem, Strong, Text } from "@/components/braid"
import { IconChevronDown, IconJob } from "@/components/braid/icons"
import { FilterPopover } from "@/src/components/FilterBar/FilterPopover"
import { FilterPopoverFooter } from "@/src/components/FilterBar/FilterPopoverFooter"
import { getDistanceDisplayLabel } from "@/src/components/FilterBar/filterControls"
import { DISTANCE_FILTER_OPTIONS } from "@/src/data/jobs"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import { getFutureVisionScaledJobCount } from "@/src/data/futureVisionPresets"
import { type UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { cn } from "@/lib/utils"

interface FutureVisionRadiusDropdownProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
}

/** Results radius control — briefcase trigger, radio list, SEEK preview footer */
export function FutureVisionRadiusDropdown({
  filterState,
  platform,
}: FutureVisionRadiusDropdownProps) {
  const { filters, search, applyFilters, hasLocation } = filterState
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [draftDistanceKm, setDraftDistanceKm] = useState(filters.distanceKm)

  const appliedDistanceKm = filters.distanceKm
  const hasDraftChanges = draftDistanceKm !== appliedDistanceKm
  const distanceLabel = getDistanceDisplayLabel(appliedDistanceKm)

  const previewCount = useMemo(
    () =>
      getFutureVisionScaledJobCount(
        platform,
        { ...filters, distanceKm: draftDistanceKm },
        search,
      ),
    [draftDistanceKm, filters, search, platform],
  )

  if (platform === "app" || !hasLocation) return null

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

  const handleApply = () => {
    commitDraft(draftDistanceKm)
    setOpen(false)
  }

  const handleClearAll = () => {
    setDraftDistanceKm(50)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Showing jobs within ${distanceLabel}. Change distance.`}
        onClick={() => (open ? handleClose() : handleOpen())}
        className={cn(
          "inline-flex items-center gap-2 text-left text-sm leading-snug text-[#2E3849]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
        )}
      >
        <IconJob className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />
        <Text component="span" size="small">
          Showing jobs within{" "}
          <Strong>{distanceLabel}</Strong>
        </Text>
        <IconChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#5A6881] transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <FilterPopover
        open={open}
        onClose={handleClose}
        anchorRef={buttonRef}
        title="Distance"
        width={360}
        footer={
          hasDraftChanges ? (
            <FilterPopoverFooter
              jobCount={previewCount}
              onClearAll={handleClearAll}
              onApply={handleApply}
            />
          ) : undefined
        }
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
