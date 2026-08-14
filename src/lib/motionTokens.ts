/** Centralised motion tokens — see motion-designskill.mdc */
export const motionTokens = {
  duration: { fast: 0.15, base: 0.2, slow: 0.3 },
  ease: {
    out: [0.16, 1, 0.3, 1] as const,
    in: [0.4, 0, 1, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
  },
  spring: { surface: { type: "spring" as const, stiffness: 400, damping: 32 } },
  offset: { rise: 8 },
} as const

export const filterSurfaceTransition = {
  opacity: { duration: motionTokens.duration.base, ease: motionTokens.ease.out },
  scale: motionTokens.spring.surface,
} as const
