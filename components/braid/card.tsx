import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { Box } from "./box"

type CardTone = "neutral" | "promote" | "formAccent"

interface CardProps {
  children: ReactNode
  tone?: CardTone
  rounded?: boolean
  className?: string
}

const toneClasses: Record<CardTone, string> = {
  neutral: "bg-white ring-1 ring-[#EAECF1]",
  promote: "bg-[#F9EBFD] ring-1 ring-[#E1B2F5]",
  formAccent: "bg-[#E5F0FD] ring-1 ring-[#99BFF7]",
}

export function Card({ children, tone = "neutral", rounded = true, className }: CardProps) {
  return (
    <Box padding="gutter" className={cn(toneClasses[tone], rounded && "rounded-xl", className)}>
      {children}
    </Box>
  )
}
