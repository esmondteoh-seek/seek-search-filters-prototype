import { useEffect, useState } from "react"

export type ViewportBreakpoint = "mobile" | "tablet" | "desktop"

const LABELS: Record<ViewportBreakpoint, string> = {
  mobile: "Mobile <768px",
  tablet: "Tablet 768–991px",
  desktop: "Desktop ≥992px",
}

function getBreakpoint(): ViewportBreakpoint {
  if (typeof window === "undefined") return "desktop"
  const w = window.innerWidth
  if (w < 768) return "mobile"
  if (w < 992) return "tablet"
  return "desktop"
}

export function useViewportBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<ViewportBreakpoint>(getBreakpoint)

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)")
    const mqTablet = window.matchMedia("(min-width: 768px) and (max-width: 991px)")

    const update = () => setBreakpoint(getBreakpoint())
    update()
    mqMobile.addEventListener("change", update)
    mqTablet.addEventListener("change", update)
    window.addEventListener("resize", update)
    return () => {
      mqMobile.removeEventListener("change", update)
      mqTablet.removeEventListener("change", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return { breakpoint, label: LABELS[breakpoint] }
}
