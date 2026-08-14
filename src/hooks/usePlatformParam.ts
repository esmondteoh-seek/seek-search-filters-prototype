import { useCallback, useEffect, useState } from "react"

export type Platform = "web" | "app"

const PARAM = "platform"

export function readPlatformFromUrl(): Platform {
  if (typeof window === "undefined") return "web"
  const value = new URLSearchParams(window.location.search).get(PARAM)
  return value === "app" ? "app" : "web"
}

function writePlatformToUrl(platform: Platform) {
  const url = new URL(window.location.href)
  url.searchParams.set(PARAM, platform)
  window.history.replaceState(null, "", url.toString())
}

export function usePlatformParam(enabled: boolean) {
  const [platform, setPlatformState] = useState<Platform>(() =>
    enabled ? readPlatformFromUrl() : "web",
  )

  useEffect(() => {
    if (!enabled) return
    setPlatformState(readPlatformFromUrl())
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    writePlatformToUrl(platform)
  }, [enabled, platform])

  const setPlatform = useCallback(
    (next: Platform) => {
      if (!enabled) return
      setPlatformState(next)
    },
    [enabled],
  )

  return { platform, setPlatform }
}
