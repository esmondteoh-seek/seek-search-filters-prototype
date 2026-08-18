import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { useMountTransition } from "@/src/hooks/useMountTransition"

interface FilterPopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: number
  showTitle?: boolean
  /** When true, popover width follows anchor element width */
  matchAnchorWidth?: boolean
}

const SHELL_PADDING = 48
const TITLE_BLOCK = 52
const FOOTER_BLOCK = 76

export function FilterPopover({
  open,
  onClose,
  anchorRef,
  title,
  children,
  footer,
  width = 360,
  showTitle = false,
  matchAnchorWidth = false,
}: FilterPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const position = usePopoverPosition(
    open,
    anchorRef,
    width,
    Boolean(footer),
    showTitle,
    matchAnchorWidth,
  )
  const { mounted, visible } = useMountTransition(open, 220)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open || !popoverRef.current) return
    const focusable = popoverRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    focusable[0]?.focus({ preventScroll: true })
  }, [open])

  if (!mounted) return null

  return createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-labelledby={showTitle ? titleId : undefined}
      className={cn(
        "fixed z-[110] w-max max-w-[calc(100vw-16px)] rounded-2xl bg-white p-6",
        "shadow-[0px_0px_8px_rgba(28,35,48,0.08),0px_8px_16px_-4px_rgba(28,35,48,0.08)]",
        visible ? "filter-popover-enter" : "filter-popover-exit pointer-events-none",
      )}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    >
      {showTitle && (
        <div className="mb-4 border-b border-[#EAECF1] pb-3">
          <h3 id={titleId} className="text-sm font-semibold text-[#2E3849]">
            {title}
          </h3>
        </div>
      )}
      <div
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight: position.contentMaxHeight }}
      >
        {children}
      </div>
      {footer ? <div className="shrink-0">{footer}</div> : null}
    </div>,
    document.body,
  )
}

function usePopoverPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  width: number,
  hasFooter: boolean,
  showTitle: boolean,
  matchAnchorWidth: boolean,
) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    contentMaxHeight: 400,
    width,
  })

  useEffect(() => {
    if (!open || !anchorRef.current) return

    const update = () => {
      const rect = anchorRef.current!.getBoundingClientRect()
      const padding = 8
      const viewportPadding = 16
      const titleBlock = showTitle ? TITLE_BLOCK : 0
      const footerBlock = hasFooter ? FOOTER_BLOCK : 0
      const chrome = SHELL_PADDING + titleBlock + footerBlock

      const resolvedWidth = matchAnchorWidth
        ? Math.min(rect.width, window.innerWidth - viewportPadding * 2)
        : width

      const spaceBelow = window.innerHeight - rect.bottom - padding - viewportPadding
      const spaceAbove = rect.top - padding - viewportPadding
      const availableBelow = Math.min(560, Math.max(160, spaceBelow))
      const availableAbove = Math.min(560, Math.max(160, spaceAbove))

      let top = rect.bottom + padding
      let contentMaxHeight = availableBelow - chrome

      if (contentMaxHeight < 120 && availableAbove > availableBelow) {
        contentMaxHeight = availableAbove - chrome
        top = Math.max(viewportPadding, rect.top - padding - Math.min(availableAbove, contentMaxHeight + chrome))
      }

      let left = rect.left
      if (left + resolvedWidth > window.innerWidth - padding) {
        left = window.innerWidth - resolvedWidth - padding
      }

      setPosition({
        top,
        left: Math.max(padding, left),
        contentMaxHeight: Math.max(120, contentMaxHeight),
        width: resolvedWidth,
      })
    }

    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [open, anchorRef, width, hasFooter, showTitle, matchAnchorWidth])

  return position
}
