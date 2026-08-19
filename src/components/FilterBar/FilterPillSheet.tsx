import { IconClose } from "@/components/braid/icons"
import { useMountTransition } from "@/src/hooks/useMountTransition"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface FilterPillSheetProps {
  open: boolean
  onClose: () => void
  title: string
  titleId: string
  children: ReactNode
  onDone: () => void
  showClearAll?: boolean
  onClearAll?: () => void
  tall?: boolean
}

/** App search form — filter options in a phone-frame bottom sheet */
export function FilterPillSheet({
  open,
  onClose,
  title,
  titleId,
  children,
  onDone,
  showClearAll = false,
  onClearAll,
  tall = false,
}: FilterPillSheetProps) {
  const { mounted, visible, durationMs } = useMountTransition(open, 280)

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-[110] flex flex-col justify-end" aria-hidden={!open}>
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
        onClick={onClose}
        aria-label="Close filter options"
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative mx-auto flex w-full max-w-[430px] flex-col rounded-t-[24px] bg-white shadow-[0_-8px_32px_rgba(28,35,48,0.12)] transition-transform",
          tall ? "max-h-[min(92%,640px)]" : "max-h-[min(85%,520px)]",
          visible ? "translate-y-0" : "translate-y-full",
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-5">
          <h2 id={titleId} className="text-lg font-semibold text-[#2E3849]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F5F7] text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label="Close"
          >
            <IconClose className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>

        <div className="shrink-0 border-t border-[#EAECF1] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
          {showClearAll && onClearAll ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClearAll}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-[#1E47A9] px-4",
                  "text-base font-semibold text-[#1E47A9] hover:bg-[#F7F8FB]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]",
                )}
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onDone}
                className={cn(
                  "flex h-12 flex-[2] items-center justify-center rounded-lg bg-[#1E47A9] px-4",
                  "text-base font-semibold text-white hover:bg-[#163a8a]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
                )}
              >
                Done
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onDone}
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-lg bg-[#1E47A9] px-4",
                "text-base font-semibold text-white hover:bg-[#163a8a]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
              )}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
