import { useEffect, useState } from "react"

/** True once the page has scrolled away from the top */
export function usePageScrolled(threshold = 1) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [threshold])

  return scrolled
}
