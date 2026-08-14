import { useCallback, useEffect, useState } from "react"
import type { VersionBPlatform } from "@/src/data/versionBPresets"

const PARAM = "platform"

function normalizePlatform(value: string | null): VersionBPlatform {
  if (value === "app") return "app"
  if (value === "mobile-web" || value === "mobile") return "mobile-web"
  if (value === "desktop") return "desktop"
  if (value === "web") return "desktop"
  return "desktop"
}

export function readVersionBPlatformFromUrl(): VersionBPlatform {
  if (typeof window === "undefined") return "desktop"
  return normalizePlatform(new URLSearchParams(window.location.search).get(PARAM))
}

function writeVersionBPlatformToUrl(platform: VersionBPlatform) {
  const url = new URL(window.location.href)
  url.searchParams.set(PARAM, platform)
  window.history.replaceState(null, "", url.toString())
}

export function useVersionBPlatformParam(enabled: boolean) {
  const [platform, setPlatformState] = useState<VersionBPlatform>(() =>
    enabled ? readVersionBPlatformFromUrl() : "desktop",
  )

  useEffect(() => {
    if (!enabled) return
    setPlatformState(readVersionBPlatformFromUrl())
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    writeVersionBPlatformToUrl(platform)
  }, [enabled, platform])

  const setPlatform = useCallback(
    (next: VersionBPlatform) => {
      if (!enabled) return
      setPlatformState(next)
    },
    [enabled],
  )

  return { platform, setPlatform }
}
