"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { IconOverflow } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface OverflowMenuProps {
  label?: string
  size?: "standard" | "small"
  children: React.ReactNode
  onOpen?: () => void
  onClose?: (data: { reason: "exit" | "selection"; index?: number; id?: string }) => void
  className?: string
}

export function OverflowMenu({
  label = "More options",
  size = "standard",
  children,
  onOpen,
  onClose,
  className,
}: OverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onClose?.({ reason: "exit" })
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (newState) {
      onOpen?.()
    } else {
      onClose?.({ reason: "exit" })
    }
  }

  const handleItemClick = (index: number, id?: string) => {
    setIsOpen(false)
    onClose?.({ reason: "selection", index, id })
  }

  return (
    <div ref={menuRef} className={cn("relative inline-block", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "flex items-center justify-center rounded-full transition-colors",
          "hover:bg-[#f5f6f8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2765cf]",
          size === "small" ? "h-8 w-8" : "h-10 w-10",
        )}
      >
        <IconOverflow className={size === "small" ? "h-4 w-4" : "h-5 w-5"} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5",
            size === "small" ? "text-sm" : "text-base",
          )}
        >
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onClick: (e: React.MouseEvent) => {
                  child.props.onClick?.(e)
                  handleItemClick(index, child.props.id)
                },
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}
