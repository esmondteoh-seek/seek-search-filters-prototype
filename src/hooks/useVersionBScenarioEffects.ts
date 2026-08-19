import { useEffect } from "react"
import { VERSION_B_SERP_ONBOARDING_KEY } from "@/src/hooks/useVersionBSerpOnboarding"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"

/** Sync onboarding session storage when scenario toggles change */
export function useVersionBScenarioEffects(previewState: VersionBPreviewState) {
  useEffect(() => {
    try {
      if (previewState === "onboarding") {
        sessionStorage.removeItem(VERSION_B_SERP_ONBOARDING_KEY)
        window.dispatchEvent(new Event("vb-onboarding-reset"))
      }
    } catch {
      /* sessionStorage unavailable */
    }
  }, [previewState])
}
