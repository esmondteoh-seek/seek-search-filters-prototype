"use client"

import * as React from "react"
import { IconClose } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface DrawerProps {
  open: boolean
  onClose: () => boolean | void
  title: string
  description?: string
  width?: "small" | "medium" | "large"
  position?: "left" | "right"
  closeLabel?: string
  children: React.ReactNode
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  width = "medium",
  position = "right",
  closeLabel = "Close",
  children,
}: DrawerProps) {
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
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-lg",
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      aria-describedby={description ? "drawer-description" : undefined}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col bg-white shadow-xl",
          widthClasses[width],
          position === "right" ? "ml-auto" : "mr-auto",
          position === "right"
            ? "animate-in slide-in-from-right duration-300"
            : "animate-in slide-in-from-left duration-300",
        )}
      >
        <div className="flex items-start justify-between border-b border-[#E8EAF0] p-6">
          <div>
            <h2 id="drawer-title" className="text-lg font-semibold text-[#2E3849]">
              {title}
            </h2>
            {description && (
              <p id="drawer-description" className="mt-1 text-[#5A6881]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            className="rounded-full p-1 text-[#5A6881] hover:bg-[#F5F6F8]"
            aria-label={closeLabel}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
