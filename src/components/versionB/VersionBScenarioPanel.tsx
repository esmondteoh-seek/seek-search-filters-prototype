import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  VERSION_B_SCENARIO_OPTIONS,
  type VersionBPreviewState,
} from "@/src/data/versionBPresets"

const COLLAPSED_KEY = "vb-scenario-panel-collapsed"

interface VersionBScenarioPanelProps {
  previewState: VersionBPreviewState
  onPreviewStateChange: (next: VersionBPreviewState) => void
}

const panelCardClass = cn(
  "rounded-2xl px-3 py-2.5 shadow-lg ring-1 ring-white/10",
  "bg-[#1a1a2e]/95 text-white backdrop-blur-sm",
)

/** Left-side Version B scenario toggles — Figma Q1 FY27 share-out states */
export function VersionBScenarioPanel({
  previewState,
  onPreviewStateChange,
}: VersionBScenarioPanelProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return sessionStorage.getItem(COLLAPSED_KEY) === "1"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0")
    } catch {
      /* sessionStorage unavailable */
    }
  }, [collapsed])

  const handleSelect = useCallback(
    (next: VersionBPreviewState) => {
      onPreviewStateChange(next)
    },
    [onPreviewStateChange],
  )

  if (collapsed) {
    return (
      <div
        className="fixed bottom-6 left-4 z-[200] sm:bottom-8 sm:left-6"
        aria-label="Version B scenario controls"
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className={cn(
            "flex h-11 items-center justify-center rounded-full px-3",
            "bg-[#1a1a2e] text-xs font-semibold text-white shadow-lg ring-1 ring-white/10",
            "hover:bg-[#252545] focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
          aria-label="Expand Version B scenario controls"
          title="Scenario controls"
        >
          Scenarios
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-6 left-4 z-[200] sm:bottom-8 sm:left-6"
      aria-label="Version B scenario controls"
    >
      <div
        className={cn(
          "flex w-[min(100vw-2rem,320px)] max-h-[min(70vh,480px)] flex-col gap-2 overflow-hidden",
          panelCardClass,
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-white/50">
            Scenario
          </span>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Minimize scenario controls"
            title="Minimize"
          >
            <span aria-hidden className="block text-sm leading-none">
              −
            </span>
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          role="radiogroup"
          aria-label="Version B scenario"
        >
          <div className="flex flex-col gap-1">
            {VERSION_B_SCENARIO_OPTIONS.map(({ value, label }) => {
              const active = previewState === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    if (active) {
                      window.dispatchEvent(
                        new CustomEvent("vb-scenario-replay", { detail: value }),
                      )
                    }
                    handleSelect(value)
                  }}
                  className={cn(
                    "rounded-lg px-2.5 py-2 text-left transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a2e]",
                    active
                      ? "bg-white text-[#1a1a2e] shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="block text-[11px] font-medium leading-snug">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
