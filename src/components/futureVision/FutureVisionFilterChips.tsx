import { IconFilter } from "@/components/braid/icons"
import {
  ClassificationFilterContent,
  ListingTimeFilterContent,
  PayFilterContent,
  RemoteFilterContent,
  WorkTypeFilterContent,
  getClassificationAppliedLabel,
  getListingTimeAppliedLabel,
  getPayAppliedLabel,
  getRemoteAppliedLabel,
  getWorkTypeAppliedLabel,
} from "@/src/components/FilterBar/filterControls"
import { FilterPill } from "@/src/components/FilterBar/FilterPill"
import { NewToYouIcon, NtyDot, StrongApplicantIcon } from "@/src/components/versionB/VersionBIcons"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters } from "@/src/hooks/useJobFilters"
import { FilterSurfaceButton } from "@/src/components/motion/FilterSurfaceButton"
import { cn } from "@/lib/utils"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import { FutureVisionLocationChips } from "@/src/components/futureVision/FutureVisionLocationChips"
import { useFutureVisionLocations } from "@/src/components/futureVision/FutureVisionLocationsContext"
import { getFutureVisionScaledJobCount } from "@/src/data/futureVisionPresets"
import type { SearchQuery } from "@/src/hooks/searchQuery"
import type { FilterState } from "@/src/hooks/useJobFilters"

const navyChipTheme = {
  rounded: "rounded-full",
  activeBg: "bg-[#2455C9]",
  inactiveBorder: "border border-white/50",
  inactiveBg: "bg-transparent",
  textActive: "text-white focus-visible:ring-white focus-visible:ring-offset-[#051A49]",
  textInactive: "text-white hover:bg-white/5 focus-visible:ring-white focus-visible:ring-offset-[#051A49]",
} as const

const appChipTheme = {
  rounded: "rounded-full",
  activeBg: "bg-[#2455C9]",
  inactiveBorder: "border border-[#D2D7DF]",
  inactiveBg: "bg-white",
  textActive: "text-white focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
  textInactive: "text-[#2E3849] hover:bg-[#F5F7FA] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
} as const

interface FutureVisionFilterChipsProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  layout?: "expanded" | "inline"
  onMoreClick?: () => void
  /** When false, parent renders location tabs (compact desktop band) */
  includeLocationRow?: boolean
  /** Collapse the location tab row (scroll-down chrome) */
  hideLocationRow?: boolean
  /** Skip height animation when reduced motion is preferred */
  locationRowInstant?: boolean
}

function PersonalisedChip({
  label,
  active,
  onToggle,
  showNtyDot = false,
  showSparkle = false,
  showDiamond = false,
  appMode = false,
}: {
  label: string
  active: boolean
  onToggle: () => void
  showNtyDot?: boolean
  showSparkle?: boolean
  showDiamond?: boolean
  appMode?: boolean
}) {
  const theme = appMode ? appChipTheme : navyChipTheme
  const iconClass = appMode
    ? active
      ? "text-white"
      : "text-[#2E3849]"
    : "text-white"

  return (
    <FilterSurfaceButton
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      active={active}
      theme={theme}
      className={cn(
        "h-10 shrink-0 px-3 text-base",
        showSparkle ? "gap-1.5" : "gap-2",
        appMode && "gap-1.5",
      )}
      contentClassName={showSparkle ? "gap-1.5" : "gap-2"}
    >
      {showSparkle ? <NewToYouIcon className={iconClass} /> : null}
      {showDiamond ? <StrongApplicantIcon className={iconClass} /> : null}
      <span className="whitespace-nowrap">{label}</span>
      {showNtyDot ? <NtyDot /> : null}
    </FilterSurfaceButton>
  )
}

function MoreChip({
  appliedCount,
  onClick,
  appMode = false,
}: {
  appliedCount: number
  onClick?: () => void
  appMode?: boolean
}) {
  const hasApplied = appliedCount > 0
  const theme = appMode ? appChipTheme : navyChipTheme

  return (
    <FilterSurfaceButton
      onClick={onClick}
      active={hasApplied}
      theme={theme}
      className="relative h-10 shrink-0 gap-2 px-3 text-base font-normal"
      contentClassName="gap-2"
      aria-label={
        hasApplied
          ? `Open more filters, ${appliedCount} applied`
          : "Open more filters"
      }
    >
      <IconFilter className="h-5 w-5 shrink-0" aria-hidden />
      <span>More</span>
      {hasApplied ? (
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium tabular-nums leading-none text-black"
          aria-hidden
        >
          {appliedCount}
        </span>
      ) : null}
    </FilterSurfaceButton>
  )
}

/** Future Vision filter chips — "New" label (not "New to you"), location chips when multi */
export function FutureVisionFilterChips({
  filterState,
  platform,
  layout = "expanded",
  onMoreClick,
  includeLocationRow = true,
  hideLocationRow = false,
  locationRowInstant = false,
}: FutureVisionFilterChipsProps) {
  const {
    filters,
    search,
    applyFilters,
    clearFilter,
    toggleSmartFilter,
    hasUnseenNewToYouOnPage,
  } = filterState
  const { isMultiLocation } = useFutureVisionLocations()

  const popoverProps = {
    filters,
    search,
    onApplyFilters: applyFilters,
    mapJobCount: (draft: FilterState, draftSearch: SearchQuery) =>
      getFutureVisionScaledJobCount(platform, draft, draftSearch),
  }
  const appMode = platform === "app"
  const mobileWebInline = platform === "mobile-web" && layout === "inline"
  const appliedCount = countModalFilters(filters)

  const personalised = (
    <div
      className="flex shrink-0 items-center gap-3"
      data-fv-explain="personalised-filters"
    >
      <PersonalisedChip
        label="New"
        active={filters.newToYou}
        onToggle={() => toggleSmartFilter("newToYou")}
        showSparkle
        showNtyDot={hasUnseenNewToYouOnPage}
        appMode={appMode}
      />
      <PersonalisedChip
        label="Strong applicant"
        active={filters.strongApplicant}
        onToggle={() => toggleSmartFilter("strongApplicant")}
        showDiamond
        appMode={appMode}
      />
    </div>
  )

  const fixedPills = (
    <>
      <FilterPill
        label="Pay"
        appliedLabel={getPayAppliedLabel(filters)}
        applied={!!getPayAppliedLabel(filters)}
        onClear={() => clearFilter("payMin")}
        popoverTitle="Pay"
        popoverWidth={400}
        variant="navy"
        {...popoverProps}
      >
        <PayFilterContent variant="popover" />
      </FilterPill>
      <FilterPill
        label="Type"
        appliedLabel={getWorkTypeAppliedLabel(filters)}
        applied={!!getWorkTypeAppliedLabel(filters)}
        onClear={() => clearFilter("workTypes")}
        popoverTitle="Work type"
        variant="navy"
        {...popoverProps}
      >
        <WorkTypeFilterContent />
      </FilterPill>
      <FilterPill
        label="Remote"
        appliedLabel={getRemoteAppliedLabel(filters)}
        applied={!!getRemoteAppliedLabel(filters)}
        onClear={() => clearFilter("remoteOptions")}
        popoverTitle="Remote options"
        variant="navy"
        {...popoverProps}
      >
        <RemoteFilterContent />
      </FilterPill>
      <FilterPill
        label="Classification"
        appliedLabel={getClassificationAppliedLabel(filters)}
        applied={!!getClassificationAppliedLabel(filters)}
        onClear={() => clearFilter("classifications")}
        popoverTitle="Classification"
        popoverWidth={360}
        variant="navy"
        {...popoverProps}
      >
        <ClassificationFilterContent variant="popover" />
      </FilterPill>
      <FilterPill
        label="Listing time"
        appliedLabel={getListingTimeAppliedLabel(filters, true)}
        applied={!!getListingTimeAppliedLabel(filters, true)}
        onClear={() => clearFilter("listingTime")}
        popoverTitle="Listing time"
        variant="navy"
        {...popoverProps}
      >
        <ListingTimeFilterContent />
      </FilterPill>
    </>
  )

  const locationRow =
    includeLocationRow && isMultiLocation ? (
      <div
        className={cn(
          "grid",
          !locationRowInstant && "transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          hideLocationRow ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={cn("min-h-0 overflow-hidden", appMode ? "pt-0" : "pt-2")}>
            <FutureVisionLocationChips platform={platform} />
          </div>
        </div>
      </div>
    ) : null

  if (layout === "expanded" && !appMode) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 flex-nowrap items-center gap-3 overflow-x-auto hide-scrollbar">
          {personalised}
          {fixedPills}
        </div>
        {locationRow}
      </div>
    )
  }

  if (appMode) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto hide-scrollbar">
          {personalised}
        </div>
        {locationRow}
      </div>
    )
  }

  const inlineRow = (
    <div
      className={cn(
        "flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto hide-scrollbar",
        mobileWebInline && "-mx-5 scroll-px-5 px-5",
      )}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {personalised}
      <MoreChip appliedCount={appliedCount} onClick={onMoreClick} />
      {mobileWebInline ? <span className="w-5 shrink-0" aria-hidden /> : null}
    </div>
  )

  if (!locationRow) return inlineRow

  return (
    <div className="flex flex-col gap-3">
      {inlineRow}
      {locationRow}
    </div>
  )
}

export { VersionBNavyBand } from "@/src/components/versionB/VersionBFilterChips"
