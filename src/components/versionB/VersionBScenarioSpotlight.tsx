import { IconClose } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import {
  VERSION_B_SCENARIO_OPTIONS,
  type VersionBPreviewState,
  type VersionBScenarioNote,
} from "@/src/data/versionBPresets"
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"

const SPOTLIGHT_PAD = 10
const HOLE_RADIUS = 12
const ROOT_SELECTOR = ".vb-scenario-root"
const SPOTLIGHT_DELAY_MS = 2500
const CHROME_FADE_MS = 2000
const TOOLTIP_MAX_WIDTH = 320
const FRAME_PADDING = 16
const TOOLTIP_GAP = 12

type SpotlightHole = {
  x: number
  y: number
  width: number
  height: number
}

function padRect(rect: DOMRect): SpotlightHole {
  return {
    x: rect.left - SPOTLIGHT_PAD,
    y: rect.top - SPOTLIGHT_PAD,
    width: rect.width + SPOTLIGHT_PAD * 2,
    height: rect.height + SPOTLIGHT_PAD * 2,
  }
}

function unionHole(holes: SpotlightHole[]): SpotlightHole | null {
  if (holes.length === 0) return null
  const x = Math.min(...holes.map((h) => h.x))
  const y = Math.min(...holes.map((h) => h.y))
  const right = Math.max(...holes.map((h) => h.x + h.width))
  const bottom = Math.max(...holes.map((h) => h.y + h.height))
  return { x, y, width: right - x, height: bottom - y }
}

/** Merge overlapping or adjacent holes so cutouts stay rectangular */
function mergeHoles(holes: SpotlightHole[]): SpotlightHole[] {
  if (holes.length <= 1) return holes

  const merged = [...holes]
  let changed = true

  while (changed) {
    changed = false
    outer: for (let i = 0; i < merged.length; i++) {
      for (let j = i + 1; j < merged.length; j++) {
        const a = merged[i]
        const b = merged[j]
        const overlapX = a.x <= b.x + b.width && b.x <= a.x + a.width
        const overlapY = a.y <= b.y + b.height && b.y <= a.y + a.height
        if (overlapX && overlapY) {
          const x = Math.min(a.x, b.x)
          const y = Math.min(a.y, b.y)
          const right = Math.max(a.x + a.width, b.x + b.width)
          const bottom = Math.max(a.y + a.height, b.y + b.height)
          merged[i] = { x, y, width: right - x, height: bottom - y }
          merged.splice(j, 1)
          changed = true
          break outer
        }
      }
    }
  }

  return merged
}

function ScenarioNotesContent({ notes }: { notes: VersionBScenarioNote[] }) {
  return (
    <div className="space-y-2.5">
      {notes.map((block) => (
        <div key={block.title ?? block.items[0]}>
          {block.title ? (
            <p className="mb-1 text-xs font-semibold leading-snug text-white">{block.title}</p>
          ) : null}
          <ul className="list-disc space-y-0.5 pl-4 text-xs font-normal leading-snug text-white/80">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

interface VersionBScenarioSpotlightProps {
  previewState: VersionBPreviewState
}

/** Darkens and blurs the SERP while spotlighting the active scenario target */
export function VersionBScenarioSpotlight({ previewState }: VersionBScenarioSpotlightProps) {
  const maskId = useId().replace(/:/g, "")
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [holes, setHoles] = useState<SpotlightHole[]>([])
  const [spotlightReady, setSpotlightReady] = useState(false)
  const [chromeVisible, setChromeVisible] = useState(false)
  const [spotlightEpoch, setSpotlightEpoch] = useState(0)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const [tooltipLayout, setTooltipLayout] = useState({
    top: 0,
    left: 0,
    caretLeft: 24,
    maxWidth: TOOLTIP_MAX_WIDTH,
    contained: false,
  })
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  const scenarioNotes = useMemo(
    () => VERSION_B_SCENARIO_OPTIONS.find((option) => option.value === previewState)?.notes ?? [],
    [previewState],
  )

  const tooltipLabel =
    scenarioNotes[0]?.title ?? scenarioNotes[0]?.items[0] ?? "Scenario notes"
  const tooltipLabelId = `vb-scenario-tip-${previewState}`

  const anchorHole = useMemo(() => unionHole(holes), [holes])

  const resetScenarioSpotlight = useCallback(() => {
    setSpotlightReady(false)
    setChromeVisible(false)
    setTooltipDismissed(false)
    setSpotlightEpoch((epoch) => epoch + 1)
  }, [])

  useEffect(() => {
    resetScenarioSpotlight()
  }, [previewState, resetScenarioSpotlight])

  useEffect(() => {
    const onReplay = () => resetScenarioSpotlight()
    window.addEventListener("vb-scenario-replay", onReplay)
    return () => window.removeEventListener("vb-scenario-replay", onReplay)
  }, [resetScenarioSpotlight])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSpotlightReady(true)
      setChromeVisible(true)
    }, SPOTLIGHT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [previewState, spotlightEpoch])

  useEffect(() => {
    if (!chromeVisible) return
    const timer = window.setTimeout(() => setChromeVisible(false), CHROME_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [chromeVisible, previewState, spotlightEpoch])

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(ROOT_SELECTOR)
    if (!root) return
    root.dataset.vbSpotlightChrome = spotlightReady && chromeVisible ? "on" : "off"
    return () => {
      delete root.dataset.vbSpotlightChrome
    }
  }, [spotlightReady, chromeVisible])

  const update = useCallback(() => {
    setViewport({ width: window.innerWidth, height: window.innerHeight })

    const nodes = document.querySelectorAll<HTMLElement>(
      `[data-vb-spotlight="${previewState}"]`,
    )
    const rects = Array.from(nodes)
      .map((node) => node.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0)

    setHoles(mergeHoles(rects.map(padRect)))
  }, [previewState])

  useLayoutEffect(() => {
    update()

    const root = document.querySelector(ROOT_SELECTOR) ?? document.body
    const observers: ResizeObserver[] = []

    const observeTargets = () => {
      observers.forEach((observer) => observer.disconnect())
      observers.length = 0

      document.querySelectorAll<HTMLElement>(`[data-vb-spotlight="${previewState}"]`).forEach((node) => {
        const observer = new ResizeObserver(update)
        observer.observe(node)
        observers.push(observer)
      })
    }

    observeTargets()
    const mutationObserver = new MutationObserver(() => {
      observeTargets()
      update()
    })

    mutationObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-vb-spotlight", "class", "style"],
    })

    if (root !== document.body) {
      mutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-vb-spotlight", "class", "style"],
      })
    }

    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)

    return () => {
      mutationObserver.disconnect()
      observers.forEach((observer) => observer.disconnect())
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [previewState, update])

  useLayoutEffect(() => {
    if (tooltipDismissed || !spotlightReady || !anchorHole) {
      setPortalTarget(null)
      return
    }

    const nodes = document.querySelectorAll<HTMLElement>(
      `[data-vb-spotlight="${previewState}"]`,
    )
    const frame =
      Array.from(nodes)
        .map((node) => node.closest<HTMLElement>("[data-phone-frame]"))
        .find(Boolean) ?? null

    const contained = Boolean(frame)
    const bounds = frame
      ? frame.getBoundingClientRect()
      : {
          top: 0,
          left: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }

    const topViewport = anchorHole.y + anchorHole.height + TOOLTIP_GAP
    const boundsWidth = bounds.right - bounds.left
    const maxWidth = Math.min(TOOLTIP_MAX_WIDTH, boundsWidth - FRAME_PADDING * 2)
    const holeCenter = anchorHole.x + anchorHole.width / 2
    const preferredLeft = holeCenter - maxWidth / 2
    const maxLeftViewport = bounds.right - maxWidth - FRAME_PADDING
    const leftViewport = Math.max(
      bounds.left + FRAME_PADDING,
      Math.min(preferredLeft, maxLeftViewport),
    )
    const caretLeft = Math.max(16, Math.min(holeCenter - leftViewport - 10, maxWidth - 32))

    setPortalTarget(contained ? frame : document.body)
    setTooltipLayout({
      top: contained ? topViewport - bounds.top : topViewport,
      left: contained ? leftViewport - bounds.left : leftViewport,
      caretLeft,
      maxWidth,
      contained,
    })
  }, [anchorHole, previewState, spotlightReady, tooltipDismissed, holes])

  useEffect(() => {
    if (tooltipDismissed) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTooltipDismissed(true)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [tooltipDismissed])

  if (viewport.width === 0 || viewport.height === 0) return null

  const maskUrl = `url(#${maskId})`
  const showTooltip =
    spotlightReady && !tooltipDismissed && Boolean(anchorHole) && scenarioNotes.length > 0
  const showChrome = spotlightReady && chromeVisible

  const tooltip =
    showTooltip && portalTarget
      ? createPortal(
          <div
            role="dialog"
            aria-labelledby={tooltipLabelId}
            className={cn(
              tooltipLayout.contained ? "absolute" : "fixed",
              "z-[195] w-max max-w-[min(calc(100vw-2rem),320px)]",
            )}
            style={{
              top: tooltipLayout.top,
              left: tooltipLayout.left,
              maxWidth: tooltipLayout.maxWidth,
            }}
          >
            <div
              className="absolute -top-2 h-0 w-0 border-x-[10px] border-b-[10px] border-x-transparent border-b-[#1a1a2e]"
              style={{ left: tooltipLayout.caretLeft }}
              aria-hidden
            />
            <div
              className={cn(
                "rounded-2xl px-4 py-3 shadow-lg ring-1 ring-white/10",
                "bg-[#1a1a2e]/95 text-white backdrop-blur-sm",
              )}
            >
              <p id={tooltipLabelId} className="sr-only">
                {tooltipLabel}
              </p>
              <div className="mb-2 flex items-start justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTooltipDismissed(true)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Dismiss"
                >
                  <IconClose className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <ScenarioNotesContent notes={scenarioNotes} />
            </div>
          </div>,
          portalTarget,
        )
      : null

  return (
    <>
      <svg className="pointer-events-none fixed inset-0 z-[180] h-0 w-0" aria-hidden>
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={viewport.width}
            height={viewport.height}
          >
            <rect x="0" y="0" width={viewport.width} height={viewport.height} fill="white" />
            {holes.map((hole, index) => (
              <rect
                key={index}
                x={hole.x}
                y={hole.y}
                width={hole.width}
                height={hole.height}
                rx={HOLE_RADIUS}
                ry={HOLE_RADIUS}
                fill="black"
              />
            ))}
          </mask>
        </defs>
      </svg>
      <div
        className={cn(
          "vb-scenario-spotlight-backdrop pointer-events-none fixed inset-0 z-[180]",
          !showChrome && "vb-scenario-spotlight-backdrop--faded",
        )}
        style={{
          mask: maskUrl,
          WebkitMask: maskUrl,
        }}
        aria-hidden
      />
      {tooltip}
    </>
  )
}
