import { IconClose } from "@/components/braid/icons"
import { useMountTransition } from "@/src/hooks/useMountTransition"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface VersionBAppBottomSheetProps {
  open: boolean
  onClose: () => void
  titleId: string
  illustration: ReactNode
  title: string
  description: string
  primaryAction: {
    label: string
    onClick: () => void
  }
}

/** Shared app bottom sheet chrome (onboarding + SA refine) */
export function VersionBAppBottomSheet({
  open,
  onClose,
  titleId,
  illustration,
  title,
  description,
  primaryAction,
}: VersionBAppBottomSheetProps) {
  const { mounted, visible, durationMs } = useMountTransition(open, 320)

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-[90] flex flex-col justify-end" aria-hidden={!open}>
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
        onClick={onClose}
        aria-label="Close"
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative mx-auto w-full max-w-[430px] rounded-t-[40px] bg-white px-6 pb-8 pt-6 shadow-[0_-8px_32px_rgba(28,35,48,0.12)] transition-transform",
          visible ? "translate-y-0" : "translate-y-full",
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F5F7] text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
            aria-label="Close"
          >
            <IconClose className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>

        {illustration}

        <h2
          id={titleId}
          className="mt-3 text-center text-base font-medium leading-6 text-[#2E3849]"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-center text-sm leading-[21px] text-[#2E3849]">{description}</p>
        ) : null}

        <button
          type="button"
          onClick={primaryAction.onClick}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-[#2E3849] text-sm font-medium text-white hover:bg-[#051A49] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
        >
          {primaryAction.label}
        </button>
      </div>
    </div>
  )
}
