"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  selectedItem: string
  setSelectedItem: (item: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

interface TabsProviderProps {
  children: React.ReactNode
  selectedItem?: string
  onChange?: (item: string) => void
}

export function TabsProvider({ children, selectedItem: controlledSelectedItem, onChange }: TabsProviderProps) {
  const [internalSelectedItem, setInternalSelectedItem] = React.useState("")
  const isControlled = controlledSelectedItem !== undefined
  const selectedItem = isControlled ? controlledSelectedItem : internalSelectedItem

  const setSelectedItem = React.useCallback(
    (item: string) => {
      if (isControlled && onChange) {
        onChange(item)
      } else {
        setInternalSelectedItem(item)
      }
    },
    [isControlled, onChange],
  )

  return <TabsContext.Provider value={{ selectedItem, setSelectedItem }}>{children}</TabsContext.Provider>
}

interface TabsProps {
  children: React.ReactNode
  align?: "left" | "center"
  divider?: "partial" | "full" | "none"
  gutter?: "none" | "small" | "medium" | "large"
  size?: "standard" | "small"
  reserveHitArea?: boolean
  className?: string
}

export function Tabs({
  children,
  align = "left",
  divider = "partial",
  gutter = "none",
  size = "standard",
  reserveHitArea = false,
  className,
}: TabsProps) {
  const gutterClasses = {
    none: "",
    small: "px-2",
    medium: "px-4",
    large: "px-6",
  }

  return (
    <div className={cn("relative", className)}>
      <div
        role="tablist"
        className={cn(
          "flex gap-6 overflow-x-auto",
          align === "center" && "justify-center",
          gutterClasses[gutter],
          reserveHitArea && "pt-2",
        )}
        data-size={size}
      >
        {children}
      </div>
      {divider !== "none" && (
        <div
          className={cn(
            "absolute bottom-0 h-px bg-[#E8EAF0]",
            divider === "full" ? "left-0 right-0" : "left-0 right-0",
          )}
        />
      )}
    </div>
  )
}

interface TabProps {
  item: string
  children: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
}

export function Tab({ item, children, badge, icon }: TabProps) {
  const context = React.useContext(TabsContext)
  const isSelected = context?.selectedItem === item || (!context?.selectedItem && item === "0")

  React.useEffect(() => {
    if (!context?.selectedItem && item) {
      context?.setSelectedItem(item)
    }
  }, [])

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${item}`}
      onClick={() => context?.setSelectedItem(item)}
      className={cn(
        "relative flex items-center gap-2 whitespace-nowrap pb-3 text-sm font-medium transition-colors",
        isSelected ? "text-[#2E3849]" : "text-[#5A6881] hover:text-[#2E3849]",
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
      {badge && <span>{badge}</span>}
      {isSelected && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0d3880]" />}
    </button>
  )
}

interface TabPanelsProps {
  children: React.ReactNode
  className?: string
}

export function TabPanels({ children, className }: TabPanelsProps) {
  return <div className={className}>{children}</div>
}

interface TabPanelProps {
  item: string
  children: React.ReactNode
}

export function TabPanel({ item, children }: TabPanelProps) {
  const context = React.useContext(TabsContext)
  const isSelected = context?.selectedItem === item

  if (!isSelected) return null

  return (
    <div role="tabpanel" id={`tabpanel-${item}`} aria-labelledby={`tab-${item}`}>
      {children}
    </div>
  )
}
