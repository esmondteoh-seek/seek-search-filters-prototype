import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useJobFilters } from "@/src/hooks/useJobFilters"
import { useConceptParam } from "@/src/hooks/useConceptParam"
import { isFutureVisionConcept } from "@/src/concepts/index"
import { ConceptViewport } from "@/src/components/prototype/ConceptViewport"
import { PrototypeChrome } from "@/src/components/prototype/PrototypeChrome"
import { SeekHomePage, useSeekDocumentTitle } from "@/src/pages/SeekHomePage"
import { VersionBHomePage } from "@/src/components/versionB/VersionBHomePage"
import { PrototypeLibraryPage } from "@/src/pages/PrototypeLibraryPage"
import { DEFAULT_SEARCH } from "@/src/hooks/searchQuery"
import {
  readAppView,
  readSearchFromUrl,
  redirectPrototypeToJobsIfNeeded,
  useAppNavigation,
} from "@/src/hooks/useAppNavigation"
import { useLibraryNavigation } from "@/src/hooks/useLibraryNavigation"
import { useVersionBPlatformParam } from "@/src/hooks/useVersionBPlatformParam"
import { useVersionBPreviewState } from "@/src/hooks/useVersionBPreviewState"
import { getVersionBFilterPatch, getVersionBSearch, type VersionBPlatform, type VersionBPreviewState } from "@/src/data/versionBPresets"
import { DEFAULT_FILTERS } from "@/src/hooks/useJobFilters"
import {
  FutureVisionExplainabilityProvider,
  FutureVisionWhatsNewPanel,
} from "@/src/components/futureVision/FutureVisionExplainability"
import { VersionBScenarioPanel } from "@/src/components/versionB/VersionBScenarioPanel"
import { VersionBScenarioSpotlight } from "@/src/components/versionB/VersionBScenarioSpotlight"
import {
  markVersionBFromHome,
  markVersionBHomeMoreOptions,
} from "@/src/lib/versionBHomeSession"

const FILTER_TRANSITION_HOLD_MS = 1200

function resolveInitialSearch() {
  if (readAppView() !== "jobs") return DEFAULT_SEARCH
  const fromUrl = readSearchFromUrl()
  if (fromUrl.keywords || fromUrl.location) return fromUrl
  return DEFAULT_SEARCH
}

export default function App() {
  const initialSearch = useMemo(() => resolveInitialSearch(), [])
  const filterState = useJobFilters({ initialSearch })
  const { applySearchQuery, search, replaceFilters } = filterState
  const { conceptId, inPrototypeMode } = useConceptParam()
  const { view, navigateToJobs, navigateToHome, replaceJobsSearchInUrl } = useAppNavigation()
  const { folderId, openFolder, goToRoot } = useLibraryNavigation()
  const isVersionB = conceptId === "version-b"
  const isFutureVision = isFutureVisionConcept(conceptId)
  const usesPlatformParam = isVersionB || isFutureVision
  const { platform, setPlatform } = useVersionBPlatformParam(usesPlatformParam)
  const { previewState, setPreviewState } = useVersionBPreviewState(isVersionB)
  const [filterTransitionEpoch, setFilterTransitionEpoch] = useState(0)
  const filterTransitionBooted = useRef(false)

  useSeekDocumentTitle(view, search)

  useEffect(() => {
    redirectPrototypeToJobsIfNeeded()
  }, [])

  useEffect(() => {
    if (!inPrototypeMode || view !== "jobs") return
    if (isFutureVisionConcept(conceptId) || conceptId === "version-b" || conceptId === "mls-framing" || conceptId === "vb-context") return
    const fromUrl = readSearchFromUrl()
    if (fromUrl.keywords || fromUrl.location) {
      applySearchQuery(fromUrl)
    } else {
      applySearchQuery(DEFAULT_SEARCH)
    }
  }, [view, applySearchQuery, inPrototypeMode, conceptId])

  useEffect(() => {
    if (!inPrototypeMode || view !== "jobs") return
    replaceJobsSearchInUrl(search)
  }, [view, search.keywords, search.location, replaceJobsSearchInUrl, inPrototypeMode])

  const handleHomeSearch = (query: { keywords: string; location: string }) => {
    applySearchQuery(query)
    navigateToJobs(query)
  }

  const openVersionBSerp = useCallback(
    (nextPlatform: VersionBPlatform, nextPreview: VersionBPreviewState) => {
      const preset = getVersionBSearch(nextPlatform, nextPreview)
      applySearchQuery(preset)
      replaceFilters({ ...DEFAULT_FILTERS, ...getVersionBFilterPatch(nextPreview) })
      navigateToJobs(preset)
    },
    [applySearchQuery, replaceFilters, navigateToJobs],
  )

  const startFilterTransitionFlow = useCallback(() => {
    if (platform === "app") return
    markVersionBFromHome()
    markVersionBHomeMoreOptions()
    navigateToHome()
    setFilterTransitionEpoch((epoch) => epoch + 1)
  }, [platform, navigateToHome])

  useEffect(() => {
    if (!isVersionB || previewState !== "filter-transition" || platform === "app") return
    if (view !== "home") return

    const timer = window.setTimeout(() => {
      openVersionBSerp(platform, "filter-transition")
    }, FILTER_TRANSITION_HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [
    isVersionB,
    previewState,
    platform,
    view,
    openVersionBSerp,
    filterTransitionEpoch,
  ])

  useEffect(() => {
    const onReplay = (event: Event) => {
      const detail = (event as CustomEvent<VersionBPreviewState>).detail
      if (detail === "filter-transition") {
        startFilterTransitionFlow()
      }
    }
    window.addEventListener("vb-scenario-replay", onReplay)
    return () => window.removeEventListener("vb-scenario-replay", onReplay)
  }, [startFilterTransitionFlow])

  useEffect(() => {
    if (!isVersionB || previewState !== "filter-transition" || platform === "app") return
    if (filterTransitionBooted.current || view !== "jobs") return
    filterTransitionBooted.current = true
    startFilterTransitionFlow()
  }, [isVersionB, previewState, platform, view, startFilterTransitionFlow])

  const handleVersionBPlatformChange = useCallback(
    (next: VersionBPlatform) => {
      setPlatform(next)
      if (view === "home") {
        if (previewState === "filter-transition" && next !== "app") {
          startFilterTransitionFlow()
        } else {
          openVersionBSerp(next, previewState)
        }
      }
    },
    [setPlatform, view, previewState, openVersionBSerp, startFilterTransitionFlow],
  )

  const handleVersionBScenarioChange = useCallback(
    (next: VersionBPreviewState) => {
      setPreviewState(next)
      if (next === "filter-transition" && platform !== "app") {
        startFilterTransitionFlow()
        return
      }
      if (view === "home") {
        openVersionBSerp(platform, next)
      }
    },
    [setPreviewState, view, platform, openVersionBSerp, startFilterTransitionFlow],
  )

  useEffect(() => {
    if (!isVersionB || view !== "home" || platform !== "app") return
    openVersionBSerp("app", previewState)
  }, [isVersionB, view, platform, previewState, openVersionBSerp])

  if (!inPrototypeMode || !conceptId) {
    return (
      <PrototypeLibraryPage
        folderId={folderId}
        onOpenFolder={openFolder}
        onGoToRoot={goToRoot}
      />
    )
  }

  const chrome = (
    <PrototypeChrome
      conceptId={conceptId}
      platform={usesPlatformParam ? platform : undefined}
      onPlatformChange={
        isVersionB ? handleVersionBPlatformChange : usesPlatformParam ? setPlatform : undefined
      }
    />
  )

  if (view === "home") {
    return (
      <>
        {isVersionB ? (
          <VersionBHomePage
            onSearch={handleHomeSearch}
            filterState={filterState}
            platform={platform}
            previewState={previewState}
          />
        ) : (
          <SeekHomePage onSearch={handleHomeSearch} filterState={filterState} />
        )}
        {chrome}
        {isVersionB ? (
          <VersionBScenarioPanel
            previewState={previewState}
            onPreviewStateChange={handleVersionBScenarioChange}
          />
        ) : null}
      </>
    )
  }

  const jobsView = (
    <>
      <ConceptViewport
        conceptId={conceptId}
        filterState={filterState}
        platform={platform}
        previewState={previewState}
      />
      {chrome}
      {isVersionB ? (
        <VersionBScenarioPanel
          previewState={previewState}
          onPreviewStateChange={handleVersionBScenarioChange}
        />
      ) : null}
      {isFutureVision ? <FutureVisionWhatsNewPanel /> : null}
    </>
  )

  if (isFutureVision) {
    return (
      <FutureVisionExplainabilityProvider>{jobsView}</FutureVisionExplainabilityProvider>
    )
  }

  return jobsView
}
