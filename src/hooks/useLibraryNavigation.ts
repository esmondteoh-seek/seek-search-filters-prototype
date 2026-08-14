import { useCallback, useEffect, useState } from "react"
import {
  getFolderForConcept,
  isValidFolderId,
  type LibraryFolderId,
} from "@/src/prototype/library"
import { notifyNavigationChange } from "@/src/hooks/navigationEvents"

const FOLDER_PARAM = "folder"

export function readFolderFromUrl(): LibraryFolderId | null {
  if (typeof window === "undefined") return null
  const folder = new URLSearchParams(window.location.search).get(FOLDER_PARAM)
  return isValidFolderId(folder) ? folder : null
}

function writeFolderToUrl(folder: LibraryFolderId | null) {
  const url = new URL(window.location.href)
  if (folder) url.searchParams.set(FOLDER_PARAM, folder)
  else url.searchParams.delete(FOLDER_PARAM)
  window.history.replaceState(null, "", url.toString())
}

export function navigateToLibrary(folder: LibraryFolderId | null = null) {
  const url = new URL(window.location.origin + "/")
  if (folder) url.searchParams.set(FOLDER_PARAM, folder)
  url.searchParams.delete("concept")
  url.searchParams.delete("platform")
  url.searchParams.delete("vbState")
  url.searchParams.delete("keywords")
  url.searchParams.delete("location")
  window.history.pushState(null, "", url.pathname + url.search)
  notifyNavigationChange()
}

export function useLibraryNavigation() {
  const [folderId, setFolderId] = useState<LibraryFolderId | null>(readFolderFromUrl)

  useEffect(() => {
    const onPopState = () => setFolderId(readFolderFromUrl())
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const openFolder = useCallback((folder: LibraryFolderId) => {
    const url = new URL(window.location.origin + "/")
    url.searchParams.set(FOLDER_PARAM, folder)
    window.history.pushState(null, "", url.pathname + url.search)
    setFolderId(folder)
  }, [])

  const goToRoot = useCallback(() => {
    navigateToLibrary(null)
    setFolderId(null)
  }, [])

  const backToFolderForConcept = useCallback((conceptId: string) => {
    const folder = getFolderForConcept(conceptId)
    navigateToLibrary(folder)
    setFolderId(folder)
  }, [])

  return {
    folderId,
    openFolder,
    goToRoot,
    backToFolderForConcept,
    writeFolderToUrl,
  }
}
