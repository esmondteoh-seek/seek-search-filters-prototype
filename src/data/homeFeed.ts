export interface HomeRecentSearch {
  id: string
  /** Display label parts for the chip */
  keywords: string
  location: string
  /** Query passed to SERP — defaults to keywords/location when omitted */
  searchKeywords?: string
  searchLocation?: string
}

export interface HomeRecommendedJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  workType: string
  teasers: string[]
  postedLabel: string
  badges: Array<"newToYou" | "strongApplicant" | "earlyApplicant">
  feedbackLabel?: string
  searchKeywords: string
  searchLocation: string
}

export interface HomeSavedSearchItem {
  id: string
  title: string
  summary?: string
  searchKeywords: string
  searchLocation: string
}

export interface HomeSavedJobItem {
  id: string
  title: string
  company: string
  location: string
  salary: string
  postedLabel: string
  searchKeywords: string
  searchLocation: string
}

export const HOME_RECENT_SEARCHES: HomeRecentSearch[] = [
  {
    id: "r1",
    keywords: "Engineer",
    location: "Australia",
    searchKeywords: "Project Manager",
    searchLocation: "",
  },
  {
    id: "r2",
    keywords: "Design",
    location: "Australia",
    searchKeywords: "Design",
    searchLocation: "",
  },
  {
    id: "r3",
    keywords: "Product Management",
    location: "Melbourne",
    searchKeywords: "Product",
    searchLocation: "Melbourne",
  },
]

export const HOME_RECOMMENDED_JOBS: HomeRecommendedJob[] = [
  {
    id: "rec-1",
    title: "Client Consultant | Full-time | Brisbane",
    company: "Cartier",
    location: "Adelaide SA",
    salary: "$85,000 – $95,000 plus 10% Superannuation",
    workType: "Permanent position",
    teasers: [
      "Comprehensive training and development",
      "Work with top-tier organisations",
      "Attractive salary and benefits package",
    ],
    postedLabel: "We won't recommend this job to you again",
    badges: ["newToYou", "strongApplicant"],
    searchKeywords: "Project Manager",
    searchLocation: "",
  },
  {
    id: "rec-2",
    title: "Client Advisor | Full-time | Sydney",
    company: "Tiffany & Co.",
    location: "Melbourne VIC",
    salary: "$82,099 – $92,404 plus 11% Superannuation",
    workType: "Full time",
    teasers: [
      "Structured training and development",
      "Market leading companies",
      "Competitive salary and benefits package",
    ],
    postedLabel: "22m ago",
    badges: ["newToYou"],
    searchKeywords: "Design",
    searchLocation: "",
  },
  {
    id: "rec-3",
    title: "Client Advisor | Full-time | Sydney",
    company: "Flybuys",
    location: "Sydney International Airport, Sydney",
    salary: "$65,000 – $70,000",
    workType: "Full time",
    teasers: [
      "Structured training and development",
      "Market leading companies",
      "Competitive salary and benefits package",
    ],
    postedLabel: "22m ago",
    badges: ["newToYou", "strongApplicant", "earlyApplicant"],
    searchKeywords: "Product",
    searchLocation: "Melbourne",
  },
]

export const HOME_SIDEBAR_SAVED_SEARCHES: HomeSavedSearchItem[] = [
  {
    id: "ss-1",
    title: "Product Owner fintech",
    searchKeywords: "Product",
    searchLocation: "Melbourne",
  },
  {
    id: "ss-2",
    title: "Product Owner",
    summary: "$80,000 – $120,000 • Full time",
    searchKeywords: "Product",
    searchLocation: "",
  },
  {
    id: "ss-3",
    title: "Product Owner in finance",
    summary: "Sydney NSW • Full time, Part time • On-site, Hybrid",
    searchKeywords: "Finance Marketing",
    searchLocation: "Melbourne",
  },
]

export const HOME_SAVED_JOB: HomeSavedJobItem = {
  id: "sj-1",
  title: "Senior Consultant",
  company: "Deloitte",
  location: "Sydney NSW",
  salary: "$90,000 – $110,000 plus super",
  postedLabel: "22m ago",
  searchKeywords: "Deloitte",
  searchLocation: "",
}

export const HOME_CLASSIFICATIONS = [
  "Any classification",
  "Accounting",
  "Information & Communication Technology",
  "Sales",
  "Marketing & Communications",
] as const
