"use client"

import * as React from "react"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  expandedItems: Set<string>
  toggleItem: (id: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  children: React.ReactNode
  size?: "standard" | "small" | "xsmall"
  tone?: "neutral" | "secondary"
  weight?: "regular" | "medium" | "strong"
  dividers?: boolean
  space?: "medium" | "large" | "xlarge"
  className?: string
}

export function Accordion({
  children,
  size = "standard",
  tone = "neutral",
  weight = "medium",
  dividers = true,
  space = "large",
  className,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleItem = React.useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const spaceClasses = {
    medium: "gap-3",
    large: "gap-4",
    xlarge: "gap-6",
  }

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div
        className={cn("flex flex-col", spaceClasses[space], className)}
        data-size={size}
        data-tone={tone}
        data-weight={weight}
        data-dividers={dividers}
      >
        {React.Children.map(children, (child, index) => (
          <>
            {dividers && index > 0 && <div className="h-px bg-[#E8EAF0]" />}
            {child}
          </>
        ))}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  id: string
  label: string
  children: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
  expanded?: boolean
  onToggle?: (expanded: boolean) => void
}

export function AccordionItem({
  id,
  label,
  children,
  badge,
  icon,
  expanded: controlledExpanded,
  onToggle,
}: AccordionItemProps) {
  const context = React.useContext(AccordionContext)
  const isControlled = controlledExpanded !== undefined
  const isExpanded = isControlled ? controlledExpanded : (context?.expandedItems.has(id) ?? false)

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle(!controlledExpanded)
    } else {
      context?.toggleItem(id)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between py-3 text-left"
        aria-expanded={isExpanded}
        aria-controls={`accordion-panel-${id}`}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-[#5A6881]">{icon}</span>}
          <span className="font-medium text-[#2E3849]">{label}</span>
          {badge && <span>{badge}</span>}
        </span>
        <IconChevronDown
          className={cn("h-5 w-5 text-[#5A6881] transition-transform duration-200", isExpanded && "rotate-180")}
        />
      </button>
      <div
        id={`accordion-panel-${id}`}
        role="region"
        aria-labelledby={`accordion-header-${id}`}
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="pb-4 text-[#5A6881]">{children}</div>
      </div>
    </div>
  )
}
