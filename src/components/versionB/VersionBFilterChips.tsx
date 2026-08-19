import { IconFilter } from "@/components/braid/icons"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { NtyDot, StrongApplicantIcon } from "@/src/components/versionB/VersionBIcons"
import { VersionBFixedFilterPills } from "@/src/components/versionB/VersionBFixedFilterPills"
import { VersionBFilterOnboardingTooltip } from "@/src/components/versionB/VersionBFilterOnboardingTooltip"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters } from "@/src/hooks/useJobFilters"
import { FilterSurfaceButton, filterPillThemes } from "@/src/components/motion/FilterSurfaceButton"
import { motionTokens } from "@/src/lib/motionTokens"
import { consumeVersionBHomeMoreOptions } from "@/src/lib/versionBHomeSession"
import {
  isBlankSearchWithoutOtherFilters,
  patchClearingBlankSa,
} from "@/src/lib/isBlankSearch"
import { scrollSearchResultsToTop } from "@/src/lib/scrollSearchResultsToTop"
import { cn } from "@/lib/utils"
import type { VersionBPlatform, VersionBPreviewState } from "@/src/data/versionBPresets"

const navyChipTheme = filterPillThemes.navy

const appChipTheme = {
  rounded: "rounded-full",
  activeBg: "bg-[#2455C9]",
  inactiveBorder: "border border-[#D2D7DF]",
  inactiveBg: "bg-white",
  textActive: "text-white focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
  textInactive: "text-[#2E3849] hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
} as const

function skipChipEntranceForPreview(preview: VersionBPreviewState): boolean {
  if (preview === "scrolled") return true
  return !consumeVersionBHomeMoreOptions()
}

interface VersionBFilterChipsProps {
  filterState: UseJobFiltersReturn
  platform: VersionBPlatform
  previewState?: VersionBPreviewState
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
  compactNavy = false,
  ariaChecked,
}: {
  label: string
  active: boolean
  onToggle: () => void
  showNtyDot?: boolean
  showDiamond?: boolean
  appMode?: boolean
  compactNavy?: boolean
  /** Accessible checked state when it differs from visual active (e.g. SA on blank search) */
  ariaChecked?: boolean
}) {
  const theme = appMode ? appChipTheme : navyChipTheme
  const checked = ariaChecked ?? active
  const iconClass = appMode
    ? active
      ? "text-white"
      : "text-[#2E3849]"
    : "text-white"

  return (
    <FilterSurfaceButton
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      active={active}
      theme={theme}
      className={cn(
        "h-10 shrink-0 gap-1.5 px-4 text-base",
        appMode && "gap-1.5 px-3",
        compactNavy && "gap-1 px-3 text-sm",
      )}
      contentClassName={cn("gap-1.5", !appMode && "gap-2")}
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
  compactNavy = false,
}: {
  appliedCount: number
  onClick?: () => void
  appMode?: boolean
  compactNavy?: boolean
}) {
  const hasApplied = appliedCount > 0
  const theme = appMode ? appChipTheme : navyChipTheme

  return (
    <FilterSurfaceButton
      onClick={onClick}
      active={hasApplied}
      theme={theme}
      className={cn(
        "relative h-10 shrink-0 gap-1.5 px-4 text-base font-normal",
        compactNavy && "gap-1 px-3 text-sm",
      )}
      contentClassName="gap-1.5"
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

const chipEntranceSpring = { type: "spring" as const, stiffness: 200, damping: 38 }

/** Personalised chips slide in from the left and push fixed filters right on mount */
function AnimatedPersonalisedFilters({
  children,
  onEntranceComplete,
  skipEntrance = false,
  compactNavy = false,
}: {
  children: ReactNode
  onEntranceComplete?: () => void
  skipEntrance?: boolean
  compactNavy?: boolean
}) {
  const gapClass = compactNavy ? "gap-2" : "gap-3"
  const reduceMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(Boolean(reduceMotion || skipEntrance))
  const completeRef = useRef(onEntranceComplete)
  completeRef.current = onEntranceComplete

  useEffect(() => {
    if (skipEntrance || reduceMotion) {
      completeRef.current?.()
      return
    }
    setRevealed(false)
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [skipEntrance, reduceMotion])

  if (skipEntrance || reduceMotion) {
    return <div className={cn("flex w-max shrink-0 items-center", gapClass)}>{children}</div>
  }

  return (
    <motion.div
      layout
      className={cn(
        "grid w-max shrink-0",
        revealed ? "overflow-visible" : "overflow-hidden",
      )}
      initial={false}
      animate={{ gridTemplateColumns: revealed ? "1fr" : "0fr" }}
      transition={{ gridTemplateColumns: chipEntranceSpring }}
    >
      <div className={cn("min-w-0", revealed ? "overflow-visible" : "overflow-hidden")}>
        <motion.div
          className={cn("flex items-center", gapClass)}
          initial={false}
          animate={{
            opacity: revealed ? 1 : 0,
            x: revealed ? 0 : -16,
          }}
          transition={{
            opacity: { duration: 0.45, ease: motionTokens.ease.out },
            x: chipEntranceSpring,
          }}
          onAnimationComplete={() => {
            if (revealed) completeRef.current?.()
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

function FilterChipRow({
  personalised,
  trailing,
  className,
  onChipEntranceComplete,
  skipMotion = false,
  compactNavy = false,
}: {
  personalised: ReactNode
  trailing: ReactNode
  className?: string
  onChipEntranceComplete?: () => void
  skipMotion?: boolean
  compactNavy?: boolean
}) {
  const rowClass = cn(
    "flex min-w-0 flex-wrap items-center gap-3 overflow-visible",
    compactNavy && "gap-2",
    className,
  )

  if (skipMotion) {
    return (
      <div className={rowClass}>
        <AnimatedPersonalisedFilters
          skipEntrance
          compactNavy={compactNavy}
          onEntranceComplete={onChipEntranceComplete}
        >
          {personalised}
        </AnimatedPersonalisedFilters>
        {trailing}
      </div>
    )
  }

  return (
    <motion.div layout className={rowClass}>
      <AnimatedPersonalisedFilters
        compactNavy={compactNavy}
        onEntranceComplete={onChipEntranceComplete}
      >
        {personalised}
      </AnimatedPersonalisedFilters>
      {trailing}
    </motion.div>
  )
}

/** Version B filter chips — NTY dot, outline diamond, More (5); no sort on band */
export function VersionBFilterChips({
  filterState,
  platform,
  previewState = "filters",
  layout = "expanded",
  onMoreClick,
}: VersionBFilterChipsProps) {
  const {
    filters,
    search,
    applyFilters,
    toggleSmartFilter,
    hasUnseenNewToYouOnPage,
    smartFilterCounts,
  } = filterState

  const appMode = platform === "app"
  const mobileWeb = platform === "mobile-web"
  const compactNavy = mobileWeb && layout === "inline"
  const ntyLabel = mobileWeb ? "New" : "New to you"
  const appliedCount = countModalFilters(filters)
  const skipHomeEntrance = useState(() => skipChipEntranceForPreview(previewState))[0]
  const skipMotion =
    skipHomeEntrance ||
    previewState === "scrolled" ||
    (platform === "desktop" && layout === "inline")

  const showOnboarding = !appMode
  const [chipsReady, setChipsReady] = useState(skipMotion)

  useEffect(() => {
    if (skipMotion) {
      setChipsReady(true)
      return
    }
    setChipsReady(false)
  }, [skipMotion, previewState])

  const personalised = (
    <>
      <VersionBFilterOnboardingTooltip
        enabled={showOnboarding}
        chipsReady={chipsReady}
        previewState={previewState}
      >
        <PersonalisedChip
          label={ntyLabel}
          active={filters.newToYou}
          onToggle={() => {
            if (
              !filters.newToYou &&
              isBlankSearchWithoutOtherFilters(search, filters) &&
              filters.strongApplicant
            ) {
              applyFilters({ newToYou: true, strongApplicant: false })
              scrollSearchResultsToTop()
              return
            }
            toggleSmartFilter("newToYou")
          }}
          showNtyDot={smartFilterCounts.newToYou > 0 && hasUnseenNewToYouOnPage}
          appMode={appMode}
          compactNavy={compactNavy}
        />
      </VersionBFilterOnboardingTooltip>
      <PersonalisedChip
        label="Strong applicant"
        active={
          filters.strongApplicant &&
          !isBlankSearchWithoutOtherFilters(search, filters)
        }
        ariaChecked={filters.strongApplicant}
        onToggle={() => {
          if (isBlankSearchWithoutOtherFilters(search, filters)) {
            if (filters.strongApplicant) {
              scrollSearchResultsToTop()
              return
            }
            applyFilters({ strongApplicant: true })
            return
          }
          toggleSmartFilter("strongApplicant")
        }}
        showDiamond
        appMode={appMode}
        compactNavy={compactNavy}
      />
    </>
  )

  const fixedPills = <VersionBFixedFilterPills filterState={filterState} />

  if (layout === "expanded" && !appMode) {
    return (
      <FilterChipRow
        personalised={personalised}
        trailing={fixedPills}
        skipMotion={skipMotion}
        onChipEntranceComplete={() => setChipsReady(true)}
      />
    )
  }

  if (appMode) {
    return (
      <div className="flex min-w-0 items-center gap-3 overflow-visible">
        {personalised}
      </div>
    )
  }

  return (
    <FilterChipRow
      personalised={personalised}
      skipMotion={skipMotion}
      compactNavy={compactNavy}
      onChipEntranceComplete={() => setChipsReady(true)}
      trailing={
        <MoreChip
          appliedCount={appliedCount}
          onClick={onMoreClick}
          compactNavy={compactNavy}
        />
      }
    />
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
      className={cn("relative overflow-visible px-4 py-4 md:px-0", className)}
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
