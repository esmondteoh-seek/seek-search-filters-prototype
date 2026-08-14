import { useCallback, useEffect, useRef, useState } from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { concepts } from "@/src/concepts/index"
import { useViewportBreakpoint } from "@/src/hooks/useViewportBreakpoint"

const COLLAPSED_KEY = "seek-prototype-switcher-collapsed"

interface ConceptSwitcherProps {
  conceptId: string
  onConceptChange: (id: string) => void
}

/** Prototype chrome — concept dropdown + viewport hint (not part of SEEK UI) */
export function ConceptSwitcher({ conceptId, onConceptChange }: ConceptSwitcherProps) {
  const { label: viewportLabel } = useViewportBreakpoint()
  const [collapsed, setCollapsed] = useState(() => {
    const stored = sessionStorage.getItem(COLLAPSED_KEY)
    // Default minimised; honour explicit expand from a prior session
    return stored !== "0"
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeConcept = concepts.find((c) => c.id === conceptId) ?? concepts[0]
  const activeIndex = concepts.findIndex((c) => c.id === conceptId)

  useEffect(() => {
    sessionStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0")
  }, [collapsed])

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [menuOpen])

  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
      e.preventDefault()
      const delta = e.key === "ArrowDown" ? 1 : -1
      const next = (index + delta + concepts.length) % concepts.length
      onConceptChange(concepts[next].id)
    },
    [onConceptChange],
  )

  const anchorClass =
    "fixed bottom-6 right-4 z-[200] flex flex-col items-end gap-2 sm:bottom-8 sm:right-6"

  if (collapsed) {
    return (
      <div className={anchorClass} aria-label="Search filter concept controls">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className={cn(
            "flex h-10 min-w-10 items-center justify-center rounded-full px-2",
            "bg-[#1a1a2e] text-xs font-semibold text-white shadow-lg ring-1 ring-white/10",
            "hover:bg-[#252545] focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
          )}
          title="Expand concept switcher"
          aria-label={`Expand concept switcher — ${activeConcept.label}`}
        >
          {activeIndex + 1}
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(anchorClass, "max-w-[calc(100vw-2rem)]")}
      aria-label="Search filter concept controls"
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl px-3 py-2 shadow-lg ring-1 ring-white/10 sm:gap-3",
          "bg-[#1a1a2e]/95 text-white backdrop-blur-sm",
        )}
      >
        <span className="hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-white/50 sm:inline">
          Search Filter Concepts
        </span>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "inline-flex max-w-[min(320px,70vw)] items-center gap-2 rounded-full bg-black/30 py-1.5 pl-3 pr-2",
              "text-left text-xs font-medium text-white",
              "hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
            )}
          >
            <span className="min-w-0 truncate">{activeConcept.label}</span>
            <IconChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                menuOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          {menuOpen ? (
            <ul
              role="listbox"
              aria-label="Design concept"
              className="absolute bottom-full right-0 mb-2 min-w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e] py-1 shadow-xl"
            >
              {concepts.map((concept, index) => {
                const selected = concept.id === conceptId
                return (
                  <li key={concept.id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        onConceptChange(concept.id)
                        setMenuOpen(false)
                      }}
                      onKeyDown={(e) => handleListKeyDown(e, index)}
                      className={cn(
                        "block w-full px-3 py-2.5 text-left text-xs transition-colors",
                        selected
                          ? "bg-white/15 font-semibold text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {concept.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Minimize concept switcher"
          title="Minimize"
        >
          <span aria-hidden className="block text-sm leading-none">
            −
          </span>
        </button>
      </div>

      <p className="rounded-lg bg-[#1a1a2e]/90 px-2.5 py-1 text-[10px] font-medium text-white/70 shadow-md ring-1 ring-white/10">
        {viewportLabel}
      </p>
    </div>
  )
}
