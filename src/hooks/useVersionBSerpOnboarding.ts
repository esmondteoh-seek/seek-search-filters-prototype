import { useCallback, useEffect, useState } from "react"

export const VERSION_B_SERP_ONBOARDING_KEY = "vb-serp-filter-onboarding"

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(VERSION_B_SERP_ONBOARDING_KEY) === "dismissed"
  } catch {
    return false
  }
}

/** Shared first-visit SERP onboarding flag for web tooltip + app sheet */
export function useVersionBSerpOnboarding() {
  const [dismissed, setDismissed] = useState(readDismissed)

  const syncFromStorage = useCallback(() => {
    setDismissed(readDismissed())
  }, [])

  useEffect(() => {
    syncFromStorage()
    const onReset = () => syncFromStorage()
    window.addEventListener("vb-onboarding-reset", onReset)
    return () => window.removeEventListener("vb-onboarding-reset", onReset)
  }, [syncFromStorage])

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(VERSION_B_SERP_ONBOARDING_KEY, "dismissed")
    } catch {
      /* sessionStorage unavailable */
    }
    setDismissed(true)
  }, [])

  const resetOnboarding = useCallback(() => {
    try {
      sessionStorage.removeItem(VERSION_B_SERP_ONBOARDING_KEY)
    } catch {
      /* sessionStorage unavailable */
    }
    setDismissed(false)
  }, [])

  return { dismissed, dismiss, resetOnboarding, syncFromStorage, shouldShow: !dismissed }
}
