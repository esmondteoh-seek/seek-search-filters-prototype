import { StrictMode, useMemo } from "react"
import { createRoot } from "react-dom/client"
import { VersionBPage } from "@/src/concepts/VersionBPage"
import { DEFAULT_SEARCH } from "@/src/hooks/searchQuery"
import { readSearchFromUrl } from "@/src/hooks/useAppNavigation"
import { useJobFilters } from "@/src/hooks/useJobFilters"
import { useVersionBPlatformParam } from "@/src/hooks/useVersionBPlatformParam"
import { useVersionBPreviewState } from "@/src/hooks/useVersionBPreviewState"
import { useSeekDocumentTitle } from "@/src/pages/SeekHomePage"
import "./index.css"

function resolveInitialSearch() {
  const fromUrl = readSearchFromUrl()
  if (fromUrl.keywords || fromUrl.location) return fromUrl
  return DEFAULT_SEARCH
}

function VersionBStandaloneApp() {
  const initialSearch = useMemo(() => resolveInitialSearch(), [])
  const filterState = useJobFilters({ initialSearch })
  const { search } = filterState
  const { platform } = useVersionBPlatformParam(true)
  const { previewState } = useVersionBPreviewState(true)

  useSeekDocumentTitle("jobs", search)

  return (
    <VersionBPage
      filterState={filterState}
      platform={platform}
      previewState={previewState}
    />
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VersionBStandaloneApp />
  </StrictMode>,
)
