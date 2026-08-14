"use client"

import * as React from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface DisclosureProps {
  id: string
  label: string
  children: React.ReactNode
  expanded?: boolean
  onToggle?: (expanded: boolean) => void
  size?: "standard" | "small" | "xsmall"
  weight?: "regular" | "medium" | "strong"
  className?: string
}

export function Disclosure({
  id,
  label,
  children,
  expanded: controlledExpanded,
  onToggle,
  size = "standard",
  weight = "regular",
  className,
}: DisclosureProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(false)
  const isControlled = controlledExpanded !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle(!controlledExpanded)
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const sizeClasses = {
    standard: "text-base",
    small: "text-sm",
    xsmall: "text-xs",
  }

  const weightClasses = {
    regular: "font-normal",
    medium: "font-medium",
    strong: "font-semibold",
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-1 text-[#1E47A9] hover:underline",
          sizeClasses[size],
          weightClasses[weight],
        )}
        aria-expanded={isExpanded}
        aria-controls={`disclosure-panel-${id}`}
      >
        <span>{label}</span>
        <IconChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
      </button>
      <div
        id={`disclosure-panel-${id}`}
        role="region"
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  )
}
