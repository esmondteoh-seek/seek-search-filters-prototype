export type WorkType = "Full time" | "Part time" | "Contract" | "Casual"
export type RemoteOption = "On-site" | "Hybrid" | "Fully remote"
export type ListingTimeFilter = "any" | "today" | "3d" | "7d" | "14d" | "30d"
export type SortOption = "relevance" | "date"
/** vSAB — very strong vs strong applicant match tier */
export type StrongApplicantTier = "strong" | "veryStrong"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  suburb: string
  salaryMin: number
  salaryMax: number
  workType: WorkType
  remoteOption: RemoteOption
  classification: string
  /** Days since posted */
  listingAgeDays: number
  isNewToYou: boolean
  isStrongApplicant: boolean
  /** vSAB tier — set when `isStrongApplicant` is true */
  strongApplicantTier?: StrongApplicantTier
  isAtSeek: boolean
  isEarlyApplicant: boolean
  teaser: [string, string, string]
  description: string
  postedLabel: string
  /** Optional display overrides for detail panel */
  subClassification?: string
  salaryLabel?: string
  companyRating?: number
  reviewCount?: number
  verifiedEmployer?: boolean
  companyDescriptionTitle?: string
  companyDescription?: string
  aboutCompanyTitle?: string
  aboutCompany?: string
  /** Structured job detail sections — mirrors au.seek.com job page */
  detailSections?: { title: string; body?: string; bullets?: string[] }[]
  /** Flowing description paragraphs (Master JDV body) */
  descriptionParagraphs?: string[]
  heroImageUrl?: string
  appliedOn?: string
  employerQuestions?: string[]
  companyRegistration?: {
    registrationNo?: string
    poeaNo?: string
  }
  careerAdvice?: {
    title: string
    bullets: string[]
  }
  companyProfile?: {
    industry?: string
    employeeCount?: string
    description: string
    perks?: string[]
  }
}

/** Top-level SEEK ANZ job classifications — aligned with au.seek.com filter taxonomy */
export const CLASSIFICATIONS = [
  "Accounting",
  "Administration & Office Support",
  "Advertising, Arts & Media",
  "Banking & Financial Services",
  "Call Centre & Customer Service",
  "Community Services & Development",
  "Construction",
  "Consulting & Strategy",
  "Design & Architecture",
  "Education & Training",
  "Engineering",
  "Farming, Animals & Conservation",
  "Government & Defence",
  "Healthcare & Medical",
  "Hospitality & Tourism",
  "Human Resources & Recruitment",
  "Information & Communication Technology",
  "Insurance & Superannuation",
  "Legal",
  "Manufacturing, Transport & Logistics",
  "Marketing & Communications",
  "Mining, Resources & Energy",
  "Real Estate & Property",
  "Retail & Consumer Products",
  "Sales",
  "Science & Technology",
  "Sport & Recreation",
  "Trades & Services",
] as const

export const WORK_TYPES: WorkType[] = ["Full time", "Part time", "Contract", "Casual"]
export const REMOTE_OPTIONS: RemoteOption[] = ["On-site", "Hybrid", "Fully remote"]
export const DISTANCE_FILTER_OPTIONS = [
  { value: 0, label: "Exact location only" },
  { value: 2, label: "2 km" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 30, label: "30 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
] as const

/** @deprecated Use DISTANCE_FILTER_OPTIONS */
export const DISTANCE_OPTIONS = [5, 10, 25, 50, 100] as const

export const LISTING_TIME_OPTIONS: { value: ListingTimeFilter; label: string; maxDays: number | null }[] = [
  { value: "any", label: "Any time", maxDays: null },
  { value: "today", label: "Today", maxDays: 0 },
  { value: "3d", label: "Last 3 days", maxDays: 3 },
  { value: "7d", label: "Last 7 days", maxDays: 7 },
  { value: "14d", label: "Last 14 days", maxDays: 14 },
  { value: "30d", label: "Last 30 days", maxDays: 30 },
]

export type PayPeriod = "annual" | "monthly" | "hourly"

/** Annual salary amounts for pay filter — stored as annual in filter state */
export const PAY_FROM_AMOUNTS = [
  30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000,
] as const

export const PAY_TO_AMOUNTS = [
  60000, 80000, 100000, 120000, 150000, 200000, 250000, 300000, 350000,
] as const

/** Open-ended upper bound — maps to payMax: null */
export const PAY_TO_OPEN = 350000

export const PAY_PERIODS: { value: PayPeriod; label: string }[] = [
  { value: "annual", label: "Annually" },
  { value: "monthly", label: "Monthly" },
  { value: "hourly", label: "Hourly" },
]

export const PAY_PRESETS = [
  { label: "From $50k", min: 50000, max: null as number | null },
  { label: "From $40k", min: 40000, max: null },
  { label: "From $60k", min: 60000, max: null },
  { label: "From $80k", min: 80000, max: null },
  { label: "$80k – $120k", min: 80000, max: 120000 },
  { label: "$100k – $150k", min: 100000, max: 150000 },
  { label: "From $150k", min: 150000, max: null },
] as const

export function formatPayFilterAmount(amount: number, period: PayPeriod, openEnded = false): string {
  if (period === "monthly") {
    const monthly = Math.round(amount / 12)
    return openEnded ? `$${monthly.toLocaleString("en-AU")}+` : `$${monthly.toLocaleString("en-AU")}`
  }
  if (period === "hourly") {
    const hourly = Math.round(amount / 2080)
    return openEnded ? `$${hourly}+` : `$${hourly}`
  }
  const label = `$${Math.round(amount / 1000)}K`
  return openEnded ? `${label}+` : label
}

const MELBOURNE_SUBURBS = [
  "Melbourne CBD",
  "Southbank",
  "Richmond",
  "Carlton",
  "Cremorne",
  "Docklands",
  "South Yarra",
  "Fitzroy",
  "Hawthorn",
  "Footscray",
] as const

const SYDNEY_SUBURBS = [
  "Sydney CBD",
  "Parramatta",
  "North Sydney",
  "Chatswood",
  "Surry Hills",
  "Barangaroo",
  "Macquarie Park",
  "Bondi Junction",
] as const

function getExpansionPlace(batchIndex: number, globalIndex: number): { suburb: string; location: string } {
  const useSydney = globalIndex % 2 === 1
  if (useSydney) {
    const suburb = SYDNEY_SUBURBS[batchIndex % SYDNEY_SUBURBS.length]
    return { suburb, location: `${suburb}, Sydney NSW` }
  }
  const suburb = MELBOURNE_SUBURBS[batchIndex % MELBOURNE_SUBURBS.length]
  return { suburb, location: `${suburb}, Melbourne VIC` }
}

const EXPANDED_ROLE_TITLES = [
  "Marketing Lead",
  "Marketing Lead – Digital",
  "Senior Marketing Lead",
  "Lead Marketing Analyst",
  "Marketing Lead – Campaigns",
  "Marketing Lead – Brand",
] as const

const PROJECT_MANAGER_TITLES = [
  "Project Manager",
  "Infrastructure Project Manager",
  "SAP Project Manager",
  "Creative Project Manager",
  "Project Manager – Delivery",
  "Assistant Project Manager",
  "Project Manager – Sales Enablement",
  "Clinical Project Manager",
] as const

const DESIGN_TITLES = [
  "Product Designer",
  "Senior Product Designer",
  "UX Designer",
  "Visual Designer",
  "Design Lead",
  "Service Designer",
  "Interaction Designer",
  "Design Specialist",
] as const

const PRODUCT_TITLES = [
  "Product Manager",
  "Product Delivery Manager",
  "Product Owner",
  "Senior Product Owner",
  "Product Lead",
  "Associate Product Manager",
  "Product Manager – Growth",
  "Product Manager – Platform",
] as const

const FINANCE_MARKETING_TITLES = [
  "Finance Marketing Lead",
  "Marketing Lead – Finance",
  "Financial Services Marketing Lead",
  "Marketing Manager – Banking",
  "B2B Finance Marketing Lead",
  "Marketing Lead – Accounting",
] as const

const DELOITTE_TITLES = [
  "Senior Consultant",
  "Consultant",
  "Management Consultant",
  "Strategy Consultant",
  "Technology Consultant",
  "Senior Analyst",
] as const

interface ExpansionBatch {
  count: number
  titles: readonly string[]
  description: string
  classification: string
  company?: string
}

const EXPANSION_BATCHES: ExpansionBatch[] = [
  {
    count: 35,
    titles: EXPANDED_ROLE_TITLES,
    description: "Marketing lead role in Melbourne. Own campaign planning and deliver measurable marketing outcomes.",
    classification: "Marketing & Communications",
  },
  {
    count: 35,
    titles: PROJECT_MANAGER_TITLES,
    description: "Project manager role delivering cross-functional initiatives on time and within budget.",
    classification: "Consulting & Strategy",
  },
  {
    count: 35,
    titles: DESIGN_TITLES,
    description: "Design role shaping user-centred product experiences across web and mobile platforms.",
    classification: "Design & Architecture",
  },
  {
    count: 35,
    titles: PRODUCT_TITLES,
    description: "Product role partnering with engineering and design to ship customer value.",
    classification: "Information & Communication Technology",
  },
  {
    count: 35,
    titles: FINANCE_MARKETING_TITLES,
    description: "Finance marketing role driving growth across banking and professional services clients.",
    classification: "Banking & Financial Services",
  },
  {
    count: 35,
    titles: DELOITTE_TITLES,
    description: "Consulting role at Deloitte working with enterprise clients across Australia.",
    classification: "Consulting & Strategy",
    company: "Deloitte",
  },
]

const EXPANDED_COMPANIES = [
  "Commonwealth Bank",
  "Atlassian",
  "Canva",
  "Deloitte",
  "Accenture",
  "Westpac",
  "Telstra",
  "Macquarie Group",
  "KPMG",
  "Ogilvy",
] as const

/** Rotates badge states so the default list shows jobs with and without smart-filter badges */
function getExpandedJobBadgeFlags(index: number): {
  isNewToYou: boolean
  isStrongApplicant: boolean
  strongApplicantTier?: StrongApplicantTier
} {
  switch (index % 10) {
    case 0:
    case 1:
      return { isNewToYou: false, isStrongApplicant: false }
    case 2:
    case 3:
      return { isNewToYou: true, isStrongApplicant: false }
    case 4:
      return { isNewToYou: false, isStrongApplicant: true, strongApplicantTier: "veryStrong" }
    case 5:
      return { isNewToYou: false, isStrongApplicant: true, strongApplicantTier: "strong" }
    default:
      return {
        isNewToYou: true,
        isStrongApplicant: true,
        strongApplicantTier: index % 2 === 0 ? "veryStrong" : "strong",
      }
  }
}

function resolveStrongApplicantTier(job: Job, index: number): StrongApplicantTier | undefined {
  if (!job.isStrongApplicant) return undefined
  if (job.strongApplicantTier) return job.strongApplicantTier

  const haystack = `${job.title} ${job.company}`.toLowerCase()
  if (haystack.includes("project") && haystack.includes("seek")) {
    return "veryStrong"
  }

  return index % 2 === 0 ? "veryStrong" : "strong"
}

function withStrongApplicantTier(job: Job, index: number): Job {
  const tier = resolveStrongApplicantTier(job, index)
  if (!tier) return job
  return { ...job, strongApplicantTier: tier }
}

/** vSAB tier for badge display and filtering */
export function getStrongApplicantTier(job: Job): StrongApplicantTier | null {
  if (job.strongApplicantTier) return job.strongApplicantTier
  if (job.isStrongApplicant) return "strong"
  return null
}

/** Strong applicant filter — very strong matches first, then strong */
export function sortByStrongApplicantTier(jobs: Job[], sort: SortOption): Job[] {
  const veryStrong: Job[] = []
  const strong: Job[] = []
  const rest: Job[] = []

  for (const job of jobs) {
    const tier = getStrongApplicantTier(job)
    if (tier === "veryStrong") veryStrong.push(job)
    else if (tier === "strong") strong.push(job)
    else rest.push(job)
  }

  const sortTier = (list: Job[]) => {
    const copy = [...list]
    if (sort === "date") {
      copy.sort((a, b) => a.listingAgeDays - b.listingAgeDays)
    }
    return copy
  }

  return [...sortTier(veryStrong), ...sortTier(strong), ...sortTier(rest)]
}

/** Prototype expansion — 35+ jobs per common home/SERP search keyword */
function buildExpandedJobs(): Job[] {
  let globalIndex = 0

  return EXPANSION_BATCHES.flatMap((batch) =>
    Array.from({ length: batch.count }, (_, batchIndex) => {
      const index = globalIndex++
      const { suburb, location } = getExpansionPlace(batchIndex, index)
      const company = batch.company ?? EXPANDED_COMPANIES[index % EXPANDED_COMPANIES.length]
      const ageDays = index % 30
      const badgeFlags = getExpandedJobBadgeFlags(index)
      const title = batch.titles[batchIndex % batch.titles.length]

      return {
        id: `gen-${index + 100}`,
        title,
        company,
        location,
        suburb,
        salaryMin: 90000 + (index % 6) * 10000,
        salaryMax: 130000 + (index % 6) * 10000,
        workType: "Full time" as WorkType,
        remoteOption: (index % 2 === 0 ? "Hybrid" : "On-site") as RemoteOption,
        classification: batch.classification,
        listingAgeDays: ageDays,
        isNewToYou: badgeFlags.isNewToYou || index >= 105,
        isStrongApplicant: badgeFlags.isStrongApplicant || index >= 110,
        strongApplicantTier:
          badgeFlags.strongApplicantTier ??
          (badgeFlags.isStrongApplicant || index >= 110
            ? index % 2 === 0
              ? "veryStrong"
              : "strong"
            : undefined),
        isAtSeek: false,
        isEarlyApplicant: index % 12 === 0,
        teaser: [
          "Collaborate with cross-functional stakeholders",
          "Deliver outcomes in a fast-paced environment",
          "Contribute to team goals and continuous improvement",
        ] as [string, string, string],
        description: batch.description,
        postedLabel: `Posted ${ageDays}d ago`,
      }
    }),
  )
}

const BASE_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer (9-month fixed term contract)",
    company: "SEEK Limited",
    location: "Cremorne, Melbourne VIC",
    suburb: "Cremorne",
    salaryMin: 120000,
    salaryMax: 150000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Information & Communication Technology",
    listingAgeDays: 1,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: true,
    isEarlyApplicant: false,
    teaser: [
      "Join the Candidate Discovery design squad across APAC web and app",
      "Lead end-to-end UX from research and ideation through to delivery",
      "Collaborate with PMs, engineers and researchers in a 60+ person design org",
    ],
    description:
      "The Senior Product Designer will join the Candidate Discovery subdomain with support from design ops, research ops and a mature multi-disciplinary design community.",
    postedLabel: "Posted 1d ago",
    subClassification: "Developers/Programmers (Information & Communication Technology)",
    salaryLabel: "Add expected salary to your profile for insights",
    companyRating: 4.6,
    reviewCount: 202,
    verifiedEmployer: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    appliedOn: "14 December 2025",
    descriptionParagraphs: undefined,
    detailSections: [
      {
        title: "Company Description",
        body: "About SEEK\n\nSEEK's portfolio of diverse businesses make a positive impact on a truly global scale. Our purpose is to help people live more fulfilling and productive working lives and help organisations succeed. We create world-class technology solutions to connect more people to relevant employment, education, small business and volunteer opportunities. We have a culture of high-performance in our workplaces and celebrate the diversity of our employees who contribute to the success of our organisation.",
      },
      {
        title: "Life at SEEK",
        body: "SEEK's purpose is at the centre of everything we do. Our SEEK principles — Passion, Team, Delivery and Future — drive innovation and creativity. SEEK strives to support employee wellbeing by providing an amazing experience at work which led us to being named AFR BOSS Top 10 Best Places to Work in Technology (2021–2024).\n\nOur award-winning head office in Cremorne (just a 4 min walk from Richmond station) provides an exceptional space to collaborate with colleagues. The building provides sweeping views of the city, a games area, sit and stand desks at every workstation, modern end-of-trip facilities and Thursday night drinks which gives our people an opportunity to connect in a social setting.",
      },
      {
        title: "Job Description",
        body: "The team\n\nThe Design Team at SEEK is made up of 60+ professionals including UX and Product design, Visual design, Research, Design Systems, Specialisms and Operations. We are distributed primarily across Australia, Malaysia, and Hong Kong. Our vision is \"We create personalised, simple and beautiful job and talent seeking experiences by cultivating a company-wide culture that empowers everyone with human-centred design practices.\"\n\nAs a member of this large, mature, and growing community, the Senior Product Designer will join the Candidate Discovery subdomain and will have support from a wide range of design professionals, including our Design Ops and Research Ops teams. This is a great opportunity to join a leading multi-national design team within an organisation that appreciates the value of design.",
      },
      {
        title: "About the role",
        body: "The role reports into the Design Lead responsible for candidate job discovery experiences across APAC. They will work within a cross-functional squad focused on personalised and first-time experiences on our web and app platforms. Day-to-day they will collaborate with a geographically distributed team of product managers, engineers, analysts, and delivery experts to create value for job seekers.\n\nThe Senior Product Designer is a specialist practitioner who operates autonomously within their assigned squad, collaborating across disciplines to drive product outcomes and advance design practice. They create innovative, user-centred solutions through expertise in UX/UI design, user research and insights, GenAI-assisted design outputs, prototyping, and close partnership with development teams.",
      },
      {
        title: "Responsibilities",
        bullets: [
          "Lead end-to-end UX across the program, from research and ideation to delivery.",
          "Advocate for users by conducting research and turning insights into action.",
          "Partner with Product, Engineering, and Design to shape effective solutions.",
          "Define success metrics, measure outcomes, and iterate based on learnings.",
          "Contribute to domain vision, design practice, and the evolution of the Design System.",
          "Facilitate a collaborative and transparent design process within the team.",
          "Communicate insights, issues, and solutions effectively to the squad and stakeholders.",
        ],
      },
      {
        title: "Qualifications",
        body: "Skills and experience",
        bullets: [
          "8 years or more working in digital product or user experience design, delivering web and app experiences.",
          "Strong expertise in user research and proven ability to translate customer insights and complex data into intuitive, high-quality user experiences.",
          "Experience in experience mapping, interaction design, Design Thinking, and workshop facilitation.",
          "Experience working in agile teams and using wireframing and prototyping tools to communicate design concepts.",
          "Experience with GenAI, design systems, and visual design, with strong written, verbal, and visual communication skills.",
        ],
      },
      {
        title: "Additional Information",
        body: "Fixed Term Perks\n\nAt SEEK we offer flexible working including a mix of office and work from home days, SEEKer Support (up to six confidential sessions with a mental health professional), access to a wide range of discounts, professional development sessions with industry leading guest speakers, and frequent events including sports days, annual Christmas party, hackathon, and trivia.\n\nAt SEEK, we are passionate about fostering a culture of inclusion and wellbeing that embraces and values the diversity of our people. We welcome applications from people with diverse backgrounds and life experiences. For this role, only those candidates with the eligible right to work will be considered.",
      },
    ],
    employerQuestions: [
      "Which of the following statements best describes your right to work in Australia?",
      "Do you have a current Australian driver's licence?",
      "How many years' experience do you have in product or UX design?",
      "Are you available for a 9-month fixed term contract?",
      "Do you have experience working in agile delivery teams?",
    ],
    companyRegistration: {
      registrationNo: "20153489G",
    },
    careerAdvice: {
      title: "Thinking about a career as a product designer?",
      bullets: [
        "Insights on salary and in-demand skills",
        "Reviews from people working in the industry",
      ],
    },
    companyDescriptionTitle: "Company Description",
    companyDescription:
      "SEEK's portfolio of diverse businesses make a positive impact on a truly global scale. Our purpose is to help people live more fulfilling and productive working lives and help organisations succeed.",
    aboutCompanyTitle: "Life at SEEK",
    aboutCompany:
      "SEEK's purpose is at the centre of everything we do. Our SEEK principles — Passion, Team, Delivery and Future — drive innovation and creativity. We strive to support employee wellbeing and were named AFR BOSS Top 10 Best Places to Work in Technology (2021–2024).",
    companyProfile: {
      industry: "Online Media & eCommerce",
      employeeCount: "1,001–5,000 employees",
      description:
        "SEEK is a global leader in employment marketplaces, connecting the right work with the right people. Our platforms are used by approximately 50 million candidates worldwide.",
      perks: [
        "Free Breakfast",
        "Support for parents",
        "Community Impact",
        "Learning & Development",
        "Flexible Working",
        "Leave benefits",
      ],
    },
  },
  {
    id: "2",
    title: "Sales Consultant, Novated Leasing",
    company: "Maxxia",
    location: "Melbourne VIC",
    suburb: "Melbourne",
    salaryMin: 45,
    salaryMax: 55,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Sales",
    listingAgeDays: 2,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: true,
    teaser: [
      "Collaborative, diverse + fun company culture",
      "Manage a warm, extensive lead pipeline with opportunities to progress a strong portfolio",
      "Leading player in the Novated Leasing Segment",
    ],
    description:
      "Fast-paced, inbound sales role selling vehicles via Novated Lease. Lucrative earning potential suited for those with Novated or Dealership experience.",
    postedLabel: "Posted 2d ago",
    subClassification: "New business development (Sales)",
    salaryLabel: "$45 – $55 per hour",
    companyRating: 3.5,
    reviewCount: 317,
    heroImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    detailSections: [
      {
        title: "About the role",
        body: "Fast-paced, inbound sales role selling vehicles via Novated Lease. Lucrative earning potential suited for those with Novated or Dealership experience. You will join a collaborative, diverse and fun company culture where team members are supported to build long-term client relationships.",
      },
      {
        title: "What you'll do",
        bullets: [
          "Manage a warm, extensive lead pipeline with opportunities to progress a strong portfolio.",
          "Consult with customers on novated lease options and vehicle packages.",
          "Build trusted relationships with employers and employees across Victoria.",
          "Work closely with internal operations, finance and delivery teams.",
          "Meet and exceed monthly sales targets in a supportive team environment.",
        ],
      },
      {
        title: "About us",
        body: "Maxxia is a leading player in the Novated Leasing segment. We pride ourselves on delivering exceptional customer experiences and helping Australians access vehicles through salary packaging. Our Melbourne team is growing and we invest heavily in training, coaching and career development.",
      },
      {
        title: "What we're looking for",
        bullets: [
          "Experience in novated leasing, automotive sales or dealership environments.",
          "Strong communication skills and a customer-first mindset.",
          "Ability to manage multiple opportunities and follow structured sales processes.",
          "Current Australian driver's licence.",
          "Right to work in Australia.",
        ],
      },
      {
        title: "What's on offer",
        bullets: [
          "Competitive hourly rate plus uncapped commission structure.",
          "Hybrid working options from our Melbourne office.",
          "Ongoing training and mentorship from experienced sales leaders.",
          "Career progression opportunities within a growing national business.",
        ],
      },
    ],
    employerQuestions: [
      "Which of the following statements best describes your right to work in Australia?",
      "Do you have a current Australian driver's licence?",
      "Do you hold a Construction Induction Safety certificate (White Card)?",
      "How many years' experience do you have as an Air Conditioning Role?",
      "Do you have commercial cleaning experience?",
    ],
    companyRegistration: {
      registrationNo: "20153489G",
      poeaNo: "150-LB-090120-R",
    },
    careerAdvice: {
      title: "Thinking about a career as a customer service representative?",
      bullets: [
        "Insights on salary and in-demand skills",
        "Reviews from people working in the industry",
      ],
    },
  },
  {
    id: "3",
    title: "Marketing Lead – Accounting",
    company: "Atlassian",
    location: "Docklands, Melbourne VIC",
    suburb: "Docklands",
    salaryMin: 120000,
    salaryMax: 145000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 0,
    isNewToYou: true,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: true,
    teaser: [
      "Ship customer-facing digital experiences",
      "Work closely with design and engineering leads",
      "Own roadmap planning and release coordination",
    ],
    description: "Atlassian is looking for a Digital Project Manager to drive delivery across marketing and growth initiatives.",
    postedLabel: "Posted today",
  },
  {
    id: "4",
    title: "Finance Marketing Lead",
    company: "Lendlease",
    location: "Richmond, Melbourne VIC",
    suburb: "Richmond",
    salaryMin: 150000,
    salaryMax: 180000,
    workType: "Full time",
    remoteOption: "On-site",
    classification: "Accounting",
    listingAgeDays: 5,
    isNewToYou: false,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Oversee commercial tower fit-out projects",
      "Manage subcontractors and site safety",
      "Report to senior construction leadership",
    ],
    description: "Experienced construction PM needed for major Sydney CBD developments.",
    postedLabel: "Posted 5d ago",
  },
  {
    id: "5",
    title: "Marketing Manager",
    company: "Canva",
    location: "Carlton, Melbourne VIC",
    suburb: "Carlton",
    salaryMin: 110000,
    salaryMax: 130000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Marketing & Communications",
    listingAgeDays: 3,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Coordinate global campaign launches",
      "Manage creative and channel teams",
      "Track performance against OKRs",
    ],
    description: "Canva's brand team seeks a PM to orchestrate multi-market marketing programs.",
    postedLabel: "Posted 3d ago",
  },
  {
    id: "6",
    title: "Brand Marketing Lead",
    company: "Westpac",
    location: "Cremorne, Melbourne VIC",
    suburb: "Cremorne",
    salaryMin: 125000,
    salaryMax: 140000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 7,
    isNewToYou: false,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Facilitate Scrum across multiple squads",
      "Remove blockers and improve delivery flow",
      "Support PI planning and reporting",
    ],
    description: "Westpac Technology is hiring an Agile PM for digital banking initiatives.",
    postedLabel: "Posted 1w ago",
  },
  {
    id: "7",
    title: "Digital Marketing Lead",
    company: "Accenture",
    location: "South Melbourne, Melbourne VIC",
    suburb: "South Melbourne",
    salaryMin: 115000,
    salaryMax: 135000,
    workType: "Contract",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 4,
    isNewToYou: true,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: true,
    teaser: [
      "6-month contract with extension potential",
      "Client-facing role in financial services",
      "Manage integration and cloud migration workstreams",
    ],
    description: "Accenture needs a Technical PM for a major bank transformation program.",
    postedLabel: "Posted 4d ago",
  },
  {
    id: "8",
    title: "Content Marketing Lead",
    company: "Deloitte",
    location: "Fitzroy, Melbourne VIC",
    suburb: "Fitzroy",
    salaryMin: 72000,
    salaryMax: 85000,
    workType: "Full time",
    remoteOption: "On-site",
    classification: "Accounting",
    listingAgeDays: 6,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Support senior PMs on consulting engagements",
      "Maintain project documentation and RAID logs",
      "Coordinate workshops and status meetings",
    ],
    description: "Entry-level project coordination role within Deloitte Consulting.",
    postedLabel: "Posted 6d ago",
  },
  {
    id: "9",
    title: "Marketing Lead – B2B",
    company: "Telstra",
    location: "St Kilda, Melbourne VIC",
    suburb: "St Kilda",
    salaryMin: 160000,
    salaryMax: 190000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 10,
    isNewToYou: false,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Lead a portfolio of network modernisation projects",
      "Manage budgets exceeding $20M",
      "Executive stakeholder engagement",
    ],
    description: "Telstra seeks an experienced Program Manager for enterprise technology delivery.",
    postedLabel: "Posted 10d ago",
  },
  {
    id: "10",
    title: "Growth Marketing Lead",
    company: "Qantas",
    location: "Hawthorn, Melbourne VIC",
    suburb: "Hawthorn",
    salaryMin: 120000,
    salaryMax: 135000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Marketing & Communications",
    listingAgeDays: 8,
    isNewToYou: true,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Implement Workday and HRIS enhancements",
      "Partner with People & Culture teams",
      "Manage change and training activities",
    ],
    description: "Qantas People team is upgrading core HR platforms.",
    postedLabel: "Posted 8d ago",
  },
  {
    id: "11",
    title: "Infrastructure Project Manager",
    company: "Transport for NSW",
    location: "Footscray, Melbourne VIC",
    suburb: "Footscray",
    salaryMin: 130000,
    salaryMax: 155000,
    workType: "Full time",
    remoteOption: "On-site",
    classification: "Marketing & Communications",
    listingAgeDays: 12,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Deliver rail and road infrastructure upgrades",
      "Manage government procurement processes",
      "Ensure community and safety compliance",
    ],
    description: "TfNSW is recruiting PMs for major transport infrastructure programs.",
    postedLabel: "Posted 12d ago",
  },
  {
    id: "12",
    title: "Product Delivery Manager",
    company: "SEEK",
    location: "Collingwood, Melbourne VIC",
    suburb: "Collingwood",
    salaryMin: 135000,
    salaryMax: 155000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 2,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: true,
    isEarlyApplicant: true,
    teaser: [
      "Own delivery for candidate search experiences",
      "Collaborate with data science and ML teams",
      "Champion continuous improvement practices",
    ],
    description: "SEEK's Discover team is hiring a delivery-focused PM for search and recommendations.",
    postedLabel: "Posted 2d ago",
  },
  {
    id: "13",
    title: "Events Project Manager",
    company: "Ticketek",
    location: "Port Melbourne, Melbourne VIC",
    suburb: "Port Melbourne",
    salaryMin: 85000,
    salaryMax: 95000,
    workType: "Part time",
    remoteOption: "On-site",
    classification: "Marketing & Communications",
    listingAgeDays: 14,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Plan and execute major venue events",
      "Coordinate vendors, artists and operations",
      "3 days per week, event season peaks",
    ],
    description: "Part-time PM role supporting live entertainment events at Sydney venues.",
    postedLabel: "Posted 2w ago",
  },
  {
    id: "14",
    title: "SAP Project Manager",
    company: "Origin Energy",
    location: "North Melbourne, Melbourne VIC",
    suburb: "North Melbourne",
    salaryMin: 145000,
    salaryMax: 170000,
    workType: "Contract",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 9,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Lead SAP S/4HANA implementation workstreams",
      "12-month initial contract",
      "Experience in utilities sector preferred",
    ],
    description: "Origin is mid-flight on an ERP transformation and needs an experienced SAP PM.",
    postedLabel: "Posted 9d ago",
  },
  {
    id: "15",
    title: "Project Manager – Sales Enablement",
    company: "Salesforce",
    location: "Dandenong, Melbourne VIC",
    suburb: "Dandenong",
    salaryMin: 125000,
    salaryMax: 145000,
    workType: "Full time",
    remoteOption: "Fully remote",
    classification: "Marketing & Communications",
    listingAgeDays: 1,
    isNewToYou: true,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: true,
    teaser: [
      "Drive APAC sales tooling rollouts",
      "Remote-first with quarterly Sydney meetups",
      "Partner with RevOps and marketing",
    ],
    description: "Salesforce ANZ is hiring a PM for internal sales enablement programs.",
    postedLabel: "Posted 1d ago",
  },
  {
    id: "16",
    title: "Assistant Project Manager",
    company: "Mirvac",
    location: "Frankston, Melbourne VIC",
    suburb: "Frankston",
    salaryMin: 90000,
    salaryMax: 105000,
    workType: "Full time",
    remoteOption: "On-site",
    classification: "Accounting",
    listingAgeDays: 15,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Support residential development projects",
      "Track schedules, costs and quality",
      "Graduate-friendly with mentoring",
    ],
    description: "Mirvac's residential team seeks an APM for Western Sydney projects.",
    postedLabel: "Posted 15d ago",
  },
  {
    id: "17",
    title: "Clinical Project Manager",
    company: "Ramsay Health Care",
    location: "Werribee, Melbourne VIC",
    suburb: "Werribee",
    salaryMin: 100000,
    salaryMax: 120000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Marketing & Communications",
    listingAgeDays: 20,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Manage clinical trial and quality initiatives",
      "Coordinate across hospital sites",
      "Regulatory documentation experience valued",
    ],
    description: "Ramsay is improving clinical programs across NSW private hospitals.",
    postedLabel: "Posted 20d ago",
  },
  {
    id: "18",
    title: "Project Manager – Cyber Security",
    company: "Macquarie Group",
    location: "Sunbury, Melbourne VIC",
    suburb: "Sunbury",
    salaryMin: 140000,
    salaryMax: 165000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 3,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Deliver security uplift and IAM programs",
      "Work with CISO office and technology",
      "Strong risk management background",
    ],
    description: "Macquarie Technology is investing in cyber resilience programs.",
    postedLabel: "Posted 3d ago",
  },
  {
    id: "19",
    title: "Creative Project Manager",
    company: "Ogilvy",
    location: "Melbourne CBD, Melbourne VIC",
    suburb: "Melbourne CBD",
    salaryMin: 95000,
    salaryMax: 110000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Marketing & Communications",
    listingAgeDays: 11,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Manage agency client campaigns end-to-end",
      "Balance creative, production and media",
      "Fast-paced FMCG and retail accounts",
    ],
    description: "Ogilvy Sydney needs a creative PM for integrated advertising campaigns.",
    postedLabel: "Posted 11d ago",
  },
  {
    id: "20",
    title: "Logistics Project Manager",
    company: "Woolworths Group",
    location: "Southbank, Melbourne VIC",
    suburb: "Southbank",
    salaryMin: 115000,
    salaryMax: 130000,
    workType: "Full time",
    remoteOption: "On-site",
    classification: "Accounting",
    listingAgeDays: 6,
    isNewToYou: false,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Optimise supply chain and DC operations",
      "Lead automation and WMS projects",
      "Cross-functional stakeholder management",
    ],
    description: "Woolworths supply chain team is modernising distribution networks.",
    postedLabel: "Posted 6d ago",
  },
  {
    id: "21",
    title: "Project Manager – Data Platform",
    company: "SEEK",
    location: "Docklands, Melbourne VIC",
    suburb: "Docklands",
    salaryMin: 145000,
    salaryMax: 165000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 0,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: true,
    isEarlyApplicant: true,
    teaser: [
      "Build SEEK's next-gen analytics platform",
      "Partner with data engineering and analytics",
      "Shape data governance practices",
    ],
    description: "Join SEEK's data platform team to deliver scalable analytics capabilities.",
    postedLabel: "Posted today",
  },
  {
    id: "22",
    title: "Finance Project Manager",
    company: "KPMG",
    location: "Richmond, Melbourne VIC",
    suburb: "Richmond",
    salaryMin: 120000,
    salaryMax: 140000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 18,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Deliver finance transformation for clients",
      "Manage consulting teams and timelines",
      "CA/CPA qualification preferred",
    ],
    description: "KPMG Advisory is hiring PMs for finance and ERP engagements.",
    postedLabel: "Posted 18d ago",
  },
  {
    id: "23",
    title: "Casual Project Administrator",
    company: "University of Sydney",
    location: "Carlton, Melbourne VIC",
    suburb: "Carlton",
    salaryMin: 55000,
    salaryMax: 55000,
    workType: "Casual",
    remoteOption: "On-site",
    classification: "Marketing & Communications",
    listingAgeDays: 25,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Support research grant administration",
      "Flexible hours during semester peaks",
      "Student-friendly casual role",
    ],
    description: "Casual admin support for research project offices at USyd.",
    postedLabel: "Posted 25d ago",
  },
  {
    id: "24",
    title: "Project Manager – Cloud Migration",
    company: "AWS Professional Services",
    location: "Cremorne, Melbourne VIC",
    suburb: "Cremorne",
    salaryMin: 150000,
    salaryMax: 175000,
    workType: "Full time",
    remoteOption: "Fully remote",
    classification: "Accounting",
    listingAgeDays: 4,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Lead enterprise cloud migration programs",
      "AWS certifications highly regarded",
      "Client-facing consulting role",
    ],
    description: "AWS ProServe is expanding its Sydney PM bench for cloud transformations.",
    postedLabel: "Posted 4d ago",
  },
  {
    id: "25",
    title: "Electrical Project Manager",
    company: "Electrical Trades Union Services",
    location: "South Melbourne, Melbourne VIC",
    suburb: "South Melbourne",
    salaryMin: 105000,
    salaryMax: 125000,
    workType: "Full time",
    remoteOption: "On-site",
    classification: "Accounting",
    listingAgeDays: 22,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Manage commercial electrical fit-outs",
      "Electrical trade background essential",
      "Site-based across Greater Sydney",
    ],
    description: "Experienced electrical PM for commercial and industrial projects.",
    postedLabel: "Posted 22d ago",
  },
  {
    id: "26",
    title: "Implementation Project Manager",
    company: "Employment Hero",
    location: "Fitzroy, Melbourne VIC",
    suburb: "Fitzroy",
    salaryMin: 100000,
    salaryMax: 115000,
    workType: "Full time",
    remoteOption: "Fully remote",
    classification: "Marketing & Communications",
    listingAgeDays: 2,
    isNewToYou: true,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: true,
    teaser: [
      "Onboard HR SaaS customers across APAC",
      "Remote role with Sydney HQ optional",
      "SaaS implementation experience ideal",
    ],
    description: "Employment Hero is scaling its customer implementation team.",
    postedLabel: "Posted 2d ago",
  },
  {
    id: "27",
    title: "Senior Program Manager",
    company: "NSW Health",
    location: "St Kilda, Melbourne VIC",
    suburb: "St Kilda",
    salaryMin: 155000,
    salaryMax: 175000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 28,
    isNewToYou: false,
    isStrongApplicant: false,
    isAtSeek: false,
    isEarlyApplicant: false,
    teaser: [
      "Lead digital health transformation programs",
      "Public sector experience required",
      "Manage multi-year program budgets",
    ],
    description: "NSW Health is digitising patient services across the state.",
    postedLabel: "Posted 28d ago",
  },
  {
    id: "28",
    title: "Project Manager – Mobile Apps",
    company: "SEEK",
    location: "Hawthorn, Melbourne VIC",
    suburb: "Hawthorn",
    salaryMin: 130000,
    salaryMax: 150000,
    workType: "Full time",
    remoteOption: "Hybrid",
    classification: "Accounting",
    listingAgeDays: 5,
    isNewToYou: true,
    isStrongApplicant: true,
    isAtSeek: true,
    isEarlyApplicant: false,
    teaser: [
      "Deliver iOS and Android app features",
      "Work with mobile engineers and designers",
      "Own release planning and app store submissions",
    ],
    description: "SEEK's mobile team is hiring a PM to ship candidate app improvements.",
    postedLabel: "Posted 5d ago",
  },
]

export const jobs: Job[] = [...BASE_JOBS, ...buildExpandedJobs()].map(withStrongApplicantTier)

export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n.toLocaleString("en-AU")}`
  return `${fmt(min)} – ${fmt(max)}`
}

export function formatPayRange(min: number | null, max: number | null): string {
  if (min != null && max != null) return `$${Math.round(min / 1000)}k–$${Math.round(max / 1000)}k`
  if (min != null) return `From $${Math.round(min / 1000)}k`
  if (max != null) return `Up to $${Math.round(max / 1000)}k`
  return "Any pay"
}
