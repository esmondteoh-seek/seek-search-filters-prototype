import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { filterSurfaceTransition, motionTokens } from "@/src/lib/motionTokens"

export interface FilterSurfaceTheme {
  rounded: string
  activeBg: string
  inactiveBg?: string
  inactiveBorder?: string
  textActive: string
  textInactive: string
}

interface FilterSurfaceLayersProps {
  active: boolean
  theme: FilterSurfaceTheme
}

/** Opacity crossfade layers — compositor-friendly per motion-designskill */
export function FilterSurfaceLayers({ active, theme }: FilterSurfaceLayersProps) {
  const reduceMotion = useReducedMotion()

  return (
    <>
      {theme.inactiveBorder || theme.inactiveBg ? (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            theme.rounded,
            theme.inactiveBg,
            theme.inactiveBorder,
          )}
          initial={false}
          animate={{ opacity: active ? 0 : 1 }}
          transition={{ opacity: filterSurfaceTransition.opacity }}
        />
      ) : null}

      <motion.span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", theme.rounded, theme.activeBg)}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: active ? 1 : 0 }
            : { opacity: active ? 1 : 0, scale: active ? 1 : 0.98 }
        }
        transition={{
          opacity: filterSurfaceTransition.opacity,
          scale: reduceMotion ? undefined : filterSurfaceTransition.scale,
        }}
        style={{ transformOrigin: "center" }}
      />
    </>
  )
}

interface FilterSurfaceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
  theme: FilterSurfaceTheme
  children: ReactNode
  contentClassName?: string
}

/** Layered filter pill button with motion surface crossfade */
export const FilterSurfaceButton = forwardRef<HTMLButtonElement, FilterSurfaceButtonProps>(
  function FilterSurfaceButton(
    { active, theme, children, className, contentClassName, ...buttonProps },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        {...buttonProps}
        className={cn(
          "relative inline-flex shrink-0 items-center overflow-hidden font-normal",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "active:scale-[0.98]",
          theme.rounded,
          active ? theme.textActive : theme.textInactive,
          className,
        )}
      >
        <FilterSurfaceLayers active={active} theme={theme} />
        <span className={cn("relative z-10 inline-flex items-center", contentClassName)}>{children}</span>
      </button>
    )
  },
)

interface FilterTickProps {
  visible: boolean
  children: ReactNode
  className?: string
}

/** Tick reveal — opacity + scale; AnimatePresence for exit */
export function FilterTick({ visible, children, className }: FilterTickProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.span
          key="tick"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          transition={{
            opacity: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out },
            scale: reduceMotion ? undefined : motionTokens.spring.surface,
          }}
          className={cn("inline-flex h-5 w-5 shrink-0 items-center justify-center", className)}
          aria-hidden
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  )
}

export const filterPillThemes = {
  navy: {
    rounded: "rounded-full",
    activeBg: "bg-[#2455C9]",
    inactiveBorder: "border border-white/50",
    inactiveBg: "bg-transparent",
    textActive: "text-white",
    textInactive: "text-white",
  },
  bar: {
    rounded: "rounded-lg",
    activeBg: "bg-[#2E3849]",
    inactiveBorder: "border-2 border-[#EAECF1]",
    inactiveBg: "bg-white",
    textActive: "text-white",
    textInactive: "text-[#2E3849]",
  },
  compact: {
    rounded: "rounded-full",
    activeBg: "bg-[#2455C9]",
    inactiveBorder: "border-2 border-white/25",
    inactiveBg: "bg-transparent",
    textActive: "text-white",
    textInactive: "text-white",
  },
} as const satisfies Record<string, FilterSurfaceTheme>

export const strongApplicantSegmentTheme: FilterSurfaceTheme = {
  rounded: "rounded-xl",
  activeBg: "border-2 border-[#1E47A9] bg-white",
  inactiveBg: "bg-white",
  inactiveBorder: "border-2 border-[#EAECF1]",
  textActive: "font-normal text-[#2E3849] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
  textInactive:
    "font-normal text-[#2E3849] hover:bg-[#F7F8FB] focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
}
