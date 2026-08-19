export const VERSION_B_FROM_HOME_KEY = "vb-from-home"
export const VERSION_B_HOME_MORE_OPTIONS_KEY = "vb-home-more-options"

export function markVersionBFromHome() {
  try {
    sessionStorage.setItem(VERSION_B_FROM_HOME_KEY, "1")
  } catch {
    /* sessionStorage unavailable */
  }
}

export function consumeVersionBFromHome(): boolean {
  try {
    const value = sessionStorage.getItem(VERSION_B_FROM_HOME_KEY) === "1"
    sessionStorage.removeItem(VERSION_B_FROM_HOME_KEY)
    return value
  } catch {
    return false
  }
}

export function markVersionBHomeMoreOptions() {
  try {
    sessionStorage.setItem(VERSION_B_HOME_MORE_OPTIONS_KEY, "1")
  } catch {
    /* sessionStorage unavailable */
  }
}

export function consumeVersionBHomeMoreOptions(): boolean {
  try {
    const value = sessionStorage.getItem(VERSION_B_HOME_MORE_OPTIONS_KEY) === "1"
    if (value) {
      queueMicrotask(() => {
        try {
          sessionStorage.removeItem(VERSION_B_HOME_MORE_OPTIONS_KEY)
        } catch {
          /* sessionStorage unavailable */
        }
      })
    }
    return value
  } catch {
    return false
  }
}
