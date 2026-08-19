import { useEffect, useState } from "react"
import { concepts, getConceptById, getFutureVisionLocationChrome, isFutureVisionConcept } from "@/src/concepts/index"
import type { UseJobFiltersReturn } from "@/src/hooks/useJobFilters"
import type { VersionBPlatform } from "@/src/data/versionBPresets"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { VersionBPage } from "@/src/concepts/VersionBPage"
import { FutureVisionPage } from "@/src/concepts/FutureVisionPage"
import { MultiLocationFramingPage } from "@/src/pages/MultiLocationFramingPage"
import { VersionBContextPage } from "@/src/pages/VersionBContextPage"

/** Crossfade wrapper — fades on concept/platform change; previewState updates in place */
export function ConceptViewport({
  conceptId,
  filterState,
  platform = "desktop",
  previewState = "filters",
}: {
  conceptId: string
  filterState: UseJobFiltersReturn
  platform?: VersionBPlatform
  previewState?: VersionBPreviewState
}) {
  const [visible, setVisible] = useState(true)
  const [renderedId, setRenderedId] = useState(conceptId)
  const [renderedPlatform, setRenderedPlatform] = useState(platform)

  useEffect(() => {
    if (conceptId === renderedId && platform === renderedPlatform) {
      return
    }
    setVisible(false)
    const timer = window.setTimeout(() => {
      setRenderedId(conceptId)
      setRenderedPlatform(platform)
      requestAnimationFrame(() => setVisible(true))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [conceptId, renderedId, platform, renderedPlatform])

  const concept = getConceptById(renderedId) ?? concepts[0]
  const Page = concept.component

  return (
    <div
      className="concept-viewport transition-opacity duration-[350ms] ease-out motion-reduce:transition-none"
      style={{ opacity: visible ? 1 : 0 }}
      aria-busy={!visible}
    >
      {renderedId === "version-b" ? (
        <VersionBPage
          filterState={filterState}
          platform={renderedPlatform}
          previewState={previewState}
        />
      ) : isFutureVisionConcept(renderedId) ? (
        <FutureVisionPage
          filterState={filterState}
          platform={renderedPlatform}
          locationChrome={getFutureVisionLocationChrome(renderedId)}
        />
      ) : renderedId === "mls-framing" ? (
        <MultiLocationFramingPage filterState={filterState} />
      ) : renderedId === "vb-context" ? (
        <VersionBContextPage filterState={filterState} />
      ) : (
        <Page filterState={filterState} />
      )}
    </div>
  )
}
