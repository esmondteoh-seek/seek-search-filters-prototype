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

function findPhoneFrame(anchor: HTMLElement | null): HTMLElement | null {
  return anchor?.closest("[data-phone-frame]") ?? null
}

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

  const portalTarget =
    position.contained && anchorRef.current
      ? findPhoneFrame(anchorRef.current) ?? document.body
      : document.body

  const popover = (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-labelledby={showTitle ? titleId : undefined}
      className={cn(
        position.contained ? "absolute z-[110]" : "fixed z-[110]",
        "w-max rounded-2xl bg-white p-6",
        position.contained ? "max-w-[calc(100%-16px)]" : "max-w-[calc(100vw-16px)]",
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
    </div>
  )

  return createPortal(popover, portalTarget)
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
    contained: false,
  })

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

      const padding = 8
      const viewportPadding = 16
      const titleBlock = showTitle ? TITLE_BLOCK : 0
      const footerBlock = hasFooter ? FOOTER_BLOCK : 0
      const chrome = SHELL_PADDING + titleBlock + footerBlock

      const boundsWidth = bounds.right - bounds.left
      const resolvedWidth = matchAnchorWidth
        ? Math.min(rect.width, boundsWidth - viewportPadding * 2)
        : Math.min(width, boundsWidth - viewportPadding * 2)

      const spaceBelow = bounds.bottom - rect.bottom - padding - viewportPadding
      const spaceAbove = rect.top - bounds.top - padding - viewportPadding
      const availableBelow = Math.min(560, Math.max(160, spaceBelow))
      const availableAbove = Math.min(560, Math.max(160, spaceAbove))

      let topViewport = rect.bottom + padding
      let contentMaxHeight = availableBelow - chrome

      if (contentMaxHeight < 120 && availableAbove > availableBelow) {
        contentMaxHeight = availableAbove - chrome
        topViewport = Math.max(
          bounds.top + viewportPadding,
          rect.top - padding - Math.min(availableAbove, contentMaxHeight + chrome),
        )
      }

      let leftViewport = rect.left
      const maxRight = bounds.right - viewportPadding
      const minLeft = bounds.left + padding

      if (leftViewport + resolvedWidth > maxRight) {
        leftViewport = maxRight - resolvedWidth
      }
      leftViewport = Math.max(minLeft, leftViewport)

      setPosition({
        top: contained ? topViewport - bounds.top : topViewport,
        left: contained ? leftViewport - bounds.left : leftViewport,
        contentMaxHeight: Math.max(120, contentMaxHeight),
        width: resolvedWidth,
        contained,
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
