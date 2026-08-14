import { useEffect, useState } from "react"
import { concepts, getConceptById } from "@/src/concepts/index"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { VersionBPage } from "@/src/concepts/VersionBPage"
import { FutureVisionPage } from "@/src/concepts/FutureVisionPage"

/** Crossfade wrapper — ~200ms opacity transition between concepts */
export function ConceptViewport({
  conceptId,
  filterState,
  platform = "desktop",
  previewState = "default",
}: {
  conceptId: string
  filterState: UseJobFiltersReturn
  platform?: VersionBPlatform
  previewState?: VersionBPreviewState
}) {
  const [visible, setVisible] = useState(true)
  const [renderedId, setRenderedId] = useState(conceptId)
  const [renderedPlatform, setRenderedPlatform] = useState(platform)
  const [renderedPreview, setRenderedPreview] = useState(previewState)

  useEffect(() => {
    if (
      conceptId === renderedId &&
      platform === renderedPlatform &&
      previewState === renderedPreview
    ) {
      return
    }
    setVisible(false)
    const timer = window.setTimeout(() => {
      setRenderedId(conceptId)
      setRenderedPlatform(platform)
      setRenderedPreview(previewState)
      requestAnimationFrame(() => setVisible(true))
    }, 200)
    return () => window.clearTimeout(timer)
  }, [conceptId, renderedId, platform, renderedPlatform, previewState, renderedPreview])

  const concept = getConceptById(renderedId) ?? concepts[0]
  const Page = concept.component

  return (
    <div
      className="concept-viewport transition-opacity duration-200 ease-out motion-reduce:transition-none"
      style={{ opacity: visible ? 1 : 0 }}
      aria-busy={!visible}
    >
      {renderedId === "version-b" ? (
        <VersionBPage
          filterState={filterState}
          platform={renderedPlatform}
          previewState={renderedPreview}
        />
      ) : renderedId === "future-vision" ? (
        <FutureVisionPage filterState={filterState} platform={renderedPlatform} />
      ) : (
        <Page filterState={filterState} />
      )}
    </div>
  )
}
