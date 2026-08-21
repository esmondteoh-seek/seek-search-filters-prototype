import { cn } from "@/lib/utils"
import { VERSION_B_TOKENS } from "@/src/components/versionB/versionBTokens"

interface NtyDotProps {
  className?: string
}

/** NTY indicator — 12px mint outer + dark green inner dot with lively pulse */
export function NtyDot({ className }: NtyDotProps) {
  return (
    <span
      className={cn(
        "nty-dot-pulse inline-flex size-3 shrink-0 items-center justify-center rounded-full",
        className,
      )}
      style={{ backgroundColor: VERSION_B_TOKENS.ntyDotOuter }}
      aria-hidden
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: VERSION_B_TOKENS.ntyDotInner }}
      />
    </span>
  )
}

/** App header filter icon — 8px blue dot when fixed filters are applied */
export function FilterAppliedDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute right-1 top-1 size-2 shrink-0 rounded-full",
        className,
      )}
      style={{ backgroundColor: VERSION_B_TOKENS.formAccent }}
      aria-hidden
    />
  )
}

/** New to you — large outlined 4-point sparkle + small filled sparkle (asset) */
export function NewToYouIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-[18px] w-[18px] shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M13.2 5.6 15.35 11.9 21.6 14 15.35 16.1 13.2 22.4 11.05 16.1 4.8 14 11.05 11.9Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M6.15 1.35 7.12 3.95 9.75 4.9 7.12 5.85 6.15 8.45 5.18 5.85 2.55 4.9 5.18 3.95Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Strong applicant — Braid IconExperience (faceted gem) */
export function StrongApplicantIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="m22.832 8.445-4-6A1 1 0 0 0 18 2H6a1 1 0 0 0-.832.445l-4 6a1 1 0 0 0 .063 1.196l10 12c.01.01.025.015.034.026a.984.984 0 0 0 .231.177c.034.02.06.05.097.065A.99.99 0 0 0 12 22a.99.99 0 0 0 .407-.09c.036-.017.063-.045.097-.065a.985.985 0 0 0 .23-.178c.01-.01.025-.015.035-.026l10-12a1 1 0 0 0 .063-1.196ZM20.132 8H16.72l-1.333-4h2.078l2.667 4ZM13.28 4l1.333 4H9.387l1.333-4h2.56ZM11 10v8.238L4.135 10H11Zm2 0h6.865L13 18.238V10ZM6.535 4h2.078L7.28 8H3.868l2.667-4Z" />
    </svg>
  )
}

/** @deprecated Use StrongApplicantIcon */
export const StrongApplicantDiamond = StrongApplicantIcon

export function AppTabHomeIcon({ active }: { active: boolean }) {
  const color = active ? VERSION_B_TOKENS.formAccent : "#697586"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9V20.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z"
        fill={active ? color : "none"}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AppTabRecommendedIcon({ active }: { active: boolean }) {
  const color = active ? VERSION_B_TOKENS.formAccent : "#697586"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 10.5V21M17 10.5V21M3 10.5h18L12 3 3 10.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AppTabActivityIcon({ active }: { active: boolean }) {
  const color = active ? VERSION_B_TOKENS.formAccent : "#697586"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.5L6 20V5a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AppTabProfileIcon({ active }: { active: boolean }) {
  const color = active ? VERSION_B_TOKENS.formAccent : "#697586"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.5" />
      <path
        d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
