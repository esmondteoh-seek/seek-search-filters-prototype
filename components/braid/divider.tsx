import { cn } from "@/lib/utils"

interface DividerProps {
  weight?: "regular" | "strong"
  className?: string
}

export function Divider({ weight = "regular", className }: DividerProps) {
  return <hr className={cn("border-t", weight === "regular" ? "border-[#EAECF1]" : "border-[#D2D7DF]", className)} />
}
