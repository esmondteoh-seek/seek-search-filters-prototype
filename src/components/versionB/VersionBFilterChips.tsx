import { IconFilter } from "@/components/braid/icons"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { NtyDot, StrongApplicantIcon } from "@/src/components/versionB/VersionBIcons"
import { VersionBFixedFilterPills } from "@/src/components/versionB/VersionBFixedFilterPills"
import { VersionBFilterOnboardingTooltip } from "@/src/components/versionB/VersionBFilterOnboardingTooltip"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import { countModalFilters } from "@/src/hooks/useJobFilters"
import { FilterSurfaceButton, filterPillThemes } from "@/src/components/motion/FilterSurfaceButton"
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

function skipChipEntranceForPreview(
  preview: VersionBPreviewState,
  platform: VersionBPlatform,
): boolean {
  if (platform === "app") return true
  if (preview === "scrolled") return true
  if (preview === "filter-transition") return false
  return !consumeVersionBHomeMoreOptions()
}

function vbSpotlightAttr(
  previewState: VersionBPreviewState,
  target: VersionBPreviewState,
): VersionBPreviewState | undefined {
  return previewState === target ? target : undefined
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

const chipEntranceEase = [0.25, 0.1, 0.25, 1] as const
const chipEntranceTween = { duration: 0.6, ease: chipEntranceEase }

/** Personalised chips slide in from the left and push fixed filters right on mount */
function AnimatedPersonalisedFilters({
  children,
  onEntranceComplete,
  skipEntrance = false,
  compactNavy = false,
  spotlight,
}: {
  children: ReactNode
  onEntranceComplete?: () => void
  skipEntrance?: boolean
  compactNavy?: boolean
  spotlight?: VersionBPreviewState
}) {
  const gapClass = compactNavy ? "gap-2" : "gap-3"
  const reduceMotion = useReducedMotion()
  const measureRef = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(
    reduceMotion || skipEntrance ? 0 : null,
  )
  const [revealed, setRevealed] = useState(Boolean(reduceMotion || skipEntrance))
  const [entranceDone, setEntranceDone] = useState(Boolean(reduceMotion || skipEntrance))
  const completeRef = useRef(onEntranceComplete)
  completeRef.current = onEntranceComplete

  useLayoutEffect(() => {
    if (skipEntrance || reduceMotion) return
    const node = measureRef.current
    if (!node) return

    const measure = () => setMeasuredWidth(node.scrollWidth)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [skipEntrance, reduceMotion, children])

  useEffect(() => {
    if (skipEntrance || reduceMotion) {
      completeRef.current?.()
      return
    }
    if (measuredWidth === null) return
    setRevealed(false)
    setEntranceDone(false)
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [skipEntrance, reduceMotion, measuredWidth])

  if (skipEntrance || reduceMotion) {
    return (
      <div
        className={cn("flex w-max shrink-0 items-center", gapClass)}
        data-vb-spotlight={spotlight}
      >
        {children}
      </div>
    )
  }

  if (measuredWidth === null) {
    return (
      <div
        ref={measureRef}
        className={cn(
          "pointer-events-none invisible absolute flex w-max shrink-0 items-center",
          gapClass,
        )}
        aria-hidden
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      data-vb-spotlight={spotlight}
      className={cn("shrink-0", entranceDone ? "overflow-visible" : "overflow-hidden")}
      initial={false}
      animate={{ width: revealed ? measuredWidth : 0 }}
      transition={{ width: chipEntranceTween }}
      onAnimationComplete={() => {
        if (revealed) {
          setEntranceDone(true)
          completeRef.current?.()
        }
      }}
    >
      <motion.div
        className={cn("flex w-max items-center", gapClass)}
        initial={false}
        animate={{
          opacity: revealed ? 1 : 0,
          x: revealed ? 0 : -28,
        }}
        transition={{
          opacity: chipEntranceTween,
          x: chipEntranceTween,
        }}
      >
        {children}
      </motion.div>
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
  rowKey,
  rowSpotlight,
  personalisedSpotlight,
}: {
  personalised: ReactNode
  trailing: ReactNode
  className?: string
  onChipEntranceComplete?: () => void
  skipMotion?: boolean
  compactNavy?: boolean
  rowKey?: string
  rowSpotlight?: VersionBPreviewState
  personalisedSpotlight?: VersionBPreviewState
}) {
  const rowClass = cn(
    "flex min-w-0 items-center gap-3",
    compactNavy
      ? "flex-nowrap overflow-x-auto hide-scrollbar filter-scroll-fade-right -mx-5 scroll-px-5 px-5"
      : "flex-wrap overflow-visible",
    compactNavy && "gap-2",
    className,
  )

  const trailingContent = skipMotion ? (
    trailing
  ) : (
    <motion.div layout="position" className="min-w-0 shrink-0">
      {trailing}
    </motion.div>
  )

  const rowContent = (
    <>
      <AnimatedPersonalisedFilters
        skipEntrance={skipMotion}
        compactNavy={compactNavy}
        onEntranceComplete={onChipEntranceComplete}
        spotlight={personalisedSpotlight}
      >
        {personalised}
      </AnimatedPersonalisedFilters>
      {trailingContent}
      {compactNavy ? <span className="w-5 shrink-0" aria-hidden /> : null}
    </>
  )

  return (
    <div
      key={rowKey}
      data-vb-spotlight={rowSpotlight}
      className={rowClass}
      style={compactNavy ? { WebkitOverflowScrolling: "touch" } : undefined}
    >
      {rowContent}
    </div>
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
  const [skipHomeEntrance, setSkipHomeEntrance] = useState(() =>
    skipChipEntranceForPreview(previewState, platform),
  )
  const [entranceKey, setEntranceKey] = useState(0)
  const [hasPlayedEntrance, setHasPlayedEntrance] = useState(() =>
    skipChipEntranceForPreview(previewState, platform),
  )

  useEffect(() => {
    const skip = skipChipEntranceForPreview(previewState, platform)
    setSkipHomeEntrance(skip)
    if (skip) setHasPlayedEntrance(true)
  }, [previewState, platform])

  useEffect(() => {
    const onReplay = (event: Event) => {
      const detail = (event as CustomEvent<VersionBPreviewState>).detail
      if (detail === "filter-transition") {
        setHasPlayedEntrance(false)
        setEntranceKey((key) => key + 1)
      }
    }
    window.addEventListener("vb-scenario-replay", onReplay)
    return () => window.removeEventListener("vb-scenario-replay", onReplay)
  }, [])

  const chipRowKey =
    previewState === "filter-transition" ? `filter-transition-${entranceKey}` : undefined

  const rowSpotlight =
    previewState === "selected" || previewState === "scrolled" ? previewState : undefined
  const fixedFiltersSpotlight = vbSpotlightAttr(previewState, "filters")
  const personalisedSpotlight = vbSpotlightAttr(previewState, "filter-transition")
  const blankSaSpotlight = vbSpotlightAttr(previewState, "blank")

  const skipMotion =
    skipHomeEntrance ||
    hasPlayedEntrance ||
    previewState === "scrolled" ||
    (platform === "desktop" && layout === "inline")

  const handleChipEntranceComplete = () => {
    setHasPlayedEntrance(true)
    setChipsReady(true)
  }

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
      <div data-vb-spotlight={blankSaSpotlight} className="shrink-0">
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
      </div>
    </>
  )

  const fixedPills = (
    <div
      data-vb-spotlight={layout === "expanded" && !appMode ? fixedFiltersSpotlight : undefined}
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-3",
        layout === "expanded" && !appMode && compactNavy && "gap-2",
      )}
    >
      <VersionBFixedFilterPills filterState={filterState} />
    </div>
  )

  if (layout === "expanded" && !appMode) {
    return (
      <FilterChipRow
        rowKey={chipRowKey}
        rowSpotlight={rowSpotlight}
        personalisedSpotlight={personalisedSpotlight}
        personalised={personalised}
        trailing={fixedPills}
        skipMotion={skipMotion}
        onChipEntranceComplete={handleChipEntranceComplete}
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

  const moreChip = (
    <div data-vb-spotlight={fixedFiltersSpotlight} className="shrink-0">
      <MoreChip
        appliedCount={appliedCount}
        onClick={onMoreClick}
        compactNavy={compactNavy}
      />
    </div>
  )

  return (
    <FilterChipRow
      rowKey={chipRowKey}
      rowSpotlight={rowSpotlight}
      personalisedSpotlight={personalisedSpotlight}
      personalised={personalised}
      skipMotion={skipMotion}
      compactNavy={compactNavy}
      onChipEntranceComplete={handleChipEntranceComplete}
      trailing={moreChip}
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
