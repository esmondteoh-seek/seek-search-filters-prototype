"use client"

import * as React from "react"
import { IconClose } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => boolean | void
  title: string
  description?: string
  illustration?: React.ReactNode
  width?: "xsmall" | "small" | "medium" | "large" | "content"
  closeLabel?: string
  children: React.ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  illustration,
  width = "small",
  closeLabel = "Close",
  children,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        const result = onClose()
        if (result === false) return
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const result = onClose()
      if (result === false) return
    }
  }

  const widthClasses = {
    xsmall: "max-w-xs",
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-lg",
    content: "max-w-fit",
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
    >
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full rounded-2xl bg-white p-6 shadow-xl",
          widthClasses[width],
          "animate-in fade-in-0 zoom-in-95 duration-200",
        )}
      >
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute right-4 top-4 rounded-full p-1 text-[#5A6881] hover:bg-[#F5F6F8]"
          aria-label={closeLabel}
        >
          <IconClose className="h-5 w-5" />
        </button>

        {illustration && <div className="mb-4 flex justify-center">{illustration}</div>}

        <h2 id="dialog-title" className="text-lg font-semibold text-[#2E3849]">
          {title}
        </h2>

        {description && (
          <p id="dialog-description" className="mt-1 text-[#5A6881]">
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
