import { IconInfo } from "@/components/braid/icons"
import type { VersionBPreviewState } from "@/src/data/versionBPresets"
import { motionTokens } from "@/src/lib/motionTokens"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

interface VersionBStrongApplicantBlankBannerProps {
  visible: boolean
  className?: string
  spotlight?: VersionBPreviewState
}

const expandSpring = { type: "spring" as const, stiffness: 200, damping: 38 }

/** Blank search + Strong applicant — Figma 4433:40316 notice in the results column */
export function VersionBStrongApplicantBlankBanner({
  visible,
  className,
  spotlight,
}: VersionBStrongApplicantBlankBannerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          key="sa-blank-notice"
          role="status"
          data-vb-spotlight={spotlight}
          className={className}
          initial={
            reduceMotion
              ? false
              : { gridTemplateRows: "0fr", opacity: 0 }
          }
          animate={{ gridTemplateRows: "1fr", opacity: 1 }}
          exit={
            reduceMotion
              ? undefined
              : { gridTemplateRows: "0fr", opacity: 0 }
          }
          transition={{
            gridTemplateRows: reduceMotion ? { duration: 0 } : expandSpring,
            opacity: {
              duration: reduceMotion ? 0 : 0.35,
              ease: motionTokens.ease.out,
            },
          }}
          style={{ display: "grid" }}
        >
          <div className="overflow-hidden">
            <div className="flex items-start gap-3 pb-4">
              <IconInfo className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#1D559D]" aria-hidden />
              <p className="min-w-0 flex-1 text-base leading-6 text-[#1D559D]">
                Enter keywords or use filters to see if you have strong applicant jobs.
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
