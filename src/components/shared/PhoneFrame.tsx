import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

/** 390px device shell — bounded height so results scroll inside the frame, not the page */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-[#E8ECF2] px-4 pb-32 pt-8">
      <div
        data-phone-frame
        className={cn(
          "relative flex h-full max-h-[844px] w-full max-w-[390px] flex-col overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
