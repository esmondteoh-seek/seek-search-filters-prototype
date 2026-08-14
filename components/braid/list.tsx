import type React from "react"
import { IconTick } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface ListProps {
  children: React.ReactNode
  type?: "bullet" | "number" | "alpha" | "roman" | "icon"
  space?: "small" | "medium" | "large"
  tone?: "neutral" | "secondary"
  size?: "standard" | "small" | "xsmall"
  className?: string
}

export function List({
  children,
  type = "bullet",
  space = "medium",
  tone = "neutral",
  size = "standard",
  className,
}: ListProps) {
  const spaceClasses = {
    small: "gap-1",
    medium: "gap-2",
    large: "gap-3",
  }

  const toneClasses = {
    neutral: "text-[#2E3849]",
    secondary: "text-[#5A6881]",
  }

  const sizeClasses = {
    standard: "text-base",
    small: "text-sm",
    xsmall: "text-xs",
  }

  const Tag = type === "number" || type === "alpha" || type === "roman" ? "ol" : "ul"

  const listStyleClasses = {
    bullet: "list-disc",
    number: "list-decimal",
    alpha: "list-[lower-alpha]",
    roman: "list-[lower-roman]",
    icon: "list-none",
  }

  return (
    <Tag
      className={cn(
        "flex flex-col pl-5",
        spaceClasses[space],
        toneClasses[tone],
        sizeClasses[size],
        listStyleClasses[type],
        type === "icon" && "pl-0",
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface ListItemProps {
  children: React.ReactNode
  icon?: React.ReactNode
}

export function ListItem({ children, icon }: ListItemProps) {
  if (icon) {
    return (
      <li className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 text-[#007833]">{icon}</span>
        <span>{children}</span>
      </li>
    )
  }

  return <li>{children}</li>
}

export function TickList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("flex flex-col gap-2", className)}>{children}</ul>
}

export function TickListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <IconTick className="mt-0.5 h-5 w-5 shrink-0 text-[#007833]" />
      <span className="text-[#2E3849]">{children}</span>
    </li>
  )
}
