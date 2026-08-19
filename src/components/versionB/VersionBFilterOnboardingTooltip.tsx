import { IconClose, IconFilter } from "@/components/braid/icons"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { useVersionBSerpOnboarding } from "@/src/hooks/useVersionBSerpOnboarding"
import { useMountTransition } from "@/src/hooks/useMountTransition"
import { motionTokens } from "@/src/lib/motionTokens"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

/** Figma color/background/info — distinct from navy band */
const TOOLTIP_BG = "#1D559D"
const TOOLTIP_MAX_WIDTH = 330
const VIEWPORT_PADDING = 8

interface VersionBFilterOnboardingTooltipProps {
  children: ReactNode
  enabled?: boolean
  /** Wait until personalised chips finish their entrance animation */
  chipsReady?: boolean
  previewState?: VersionBPreviewState
}

function useTooltipPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
) {
  const [position, setPosition] = useState({ top: 0, left: 0, caretLeft: 24 })

  useEffect(() => {
    if (!open || !anchorRef.current) return

    const update = () => {
      const rect = anchorRef.current!.getBoundingClientRect()
      let bandBottom = 0
      let el: HTMLElement | null = anchorRef.current
      while (el) {
        if (el.tagName === "SECTION") {
          bandBottom = el.getBoundingClientRect().bottom
          break
        }
        el = el.parentElement
      }
      const top = Math.max(rect.bottom + 8, bandBottom + 12)
      const maxLeft = window.innerWidth - TOOLTIP_MAX_WIDTH - VIEWPORT_PADDING
      const left = Math.max(VIEWPORT_PADDING, Math.min(rect.left, maxLeft))
      const caretLeft = Math.max(16, Math.min(rect.left - left + 24, TOOLTIP_MAX_WIDTH - 32))
      setPosition({ top, left, caretLeft })
    }

    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [open, anchorRef])

  return position
}

function FilterTooltipBubble({
  open,
  position,
  onDismiss,
  showDismiss,
}: {
  open: boolean
  position: { top: number; left: number; caretLeft: number }
  onDismiss?: () => void
  showDismiss?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const { mounted, visible, durationMs } = useMountTransition(open, 350)

  if (!mounted) return null

  return createPortal(
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed z-[120] w-max max-w-[min(calc(100vw-1rem),330px)] drop-shadow-[0_4px_4px_rgba(46,56,73,0.25)]"
      style={{ top: position.top, left: position.left }}
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
    document.body,
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
  const { dismiss } = useVersionBSerpOnboarding()
  const [onboardingVisible, setOnboardingVisible] = useState(false)

  const forceOnboarding = previewState === "onboarding"
  const ready = chipsReady || forceOnboarding

  useEffect(() => {
    if (!enabled || !ready) {
      setOnboardingVisible(false)
      return
    }
    setOnboardingVisible(forceOnboarding)
  }, [enabled, ready, forceOnboarding])

  const handleDismiss = () => {
    dismiss()
    setOnboardingVisible(false)
  }

  const showOnboardingBubble = enabled && onboardingVisible
  const position = useTooltipPosition(showOnboardingBubble, anchorRef)

  return (
    <div ref={anchorRef} className="relative shrink-0">
      {children}
      <FilterTooltipBubble
        open={showOnboardingBubble}
        position={position}
        onDismiss={handleDismiss}
        showDismiss
      />
    </div>
  )
}
