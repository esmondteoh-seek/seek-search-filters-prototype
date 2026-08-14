import { useEffect, useMemo, useState } from "react"
import { SeekLogo } from "@/components/seek-logo"
import { cn } from "@/lib/utils"
import { getCompanyBrand, getCompanyInitials, getCompanyLogoSources } from "@/src/data/companyBrands"

export type CompanyLogoSize = "sm" | "md" | "card" | "wide" | "detail"

const SIZE_CLASS: Record<CompanyLogoSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12 md:h-14 md:w-14",
  card: "h-12 w-[72px] md:h-14 md:w-20",
  wide: "h-16 w-32",
  detail: "h-12 w-[120px] md:h-16 md:w-[160px]",
}

interface CompanyLogoProps {
  company: string
  size?: CompanyLogoSize
  className?: string
  /** Decorative in cards — omit alt. Use company name when the logo is the only company identifier. */
  decorative?: boolean
}

/** Production-like employer logo: white tile, contained mark, SEEK wordmark for SEEK jobs */
export function CompanyLogo({
  company,
  size = "card",
  className,
  decorative = true,
}: CompanyLogoProps) {
  const brand = getCompanyBrand(company)
  const sources = useMemo(() => getCompanyLogoSources(company), [company])
  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    setSourceIndex(0)
  }, [company, sources])

  const frameClass = cn(
    "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EAECF1] bg-white",
    SIZE_CLASS[size],
    className,
  )

  if (brand.isSeek) {
    return (
      <div className={cn(frameClass, "px-2")} aria-hidden={decorative || undefined}>
        <SeekLogo
          className={cn(
            "w-auto text-[#2E3849]",
            size === "detail" || size === "wide" ? "h-8 md:h-10" : "h-6 md:h-7",
          )}
        />
      </div>
    )
  }

  const activeSrc = sources[sourceIndex]

  if (activeSrc) {
    return (
      <div className={cn(frameClass, "p-1.5")} aria-hidden={decorative || undefined}>
        <img
          src={activeSrc}
          alt={decorative ? "" : `${company} logo`}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            setSourceIndex((prev) => (prev < sources.length - 1 ? prev + 1 : sources.length))
          }}
        />
      </div>
    )
  }

  const initials = getCompanyInitials(company)

  return (
    <div
      className={frameClass}
      style={{ backgroundColor: brand.color, borderColor: "transparent" }}
      aria-hidden={decorative || undefined}
    >
      <span className="text-[11px] font-bold leading-none tracking-wide text-white md:text-xs">
        {initials}
      </span>
    </div>
  )
}
