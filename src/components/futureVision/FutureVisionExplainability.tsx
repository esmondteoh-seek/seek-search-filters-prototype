import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { IconLocation, IconSearch } from "@/components/braid/icons"
import { NewToYouIcon, NtyDot, StrongApplicantIcon } from "@/src/components/versionB/VersionBIcons"
import { cn } from "@/lib/utils"

export type FutureVisionExplainId = "personalised-filters" | "multi-location"

interface ExplainItem {
  id: FutureVisionExplainId
  title: string
  description: string
}

export const FUTURE_VISION_EXPLAIN_ITEMS: ExplainItem[] = [
  {
    id: "personalised-filters",
    title: "Personalised filter icons",
    description:
      "New and Strong applicant use sparkle and diamond icons so they read as personalised filters, not standard Pay / Type / More chips.",
  },
  {
    id: "multi-location",
    title: "Multi-location",
    description:
      "Search more than one place, then switch location tabs to view results for each area. Job locations update to match the selected tab.",
  },
]

interface FutureVisionExplainabilityContextValue {
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  focusedId: FutureVisionExplainId | null
  setFocusedId: (id: FutureVisionExplainId | null) => void
  highlightsActive: boolean
}

const FutureVisionExplainabilityContext =
  createContext<FutureVisionExplainabilityContextValue | null>(null)

/** What's new panel + spotlight overlay for Future Vision share-outs */
export function FutureVisionExplainabilityProvider({ children }: { children: ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [focusedId, setFocusedId] = useState<FutureVisionExplainId | null>(null)

  const togglePanel = useCallback(() => {
    setPanelOpen((prev) => {
      const next = !prev
      if (!next) setFocusedId(null)
      return next
    })
  }, [])

  useEffect(() => {
    if (!panelOpen) setFocusedId(null)
  }, [panelOpen])

  const value = useMemo(
    () => ({
      panelOpen,
      setPanelOpen,
      togglePanel,
      focusedId,
      setFocusedId,
      highlightsActive: panelOpen,
    }),
    [panelOpen, togglePanel, focusedId],
  )

  return (
    <FutureVisionExplainabilityContext.Provider value={value}>
      <div
        className={cn(highlightsClass(panelOpen, focusedId), "fv-explain-root min-h-0")}
        data-fv-explain-panel={panelOpen ? "open" : "closed"}
        data-fv-explain-focus={focusedId ?? undefined}
      >
        {children}
      </div>
    </FutureVisionExplainabilityContext.Provider>
  )
}

function highlightsClass(panelOpen: boolean, focusedId: FutureVisionExplainId | null) {
  if (!panelOpen) return ""
  return focusedId ? "fv-explain-on fv-explain-focus" : "fv-explain-on"
}

export function useFutureVisionExplainability() {
  return useContext(FutureVisionExplainabilityContext)
}

const SPOTLIGHT_PAD = 10

function SpotlightBackdrop({
  targetId,
  onDismiss,
}: {
  targetId: FutureVisionExplainId
  onDismiss: () => void
}) {
  const [hole, setHole] = useState<DOMRect | null>(null)

  const update = useCallback(() => {
    const el = document.querySelector<HTMLElement>(
      `.fv-explain-root [data-fv-explain="${targetId}"]`,
    )
    if (!el) {
      setHole(null)
      return
    }
    setHole(el.getBoundingClientRect())
  }, [targetId])

  useLayoutEffect(() => {
    update()
    const el = document.querySelector(`.fv-explain-root [data-fv-explain="${targetId}"]`)
    const ro = el ? new ResizeObserver(update) : null
    if (el && ro) ro.observe(el)
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      ro?.disconnect()
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [targetId, update])

  const clipPath = hole
    ? `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, ${hole.left - SPOTLIGHT_PAD}px ${hole.top - SPOTLIGHT_PAD}px, ${hole.left - SPOTLIGHT_PAD}px ${hole.bottom + SPOTLIGHT_PAD}px, ${hole.right + SPOTLIGHT_PAD}px ${hole.bottom + SPOTLIGHT_PAD}px, ${hole.right + SPOTLIGHT_PAD}px ${hole.top - SPOTLIGHT_PAD}px)`
    : undefined

  return (
    <div
      className="fv-spotlight-backdrop fixed inset-0 z-[205]"
      style={{ clipPath, WebkitClipPath: clipPath }}
      aria-hidden
      onClick={onDismiss}
    />
  )
}

function ExampleChip({
  icon,
  label,
  trailing,
}: {
  icon: ReactNode
  label: string
  trailing?: ReactNode
}) {
  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-[#2455C9] px-2.5 text-xs text-white">
      {icon}
      {label}
      {trailing}
    </span>
  )
}

function ExampleLocationTab({ label, selected }: { label: string; selected: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 max-w-[180px] items-center gap-1 rounded-t-lg px-2 text-[11px]",
        selected
          ? "bg-white text-[#2E3849]"
          : "border border-b-0 border-white/20 bg-white/10 text-white",
      )}
    >
      <IconLocation
        className={cn("h-3.5 w-3.5 shrink-0", selected ? "text-[#5A6881]" : "text-white/90")}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </span>
  )
}

function ExampleField({
  icon,
  value,
}: {
  icon: ReactNode
  value: string
}) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg bg-white px-2.5">
      {icon}
      <span className="min-w-0 truncate text-xs text-[#2E3849]">{value}</span>
    </div>
  )
}

function ExampleSearchCard({
  location,
  otherLocation,
  showPersonalised,
}: {
  location: string
  otherLocation?: string
  showPersonalised?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#051A49] p-3 text-left">
      <div className="flex flex-col gap-2">
        <ExampleField
          icon={<IconSearch className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />}
          value="Project Manager"
        />
        <ExampleField
          icon={<IconLocation className="h-4 w-4 shrink-0 text-[#5A6881]" aria-hidden />}
          value={location}
        />
      </div>

      {showPersonalised ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <ExampleChip
            icon={<NewToYouIcon className="h-3.5 w-3.5 text-white" />}
            label="New"
            trailing={<NtyDot />}
          />
          <ExampleChip
            icon={<StrongApplicantIcon className="h-3.5 w-3.5 text-white" />}
            label="Strong applicant"
          />
        </div>
      ) : null}

      {otherLocation ? (
        <div className="mt-2 flex items-end gap-1.5">
          <ExampleLocationTab label={location} selected />
          <ExampleLocationTab label={otherLocation} selected={false} />
        </div>
      ) : null}
    </div>
  )
}

interface FutureVisionWhatsNewPanelProps {
  className?: string
}

/** Slide-out panel listing Future Vision design changes + example searches */
export function FutureVisionWhatsNewPanel({ className }: FutureVisionWhatsNewPanelProps) {
  const ctx = useFutureVisionExplainability()
  if (!ctx?.panelOpen) return null

  const { focusedId, setFocusedId, setPanelOpen } = ctx
  const showingExamples = focusedId !== null

  return (
    <>
      {focusedId ? (
        <SpotlightBackdrop targetId={focusedId} onDismiss={() => setFocusedId(null)} />
      ) : null}

      <aside
        className={cn(
          "fixed bottom-24 right-4 z-[210] flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-[#EAECF1]",
          showingExamples
            ? "w-[min(100vw-2rem,440px)]"
            : "w-[min(100vw-2rem,360px)]",
          className,
        )}
        aria-label="What's new in Future Vision"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[#2E3849]">What&apos;s new</p>
            <p className="mt-0.5 text-xs text-[#697586]">Future Vision filter and location updates</p>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-[#697586] hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
          >
            Close
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {FUTURE_VISION_EXPLAIN_ITEMS.map((item) => {
            const active = focusedId === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setFocusedId(active ? null : item.id)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]",
                    active
                      ? "border-[#E60278] bg-[#FFF5FA]"
                      : "border-[#EAECF1] bg-[#F7F8FB] hover:border-[#D2D7DF]",
                  )}
                >
                  <span className="block text-sm font-medium text-[#2E3849]">{item.title}</span>
                  <span className="mt-1 block text-xs leading-snug text-[#697586]">
                    {item.description}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {focusedId === "personalised-filters" ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#697586]">
              Example search
            </p>
            <ExampleSearchCard location="Sydney, NSW 2000" showPersonalised />
          </div>
        ) : null}

        {focusedId === "multi-location" ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#697586]">
              Example searches
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <ExampleSearchCard
                location="Sydney, NSW 2000"
                otherLocation="Melbourne, VIC 3000"
              />
              <ExampleSearchCard
                location="Melbourne, VIC 3000"
                otherLocation="Sydney, NSW 2000"
              />
            </div>
          </div>
        ) : null}
      </aside>
    </>
  )
}
