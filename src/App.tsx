import { useEffect, useMemo } from "react"
import { useJobFilters } from "@/src/hooks/useJobFilters"
import { useConceptParam } from "@/src/hooks/useConceptParam"
import { isFutureVisionConcept } from "@/src/concepts/index"
import { ConceptViewport } from "@/src/components/prototype/ConceptViewport"
import { PrototypeChrome } from "@/src/components/prototype/PrototypeChrome"
import { SeekHomePage, useSeekDocumentTitle } from "@/src/pages/SeekHomePage"
import { PrototypeLibraryPage } from "@/src/pages/PrototypeLibraryPage"
import { DEFAULT_SEARCH } from "@/src/hooks/searchQuery"
import { readAppView, readSearchFromUrl, redirectPrototypeToJobsIfNeeded, useAppNavigation } from "@/src/hooks/useAppNavigation"
import { useLibraryNavigation } from "@/src/hooks/useLibraryNavigation"
import { useVersionBPlatformParam } from "@/src/hooks/useVersionBPlatformParam"
import { useVersionBPreviewState } from "@/src/hooks/useVersionBPreviewState"
import {
  FutureVisionExplainabilityProvider,
  FutureVisionWhatsNewPanel,
} from "@/src/components/futureVision/FutureVisionExplainability"

function resolveInitialSearch() {
  if (readAppView() !== "jobs") return DEFAULT_SEARCH
  const fromUrl = readSearchFromUrl()
  if (fromUrl.keywords || fromUrl.location) return fromUrl
  return DEFAULT_SEARCH
}

export default function App() {
  const initialSearch = useMemo(() => resolveInitialSearch(), [])
  const filterState = useJobFilters({ initialSearch })
  const { applySearchQuery, search } = filterState
  const { conceptId, inPrototypeMode } = useConceptParam()
  const { view, navigateToJobs, replaceJobsSearchInUrl } = useAppNavigation()
  const { folderId, openFolder, goToRoot } = useLibraryNavigation()
  const isVersionB = conceptId === "version-b"
  const isFutureVision = isFutureVisionConcept(conceptId)
  const usesPlatformParam = isVersionB || isFutureVision
  const { platform, setPlatform } = useVersionBPlatformParam(usesPlatformParam)
  const { previewState } = useVersionBPreviewState(isVersionB)

  useSeekDocumentTitle(view, search)

  useEffect(() => {
    redirectPrototypeToJobsIfNeeded()
  }, [])

  useEffect(() => {
    if (!inPrototypeMode || view !== "jobs") return
    if (isFutureVisionConcept(conceptId) || conceptId === "version-b") return
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
      onPlatformChange={usesPlatformParam ? setPlatform : undefined}
    />
  )

  if (view === "home") {
    return (
      <>
        <SeekHomePage onSearch={handleHomeSearch} />
        {chrome}
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
