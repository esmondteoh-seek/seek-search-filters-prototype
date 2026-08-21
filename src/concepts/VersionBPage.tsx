import { useEffect, useRef, type ReactNode } from "react"
import { VersionBApp } from "@/src/components/versionB/VersionBApp"
import { VersionBDesktop } from "@/src/components/versionB/VersionBDesktop"
import { VersionBMobileWeb } from "@/src/components/versionB/VersionBMobileWeb"
import { VersionBRoot } from "@/src/components/versionB/VersionBRoot"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import {
  getVersionBFilterPatch,
  getVersionBSearch,
  versionBAppliesScenarioPreset,
  type VersionBPlatform,
  type VersionBPreviewState,
} from "@/src/data/versionBPresets"
import { DEFAULT_FILTERS } from "@/src/hooks/useJobFilters"
import { consumeVersionBFromHome } from "@/src/lib/versionBHomeSession"
import { useVersionBScenarioEffects } from "@/src/hooks/useVersionBScenarioEffects"
import { VersionBScenarioSpotlight } from "@/src/components/versionB/VersionBScenarioSpotlight"
import { cn } from "@/lib/utils"

interface VersionBPageProps {
  filterState: UseJobFiltersReturn
  platform?: VersionBPlatform
  previewState?: VersionBPreviewState
}

function useVersionBPreset(
  applySearchQuery: UseJobFiltersReturn["applySearchQuery"],
  replaceFilters: UseJobFiltersReturn["replaceFilters"],
  platform: VersionBPlatform,
  previewState: VersionBPreviewState,
) {
  const prevPreview = useRef<VersionBPreviewState | null>(null)

  useEffect(() => {
    const apply = () => {
      applySearchQuery(getVersionBSearch(platform, previewState))
      replaceFilters({ ...DEFAULT_FILTERS, ...getVersionBFilterPatch(previewState) })
    }

    const isFirstMount = prevPreview.current === null
    const fromHome = isFirstMount ? consumeVersionBFromHome() : false
    const skipFiltersFromHome = isFirstMount && fromHome && previewState === "filters"

    const returningToFilters =
      previewState === "filters" &&
      prevPreview.current !== null &&
      prevPreview.current !== "filters"

    if (!skipFiltersFromHome && (versionBAppliesScenarioPreset(previewState) || returningToFilters)) {
      apply()
    }

    prevPreview.current = previewState
  }, [platform, previewState, applySearchQuery, replaceFilters])
}

/** Delivery Version B — thin platform switcher over dedicated SERP chrome */
export function VersionBPage({
  filterState,
  platform = "desktop",
  previewState = "filters",
}: VersionBPageProps) {
  useVersionBPreset(filterState.applySearchQuery, filterState.replaceFilters, platform, previewState)
  useVersionBScenarioEffects(previewState)

  const scenarioShell = (children: ReactNode, rootClassName?: string) => (
    <div
      className={cn("vb-scenario-root min-h-0", rootClassName)}
      data-vb-spotlight-active={previewState}
    >
      {children}
      <VersionBScenarioSpotlight previewState={previewState} />
    </div>
  )

  if (platform === "app") {
    return scenarioShell(
      <VersionBRoot>
        <VersionBApp filterState={filterState} previewState={previewState} />
      </VersionBRoot>,
    )
  }

  if (platform === "mobile-web") {
    return scenarioShell(
      <VersionBRoot className="bg-[#E8ECF2]">
        <VersionBMobileWeb filterState={filterState} previewState={previewState} />
      </VersionBRoot>,
    )
  }

  return scenarioShell(
    <VersionBRoot>
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to results
      </a>
      <VersionBDesktop filterState={filterState} previewState={previewState} />
    </VersionBRoot>,
  )
}
