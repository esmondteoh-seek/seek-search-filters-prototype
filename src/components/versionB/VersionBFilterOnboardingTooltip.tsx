import { IconClose, IconFilter } from "@/components/braid/icons"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { useVersionBSerpOnboarding } from "@/src/hooks/useVersionBSerpOnboarding"
import { useMountTransition } from "@/src/hooks/useMountTransition"
import { VERSION_B_SERP_SEARCH_EVENT } from "@/src/lib/versionBSerpEvents"
import { motionTokens } from "@/src/lib/motionTokens"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

/** Figma color/background/info — distinct from navy band */
const TOOLTIP_BG = "#1D559D"
const TOOLTIP_MAX_WIDTH = 330
const FRAME_PADDING = 16
const ONBOARDING_DELAY_MS = 3000

const BLOCKED_ONBOARDING_SCENARIOS = new Set<VersionBPreviewState>([
  "filter-transition",
  "blank",
  "selected",
  "scrolled",
])

function canShowProductOnboarding(
  previewState: VersionBPreviewState,
  shouldShow: boolean,
): boolean {
  if (previewState === "onboarding") return true
  if (BLOCKED_ONBOARDING_SCENARIOS.has(previewState)) return false
  return shouldShow
}

interface VersionBFilterOnboardingTooltipProps {
  children: ReactNode
  enabled?: boolean
  /** Wait until personalised chips finish their entrance animation */
  chipsReady?: boolean
  previewState?: VersionBPreviewState
}

function findPhoneFrame(anchor: HTMLElement | null): HTMLElement | null {
  return anchor?.closest("[data-phone-frame]") ?? null
}

function useTooltipPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    caretLeft: 24,
    contained: false,
    maxWidth: TOOLTIP_MAX_WIDTH,
  })
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!open || !anchorRef.current) return

    const update = () => {
      const anchor = anchorRef.current!
      const rect = anchor.getBoundingClientRect()
      const frame = findPhoneFrame(anchor)
      const contained = Boolean(frame)
      const bounds = frame
        ? frame.getBoundingClientRect()
        : {
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
          }

      let bandBottom = bounds.top
      let el: HTMLElement | null = anchor
      while (el) {
        if (el.tagName === "SECTION") {
          bandBottom = el.getBoundingClientRect().bottom
          break
        }
        el = el.parentElement
      }

      const topViewport = Math.max(rect.bottom + 8, bandBottom + 12)
      const boundsWidth = bounds.right - bounds.left
      const maxWidth = Math.min(TOOLTIP_MAX_WIDTH, boundsWidth - FRAME_PADDING * 2)
      const maxLeftViewport = bounds.right - maxWidth - FRAME_PADDING
      const leftViewport = Math.max(
        bounds.left + FRAME_PADDING,
        Math.min(rect.left, maxLeftViewport),
      )
      const caretLeft = Math.max(16, Math.min(rect.left - leftViewport + 24, maxWidth - 32))

      setPortalTarget(contained ? frame : document.body)
      setPosition({
        top: contained ? topViewport - bounds.top : topViewport,
        left: contained ? leftViewport - bounds.left : leftViewport,
        caretLeft,
        contained,
        maxWidth,
      })
    }

    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [open, anchorRef])

  return { ...position, portalTarget }
}

function FilterTooltipBubble({
  open,
  position,
  portalTarget,
  onDismiss,
  showDismiss,
  spotlight,
}: {
  open: boolean
  position: {
    top: number
    left: number
    caretLeft: number
    contained: boolean
    maxWidth: number
  }
  portalTarget: HTMLElement | null
  onDismiss?: () => void
  showDismiss?: boolean
  spotlight?: VersionBPreviewState
}) {
  const reduceMotion = useReducedMotion()
  const { mounted, visible, durationMs } = useMountTransition(open, 350)

  useEffect(() => {
    if (!open || !onDismiss) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onDismiss])

  if (!mounted || !portalTarget) return null

  return createPortal(
    <motion.div
      role="status"
      aria-live="polite"
      data-vb-spotlight={spotlight}
      className={cn(
        position.contained ? "absolute" : "fixed",
        "z-[120] w-max drop-shadow-[0_4px_4px_rgba(46,56,73,0.25)]",
        position.contained
          ? "max-w-[calc(100%-2rem)]"
          : "max-w-[min(calc(100vw-2rem),330px)]",
      )}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: position.maxWidth,
      }}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : durationMs / 1000, ease: motionTokens.ease.out }}
    >
      <div
        className="absolute -top-2 h-0 w-0 border-x-[10px] border-b-[10px] border-x-transparent"
        style={{ left: position.caretLeft, borderBottomColor: TOOLTIP_BG }}
        aria-hidden
      />
      <div
        role={onDismiss ? "button" : undefined}
        tabIndex={onDismiss ? 0 : undefined}
        onClick={onDismiss}
        onKeyDown={
          onDismiss
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onDismiss()
                }
              }
            : undefined
        }
        className={cn(
          "flex items-center gap-3 rounded-2xl p-4 text-white",
          onDismiss && "cursor-pointer",
        )}
        style={{ backgroundColor: TOOLTIP_BG }}
      >
        <IconFilter className="h-6 w-6 shrink-0" aria-hidden />
        <p className="min-w-0 flex-1 text-sm font-medium leading-[21px]">
          Use filters to find the right jobs for you.
        </p>
        {showDismiss ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDismiss?.()
            }}
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Dismiss"
          >
            <IconClose className="h-[18px] w-[18px]" aria-hidden />
          </button>
        ) : null}
      </div>
    </motion.div>,
    portalTarget,
  )
}

/** Onboarding-scenario tooltip anchored under New to you (desktop + mobile-web) */
export function VersionBFilterOnboardingTooltip({
  children,
  enabled = true,
  chipsReady = true,
  previewState = "filters",
}: VersionBFilterOnboardingTooltipProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { dismiss, shouldShow } = useVersionBSerpOnboarding()
  const [onboardingVisible, setOnboardingVisible] = useState(false)
  const [onboardingEpoch, setOnboardingEpoch] = useState(0)

  const eligible = enabled && chipsReady && canShowProductOnboarding(previewState, shouldShow)

  useEffect(() => {
    if (!eligible) {
      setOnboardingVisible(false)
      return
    }

    setOnboardingVisible(false)
    const delay = reduceMotion ? 0 : ONBOARDING_DELAY_MS
    const timer = window.setTimeout(() => setOnboardingVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [eligible, onboardingEpoch, reduceMotion, previewState])

  useEffect(() => {
    const onReplay = (event: Event) => {
      const detail = (event as CustomEvent<VersionBPreviewState>).detail
      if (detail === "onboarding") {
        setOnboardingEpoch((epoch) => epoch + 1)
      }
    }
    window.addEventListener("vb-scenario-replay", onReplay)
    return () => window.removeEventListener("vb-scenario-replay", onReplay)
  }, [])

  const handleDismiss = useCallback(() => {
    dismiss()
    setOnboardingVisible(false)
  }, [dismiss])

  useEffect(() => {
    if (!onboardingVisible) return
    const onSearch = () => handleDismiss()
    window.addEventListener(VERSION_B_SERP_SEARCH_EVENT, onSearch)
    return () => window.removeEventListener(VERSION_B_SERP_SEARCH_EVENT, onSearch)
  }, [onboardingVisible, handleDismiss])

  const showOnboardingBubble = eligible && onboardingVisible
  const { portalTarget, ...position } = useTooltipPosition(showOnboardingBubble, anchorRef)

  return (
    <div ref={anchorRef} className="relative shrink-0">
      {children}
      <FilterTooltipBubble
        open={showOnboardingBubble}
        position={position}
        portalTarget={portalTarget}
        onDismiss={handleDismiss}
        showDismiss
        spotlight={previewState === "onboarding" ? "onboarding" : undefined}
      />
    </div>
  )
}
