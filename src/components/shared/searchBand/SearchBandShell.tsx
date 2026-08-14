import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SearchBandShellProps {
  /** Landing = tighter chrome; expanded = two-row band with reduced vertical padding */
  expanded: boolean
  children: ReactNode
  /** Version A Strong Applicant — deeper navy + denser band padding (Figma 17292:45149) */
  tone?: "default" | "delivery"
  /** Version B — flat #0D1630, no radial overlay */
  flat?: boolean
}

export function SearchBandShell({ expanded, children, tone = "default", flat = false }: SearchBandShellProps) {
  void expanded
  const isDelivery = tone === "delivery"
  const showGradient = !flat

  return (
    <section
      className={cn(
        "relative overflow-y-visible",
        isDelivery ? "bg-[#0D1630]" : "bg-[#2E3849]",
      )}
    >
      {showGradient ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isDelivery ? "opacity-40" : "opacity-30",
          )}
          aria-hidden
          style={{
            background: isDelivery
              ? "radial-gradient(ellipse 70% 100% at 15% 0%, rgba(30,71,169,0.45) 0%, transparent 55%), radial-gradient(ellipse 50% 70% at 95% 100%, rgba(13,56,128,0.5) 0%, transparent 50%)"
              : "radial-gradient(ellipse 80% 120% at 20% 0%, rgba(30,71,169,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 90% 100%, rgba(13,56,128,0.4) 0%, transparent 55%)",
          }}
        />
      ) : null}

      <div
        className={cn(
          "relative mx-auto min-w-0 max-w-[1280px] px-4 md:px-0",
          isDelivery ? "py-4 md:py-5" : "py-3 md:py-4",
        )}
      >
        {children}
      </div>
    </section>
  )
}
