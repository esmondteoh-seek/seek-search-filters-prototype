import { useCallback, useEffect, useState } from "react"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"

const PARAM = "vbState"

export function readVersionBPreviewFromUrl(): VersionBPreviewState {
  if (typeof window === "undefined") return "default"
  const value = new URLSearchParams(window.location.search).get(PARAM)
  if (value === "selected" || value === "scrolled") return value
  return "default"
}

function writeVersionBPreviewToUrl(state: VersionBPreviewState) {
  const url = new URL(window.location.href)
  url.searchParams.set(PARAM, state)
  window.history.replaceState(null, "", url.toString())
}

export function useVersionBPreviewState(enabled: boolean) {
  const [previewState, setPreviewStateInternal] = useState<VersionBPreviewState>(() =>
    enabled ? readVersionBPreviewFromUrl() : "default",
  )

  useEffect(() => {
    if (!enabled) return
    setPreviewStateInternal(readVersionBPreviewFromUrl())
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    writeVersionBPreviewToUrl(previewState)
  }, [enabled, previewState])

  const setPreviewState = useCallback(
    (next: VersionBPreviewState) => {
      if (!enabled) return
      setPreviewStateInternal(next)
    },
    [enabled],
  )

  return { previewState, setPreviewState }
}
