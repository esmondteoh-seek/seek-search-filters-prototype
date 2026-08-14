import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { getConceptById } from "@/src/concepts/index"
import { navigateToLibrary } from "@/src/hooks/useLibraryNavigation"
import { getFolderForConcept } from "@/src/prototype/library"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import { useViewportBreakpoint } from "@/src/hooks/useViewportBreakpoint"
import { buildShareUrl } from "@/src/hooks/shareEntry"
import { useFutureVisionExplainability } from "@/src/components/futureVision/FutureVisionExplainability"

const COLLAPSED_KEY = "seek-prototype-chrome-collapsed"

interface PrototypeChromeProps {
  conceptId: string
  platform?: VersionBPlatform
  onPlatformChange?: (platform: VersionBPlatform) => void
}

const PLATFORMS: {
  value: VersionBPlatform
  label: string
  shortLabel: string
  Icon: ({ active }: { active: boolean }) => ReactNode
}[] = [
  {
    value: "desktop",
    label: "Desktop",
    shortLabel: "Desktop",
    Icon: PlatformDesktopIcon,
  },
  {
    value: "mobile-web",
    label: "Mobile web",
    shortLabel: "Web",
    Icon: PlatformMobileWebIcon,
  },
  {
    value: "app",
    label: "App",
    shortLabel: "App",
    Icon: PlatformAppIcon,
  },
]

function PlatformDesktopIcon({ active }: { active: boolean }) {
  const color = active ? "#1a1a2e" : "currentColor"
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="1.5" stroke={color} strokeWidth="1.75" />
      <path d="M9 20h6" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 16v4" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function PlatformMobileWebIcon({ active }: { active: boolean }) {
  const color = active ? "#1a1a2e" : "currentColor"
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" stroke={color} strokeWidth="1.75" />
      <path d="M10 5h4" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <rect x="9" y="7" width="6" height="9" rx="0.5" stroke={color} strokeWidth="1.25" />
      <circle cx="12" cy="19" r="0.75" fill={color} />
    </svg>
  )
}

function PlatformAppIcon({ active }: { active: boolean }) {
  const color = active ? "#1a1a2e" : "currentColor"
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" stroke={color} strokeWidth="1.75" />
      <path d="M10 5h4" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M12 8.5 9.5 11h5L12 8.5Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="19" r="0.75" fill={color} />
    </svg>
  )
}

/** Prototype chrome — back to library, platform toggles (Version B) */
export function PrototypeChrome({
  conceptId,
  platform = "desktop",
  onPlatformChange,
}: PrototypeChromeProps) {
  const { label: viewportLabel } = useViewportBreakpoint()
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem(COLLAPSED_KEY)
    return stored !== "0"
  })
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeConcept = getConceptById(conceptId)
  const isFutureVision = conceptId === "future-vision"
  const explain = useFutureVisionExplainability()
  const showPlatformControls =
    (conceptId === "version-b" || conceptId === "future-vision") && onPlatformChange
  const activePlatform = PLATFORMS.find((p) => p.value === platform) ?? PLATFORMS[0]

  useEffect(() => {
    sessionStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0")
  }, [collapsed])

  const handleBack = useCallback(() => {
    const folder = getFolderForConcept(conceptId)
    navigateToLibrary(folder)
  }, [conceptId])

  const handleCopyShareLink = useCallback(async () => {
    const shareUrl = buildShareUrl(
      conceptId,
      conceptId === "version-b" || conceptId === "future-vision" ? platform : undefined,
    )
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Copy share link", shareUrl)
    }
  }, [conceptId, platform])

  const anchorClass =
    "fixed bottom-6 right-4 z-[200] flex flex-col items-end gap-2 sm:bottom-8 sm:right-6"

  if (collapsed) {
    return (
      <div className={anchorClass} aria-label="Prototype controls">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className={cn(
            "flex h-11 items-center justify-center gap-1.5 rounded-full px-3",
            "bg-[#1a1a2e] text-xs font-semibold text-white shadow-lg ring-1 ring-white/10",
            "hover:bg-[#252545] focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
          title="Expand prototype controls"
          aria-label={`Expand prototype controls — ${activeConcept?.label ?? conceptId}`}
        >
          {showPlatformControls ? (
            <>
              <activePlatform.Icon active />
              <span className="hidden sm:inline">{activePlatform.shortLabel}</span>
            </>
          ) : (
            "···"
          )}
        </button>
      </div>
    )
  }

  return (
    <div
      ref={menuRef}
      className={cn(anchorClass, "max-w-[min(100vw-2rem,420px)]")}
      aria-label="Prototype controls"
    >
      <div
        className={cn(
          "flex w-full flex-col gap-2 rounded-2xl px-3 py-2.5 shadow-lg ring-1 ring-white/10 sm:min-w-[320px]",
          "bg-[#1a1a2e]/95 text-white backdrop-blur-sm",
        )}
      >
        {showPlatformControls ? (
          <div className="flex flex-col gap-1.5">
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wide text-white/50">
              Surface
            </span>
            <div
              className="grid grid-cols-3 gap-1 rounded-xl bg-black/30 p-1"
              role="group"
              aria-label="Platform"
            >
              {PLATFORMS.map(({ value, label, shortLabel, Icon }) => {
                const active = platform === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    aria-label={label}
                    onClick={() => onPlatformChange?.(value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a2e]",
                      active
                        ? "bg-white text-[#1a1a2e] shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon active={active} />
                    <span className="text-[10px] font-semibold leading-none sm:text-[11px]">
                      <span className="sm:hidden">{shortLabel}</span>
                      <span className="hidden sm:inline">{label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
          {isFutureVision && explain ? (
            <button
              type="button"
              onClick={explain.togglePanel}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium text-white",
                explain.panelOpen ? "bg-[#E60278]" : "bg-black/30 hover:bg-black/40",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
              )}
              aria-pressed={explain.panelOpen}
            >
              {explain.panelOpen ? "Hide what's new" : "What's new"}
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleBack}
            className={cn(
              "rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white",
              "hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            )}
          >
            ← Library
          </button>

          <span className="max-w-[min(140px,30vw)] truncate text-xs font-medium text-white/90">
            {activeConcept?.label ?? conceptId}
          </span>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className={cn(
              "rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white",
              "hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            )}
            aria-label="Copy share link"
            title="Copy share link"
          >
            {copied ? "Copied" : "Copy link"}
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Minimize prototype controls"
            title="Minimize"
          >
            <span aria-hidden className="block text-sm leading-none">
              −
            </span>
          </button>
        </div>
      </div>

      <p className="rounded-lg bg-[#1a1a2e]/90 px-2.5 py-1 text-[10px] font-medium text-white/70 shadow-md ring-1 ring-white/10">
        {viewportLabel}
      </p>
    </div>
  )
}
