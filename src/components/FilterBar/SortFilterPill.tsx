import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { IconSort } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import type { SortOption } from "@/src/data/jobs"
import { useMountTransition } from "@/src/hooks/useMountTransition"

interface SortFilterPillProps {
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  /** bar = personalised row (Concept 1); navy = search band filter row (Concept 2/3) */
  variant?: "bar" | "navy"
  /** Compact height for mobile navy rows */
  compact?: boolean
  /** Align menu to pill end — useful when sort sits at row end */
  menuAlign?: "start" | "end"
  /** Compact 14px label for results header (Figma 4187:24784) */
  labelSize?: "default" | "compact"
  /** Icon-only bordered button — results header sort (Figma 4166:28838) */
  iconOnly?: boolean
  /** Remove visible border — delivery results header sort (Figma 17292:45149) */
  borderless?: boolean
  className?: string
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Date" },
]

const MENU_WIDTH = 160

function useSortMenuPosition(
  open: boolean,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
  menuAlign: "start" | "end",
) {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open || !buttonRef.current) return

    const update = () => {
      const rect = buttonRef.current!.getBoundingClientRect()
      const padding = 8
      let left = menuAlign === "end" ? rect.right - MENU_WIDTH : rect.left
      left = Math.max(padding, Math.min(left, window.innerWidth - MENU_WIDTH - padding))
      setPosition({ top: rect.bottom + 4, left })
    }

    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [open, buttonRef, menuAlign])

  return position
}

/** Sort dropdown pill — portaled menu avoids clipping in overflow filter rows */
export function SortFilterPill({
  sort,
  onSortChange,
  variant = "bar",
  compact = false,
  menuAlign = "start",
  labelSize = "default",
  iconOnly = false,
  borderless = false,
  className,
}: SortFilterPillProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const { mounted, visible } = useMountTransition(open, 180)
  const isNavy = variant === "navy"
  const position = useSortMenuPosition(open, buttonRef, menuAlign)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  return (
    <div className={cn("relative shrink-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Sort by ${SORT_OPTIONS.find((o) => o.value === sort)?.label}`}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 font-normal",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "active:scale-[0.98]",
          isNavy
            ? iconOnly
              ? cn(
                  "h-10 w-10 justify-center rounded-full text-white",
                  borderless
                    ? "hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]"
                    : "border-2 border-white/25 hover:bg-white/5 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
                  compact && "h-9 w-9",
                  open && (borderless ? "bg-white/10" : "bg-white/5"),
                )
              : cn(
                  "h-12 rounded-full px-2 text-base text-white",
                  "hover:bg-white/5 focus-visible:ring-white focus-visible:ring-offset-[#2E3849]",
                  compact && "h-9 gap-1 px-2 text-sm",
                  open && "bg-white/5",
                )
            : iconOnly
              ? cn(
                  "h-11 w-11 justify-center rounded-lg text-[#2E3849]",
                  borderless
                    ? "hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
                    : "border-2 hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
                  !borderless && (open ? "border-[#2E3849] bg-[#F7F8FB]" : "border-[#EAECF1]"),
                  borderless && open && "bg-[#F7F8FB]",
                )
              : cn(
                  "h-auto rounded-lg px-2 py-2 text-[#2E3849]",
                  labelSize === "compact" ? "gap-1 text-sm" : "gap-1 text-base",
                  "hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
                  open && "bg-[#F7F8FB]",
                ),
        )}
      >
        <IconSort
          className={cn("h-5 w-5 shrink-0", isNavy ? "text-white" : "text-[#2E3849]")}
          aria-hidden
        />
        {!iconOnly && <span className="whitespace-nowrap">Sort</span>}
      </button>

      {mounted &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-label="Sort options"
            className={cn(
              "fixed z-[120] min-w-[160px] overflow-hidden rounded-lg border border-[#EAECF1] bg-white py-1 shadow-lg",
              visible ? "filter-menu-enter" : "filter-menu-exit pointer-events-none",
            )}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
          >
            {SORT_OPTIONS.map((option) => (
              <li key={option.value} role="option" aria-selected={sort === option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onSortChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-[#F3F5F7]",
                    sort === option.value ? "font-medium text-[#1E47A9]" : "text-[#2E3849]",
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  )
}
