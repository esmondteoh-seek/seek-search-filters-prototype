/** Figma spot illustrations — Control_Dark (onboarding) + NoSearchResult_Dark (SA refine) */

function SpotLayer({
  inset,
  src,
}: {
  inset: string
  src: string
}) {
  return (
    <div className={`absolute ${inset}`}>
      <img alt="" className="absolute inset-0 size-full max-w-none" src={src} />
    </div>
  )
}

export function VersionBControlDarkSpotIllustration({ className }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto size-32 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      <SpotLayer inset="inset-[22.99%_21.4%_22.98%_21.4%]" src="/version-b/spot-control-dark/v17.svg" />
      <SpotLayer inset="inset-[17.27%_15.68%]" src="/version-b/spot-control-dark/v18.svg" />
      <SpotLayer inset="inset-[32.85%_63.34%_34.12%_31.33%]" src="/version-b/spot-control-dark/v19.svg" />
      <SpotLayer inset="inset-[36.17%_60.29%_52.41%_28.28%]" src="/version-b/spot-control-dark/v20.svg" />
      <SpotLayer inset="inset-[32.85%_47.34%_34.12%_47.33%]" src="/version-b/spot-control-dark/v21.svg" />
      <SpotLayer inset="inset-[46.77%_44.29%_41.8%_44.29%]" src="/version-b/spot-control-dark/v22.svg" />
      <SpotLayer inset="inset-[32.85%_31.33%_34.12%_63.34%]" src="/version-b/spot-control-dark/v23.svg" />
      <SpotLayer inset="inset-[55.73%_28.28%_32.85%_60.29%]" src="/version-b/spot-control-dark/v24.svg" />
    </div>
  )
}

export function VersionBNoSearchResultDarkSpotIllustration({ className }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto size-32 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      <SpotLayer inset="inset-[55.68%_31.94%_31.7%_55.44%]" src="/version-b/spot-no-search-dark/stroke.svg" />
      <SpotLayer inset="inset-[14.06%_14.67%_14.06%_14.06%]" src="/version-b/spot-no-search-dark/group.svg" />
      <SpotLayer inset="inset-[27.87%_5.44%_53.83%_51.85%]" src="/version-b/spot-no-search-dark/cloud1.svg" />
      <SpotLayer inset="inset-[70.21%_70.61%_18.53%_4.69%]" src="/version-b/spot-no-search-dark/cloud2.svg" />
    </div>
  )
}
