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
import { NtyDot, StrongApplicantIcon } from "@/src/components/versionB/VersionBIcons"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters } from "@/src/hooks/useJobFilters"
import { FilterSurfaceButton } from "@/src/components/motion/FilterSurfaceButton"
import { cn } from "@/lib/utils"
import type { VersionBPlatform } from "@/src/data/versionBPresets"

const navyChipTheme = {
  rounded: "rounded-full",
  activeBg: "bg-[#2455C9]",
  inactiveBorder: "border-2 border-white/50",
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
  textInactive: "text-[#2E3849] hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
} as const

interface VersionBFilterChipsProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  /** expanded = full filter row on desktop; inline = scrolled / mobile compact */
  layout?: "expanded" | "inline"
  onMoreClick?: () => void
}

function PersonalisedChip({
  label,
  active,
  onToggle,
  showNtyDot = false,
  showDiamond = false,
  appMode = false,
}: {
  label: string
  active: boolean
  onToggle: () => void
  showNtyDot?: boolean
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
      className={cn("h-10 shrink-0 gap-2 px-3 text-base", appMode && "gap-1.5")}
      contentClassName="gap-2"
    >
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

/** Version B filter chips — NTY dot, outline diamond, More (5); no sort on band */
export function VersionBFilterChips({
  filterState,
  platform,
  layout = "expanded",
  onMoreClick,
}: VersionBFilterChipsProps) {
  const {
    filters,
    search,
    applyFilters,
    clearFilter,
    toggleSmartFilter,
    hasUnseenNewToYouOnPage,
  } = filterState

  const popoverProps = { filters, search, onApplyFilters: applyFilters }
  const appMode = platform === "app"
  const mobileWeb = platform === "mobile-web"
  const ntyLabel = mobileWeb ? "New" : "New to you"
  const appliedCount = countModalFilters(filters)

  const personalised = (
    <>
      <PersonalisedChip
        label={ntyLabel}
        active={filters.newToYou}
        onToggle={() => toggleSmartFilter("newToYou")}
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
    </>
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

  if (layout === "expanded" && !appMode) {
    return (
      <div className="flex min-w-0 flex-nowrap items-center gap-3 overflow-x-auto hide-scrollbar">
        {personalised}
        {fixedPills}
      </div>
    )
  }

  if (appMode) {
    return (
      <div className="flex min-w-0 items-center gap-3 overflow-x-auto hide-scrollbar">
        {personalised}
      </div>
    )
  }

  return (
    <div
      className="flex min-w-0 flex-nowrap items-center gap-3 overflow-x-auto hide-scrollbar"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {personalised}
      <MoreChip appliedCount={appliedCount} onClick={onMoreClick} />
    </div>
  )
}

/** Flat navy band wrapper */
export function VersionBNavyBand({
  children,
  className,
  contentClassName,
}: {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <section
      className={cn("relative px-4 py-4 md:px-0", className)}
      style={{ backgroundColor: VERSION_B_TOKENS.band }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] flex-col gap-3 md:gap-4",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
