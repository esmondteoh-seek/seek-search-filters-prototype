import { useEffect, useState } from "react"
import { Disclosure, Heading, Text, TextLink } from "@/components/braid"
import {
  IconCompany,
  IconLocation,
  IconNewWindow,
  IconPositive,
  IconSalary,
  IconShare,
  IconStarFilled,
} from "@/components/braid/icons"
import { SeekLogo } from "@/components/seek-logo"
import { CompanyLogo } from "@/src/components/shared/CompanyLogo"
import { cn } from "@/lib/utils"
import { type Job, formatSalary, getStrongApplicantTier } from "@/src/data/jobs"
import { DEFAULT_HERO, getCompanyHeroImageUrl } from "@/src/data/companyBrands"

interface JobDetailPanelProps {
  job: Job | null
  /** panel = desktop split view; page = mobile full detail */
  variant?: "panel" | "page"
  bookmarked?: boolean
  onBookmark?: () => void
  /** Hide inline Apply/Save — used when mobile sticky footer renders actions */
  hideActions?: boolean
  /** vSAB concept — surfaces very strong applicant messaging only */
  vsab?: boolean
  /** Version A — Figma 17292:45149 / 17290:39535 detail chrome */
  chrome?: "default" | "delivery"
}

function DetailMetaRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-4 text-base leading-[25px] text-[#2E3849]">
      <span className="shrink-0 text-[#5A6881]" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  )
}

function JobDescriptionContent({ job }: { job: Job }) {
  if (job.detailSections?.length) {
    return (
      <div className="flex flex-col gap-4 py-2">
        {job.detailSections.map((section) => (
          <section key={section.title}>
            <Heading level="4" component="h2" weight="medium" className="text-[#2E3849]">
              {section.title}
            </Heading>
            {section.body &&
              section.body.split("\n\n").map((paragraph, pIndex) => (
                <Text key={`${section.title}-p-${pIndex}`} className="mt-4 leading-[25px] text-[#2E3849]">
                  {paragraph.split("\n").map((line, i) => (
                    <span key={`${section.title}-l-${i}`}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </Text>
              ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-[#2E3849]">
                {section.bullets.map((item) => (
                  <li key={item} className="leading-[25px]">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    )
  }

  const paragraphs =
    job.descriptionParagraphs ??
    (job.description ? [job.description] : [])

  return (
    <div className="flex flex-col gap-4 py-2">
      {paragraphs.map((paragraph, index) => (
        <Text key={index} className="leading-[25px] text-[#2E3849]">
          {paragraph}
        </Text>
      ))}
    </div>
  )
}

interface JobDetailActionsProps {
  bookmarked: boolean
  onBookmark?: () => void
  applyLabel?: string
  saveVariant?: "promote" | "form"
  className?: string
}

export function JobDetailActions({
  bookmarked,
  onBookmark,
  applyLabel = "Apply",
  saveVariant = "promote",
  className,
}: JobDetailActionsProps) {
  const saveClasses =
    saveVariant === "form"
      ? "bg-[#F0F7FE] text-[#1E47A9] hover:bg-[#E5F0FD]"
      : "bg-[#F8F6FE] text-[#6E56E6] hover:bg-[#F0EBFE]"

  return (
    <div className={cn("flex gap-4", className)}>
      <button
        type="button"
        className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#E60278] px-6 text-base font-medium text-white hover:bg-[#CC0269] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
      >
        {applyLabel}
        {applyLabel === "Apply" && <IconNewWindow className="h-[18px] w-[18px]" aria-hidden />}
      </button>
      <button
        type="button"
        onClick={onBookmark}
        className={cn(
          "inline-flex h-12 shrink-0 items-center justify-center rounded-lg px-8 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2",
          saveClasses,
        )}
      >
        {bookmarked ? "Saved" : "Save"}
      </button>
    </div>
  )
}

interface JobDetailBodyProps {
  job: Job
  variant: "panel" | "page"
  bookmarked: boolean
  onBookmark?: () => void
  hideActions?: boolean
  vsab?: boolean
  chrome?: "default" | "delivery"
}

function JobDetailBody({
  job,
  variant,
  bookmarked,
  onBookmark,
  hideActions,
  vsab = false,
  chrome = "default",
}: JobDetailBodyProps) {
  const isPage = variant === "page"
  const isDelivery = chrome === "delivery"

  const locationLabel =
    job.remoteOption === "Hybrid"
      ? `${job.location} (Hybrid)`
      : job.remoteOption === "Fully remote"
        ? `${job.location} (Fully remote)`
        : job.location
  const classificationLabel = job.subClassification ?? job.classification
  const salaryDisplay = job.salaryLabel ?? formatSalary(job.salaryMin, job.salaryMax)
  const rating = job.companyRating ?? 3.5
  const reviewCount = job.reviewCount ?? 317
  const heroUrl = getCompanyHeroImageUrl(job.company, job.heroImageUrl)
  const [heroSrc, setHeroSrc] = useState(heroUrl)

  useEffect(() => {
    setHeroSrc(heroUrl)
  }, [heroUrl])

  const showAppliedBanner = Boolean(job.appliedOn)
  const strongApplicantTier = getStrongApplicantTier(job)
  const showStrongApplicantBanner =
    isPage &&
    !job.appliedOn &&
    (vsab ? strongApplicantTier === "veryStrong" : strongApplicantTier != null)

  const contentPadding = isPage ? "px-3" : "px-6"
  const postedLabel = job.postedLabel.toLowerCase().startsWith("posted")
    ? job.postedLabel
    : `Posted ${job.postedLabel}`

  return (
    <div className={cn("flex flex-col pb-16", isDelivery ? "gap-8" : "gap-16")}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-[#EAECF1]",
          isDelivery ? "h-[120px] md:h-[160px]" : "h-[186px] md:h-[256px]",
          !isPage && (isDelivery ? "rounded-t-xl" : "rounded-t-2xl"),
        )}
      >
        <img
          src={heroSrc}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setHeroSrc(DEFAULT_HERO)}
        />
      </div>

      {/* Header cluster — Figma 17292:45149 */}
      <div className={cn("flex flex-col", isDelivery ? "gap-5" : "gap-8", contentPadding)}>
        <div className="flex flex-col gap-4">
          <div className={cn("flex flex-col", isDelivery ? "gap-4" : "gap-8")}>
            {showStrongApplicantBanner && (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium",
                  vsab && strongApplicantTier === "veryStrong"
                    ? "bg-[#7F35A9] text-white"
                    : "bg-[#F9EBFD] text-[#7F35A9]",
                )}
                role="status"
              >
                {vsab && strongApplicantTier === "veryStrong"
                  ? "You may be a very strong applicant"
                  : "You may be a strong applicant"}
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <CompanyLogo
                company={job.company}
                size={isDelivery ? "card" : "detail"}
                decorative={false}
              />
              <div className="flex shrink-0 items-center gap-2">
                {isDelivery ? (
                  <>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F7] text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
                      aria-label="Open job in new window"
                    >
                      <IconNewWindow className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F7] text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
                      aria-label="Share job"
                    >
                      <IconShare className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="flex shrink-0 items-center justify-center rounded-[20px] bg-[#F3F5F7] p-2 text-[#2E3849] hover:bg-[#EAECF1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9]"
                    aria-label="Share job"
                  >
                    <IconShare className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            {showAppliedBanner && (
              <div
                className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-[#138A08] bg-[#E2F7F1]"
                role="status"
              >
                <IconPositive className="h-5 w-5 shrink-0" aria-hidden />
                You applied on {job.appliedOn}
              </div>
            )}
          </div>

          <div className="flex items-start gap-4">
            <Heading
              level="2"
              component="h1"
              className="min-w-0 flex-1 text-[30px] font-medium leading-[37px] text-[#2E3849]"
            >
              {job.title}
            </Heading>
            {!isDelivery ? (
              <IconNewWindow className="mt-1 h-[30px] w-[30px] shrink-0 text-[#2E3849]" aria-hidden />
            ) : null}
          </div>
        </div>

        {/* Company + meta — Figma gap 24px */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
            <Text className="text-lg leading-[27px] text-[#2E3849]">{job.company}</Text>
            {reviewCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-base leading-[25px] text-[#2E3849]">
                <IconStarFilled className="h-[18px] w-[18px] text-[#E05821]" aria-hidden />
                <span className="tabular-nums">{rating.toFixed(1)}</span>
                <span aria-hidden>{isDelivery ? " — " : "·"}</span>
                <TextLink href="#" className="text-base font-medium">
                  {reviewCount} reviews
                </TextLink>
              </span>
            )}
          </div>

          <ul className="flex flex-col gap-4">
            <DetailMetaRow icon={<IconLocation className="h-[18px] w-[18px]" />}>
              {locationLabel}
            </DetailMetaRow>
            {isDelivery ? (
              <>
                <DetailMetaRow icon={<IconSalary className="h-[18px] w-[18px]" />}>
                  {salaryDisplay}
                </DetailMetaRow>
                <DetailMetaRow icon={<IconCompany className="h-[18px] w-[18px]" />}>
                  {classificationLabel}
                </DetailMetaRow>
              </>
            ) : (
              <>
                <DetailMetaRow icon={<IconCompany className="h-[18px] w-[18px]" />}>
                  {classificationLabel}
                </DetailMetaRow>
                <DetailMetaRow icon={<IconSalary className="h-[18px] w-[18px]" />}>
                  {salaryDisplay}
                </DetailMetaRow>
              </>
            )}
          </ul>
        </div>

        <Text tone="secondary" className="text-base leading-[25px]">
          {isDelivery ? postedLabel : job.postedLabel}
        </Text>

        {!isDelivery ? (
          <div className="flex flex-col gap-8">
            <TextLink href="#" className="text-base font-medium">
              More jobs from this company
            </TextLink>

            {!hideActions && (
              <JobDetailActions bookmarked={bookmarked} onBookmark={onBookmark} />
            )}
          </div>
        ) : null}
      </div>

      {/* Description — Figma gap 64px from actions */}
      <div className={contentPadding}>
        <JobDescriptionContent job={job} />
      </div>

      {/* Lower sections — Figma gap 64px each */}
      <div className={cn("flex flex-col gap-16", contentPadding)}>
        {job.companyRegistration &&
          (job.companyRegistration.registrationNo || job.companyRegistration.poeaNo) && (
            <section>
              <Heading level="4" component="h2" weight="medium" className="text-base text-[#2E3849]">
                Company information
              </Heading>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                {job.companyRegistration.registrationNo && (
                  <div>
                    <Text weight="medium" className="text-base text-[#2E3849]">
                      Registration No.
                    </Text>
                    <Text className="mt-6 text-base text-[#2E3849]">
                      {job.companyRegistration.registrationNo}
                    </Text>
                  </div>
                )}
                {job.companyRegistration.poeaNo && (
                  <div>
                    <Text weight="medium" className="text-base text-[#2E3849]">
                      POEA No.
                    </Text>
                    <Text className="mt-6 text-base text-[#2E3849]">
                      {job.companyRegistration.poeaNo}
                    </Text>
                  </div>
                )}
              </div>
            </section>
          )}

        {job.employerQuestions && job.employerQuestions.length > 0 && (
          <section>
            <Heading level="3" component="h2" weight="medium" className="text-[22px] leading-[27px] text-[#2E3849]">
              Employer questions
            </Heading>
            <Text className="mt-4 leading-[25px] text-[#2E3849]">
              Your application will include the following questions:
            </Text>
            <ul className="mt-4 list-disc space-y-0 pl-6 text-[#2E3849]">
              {job.employerQuestions.map((question) => (
                <li key={question} className="leading-[25px]">
                  {question}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-6">
          <Heading level="4" component="h2" weight="medium" className="text-lg leading-[27px] text-[#2E3849]">
            Be careful
          </Heading>
          <Text className="leading-[25px] text-[#2E3849]">
            Don&apos;t provide your bank or credit card details when applying for jobs.
          </Text>
          <TextLink href="#" className="text-base font-medium">
            Learn how to protect yourself
          </TextLink>
          <Disclosure id="report-job-ad" label="Report this job ad" weight="medium">
            <Text size="small" tone="secondary" className="pt-3 text-[#2E3849]">
              If you believe this job ad is misleading or fraudulent, you can report it to SEEK for review.
            </Text>
          </Disclosure>
        </section>

        {job.careerAdvice && (
          <section className="rounded-3xl border-2 border-[#EAECF1] p-8">
            <div className="mb-6 flex items-center gap-1.5">
              <SeekLogo className="h-[21px] w-[54px] text-[#1D559D]" />
              <Text size="small" className="text-[#1D559D]">
                career advice
              </Text>
            </div>
            <Text weight="medium" className="mb-6 leading-[25px] text-[#2E3849]">
              {job.careerAdvice.title}
            </Text>
            <ul className="mb-6 list-disc space-y-4 pl-6 text-[#2E3849]">
              {job.careerAdvice.bullets.map((bullet) => (
                <li key={bullet} className="leading-[25px]">
                  {bullet}
                </li>
              ))}
            </ul>
            <TextLink href="#" className="text-base font-medium">
              Explore career
            </TextLink>
          </section>
        )}
      </div>
    </div>
  )
}

export function JobDetailPanel({
  job,
  variant = "panel",
  bookmarked = false,
  onBookmark,
  hideActions = false,
  vsab = false,
  chrome = "default",
}: JobDetailPanelProps) {
  const isPage = variant === "page"

  if (!job) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center rounded-t-2xl border border-b-0 border-[#EAECF1] bg-white p-8">
        <Text tone="secondary">Select a job to view details</Text>
      </div>
    )
  }

  const body = (
    <JobDetailBody
      job={job}
      variant={variant}
      bookmarked={bookmarked}
      onBookmark={onBookmark}
      hideActions={hideActions}
      vsab={vsab}
      chrome={chrome}
    />
  )

  if (isPage) {
    return <article className="bg-white">{body}</article>
  }

  return (
    <article
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden border border-b-0 border-[#EAECF1] bg-white",
        chrome === "delivery" ? "rounded-t-xl" : "rounded-t-2xl",
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarGutter: "stable" }}>
        {body}
      </div>
    </article>
  )
}
