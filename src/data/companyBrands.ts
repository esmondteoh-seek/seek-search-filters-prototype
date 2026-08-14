export interface CompanyBrand {
  color: string
  domain?: string
  logoUrl?: string
  heroImageUrl: string
  isSeek?: boolean
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

/** Wikimedia Commons thumbnail — stable PNG/SVG exports for well-known marks */
const wiki = (path: string, width = 320) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${width}px-${path.split("/").pop()}.png`

/** Google favicon fallback when no stable Wikimedia asset exists */
export const getCompanyFaviconUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`

export const DEFAULT_HERO = unsplash("photo-1497366216548-37526070297c")

const BRANDS: Record<string, CompanyBrand> = {
  SEEK: {
    color: "#0D3880",
    domain: "seek.com.au",
    isSeek: true,
    heroImageUrl: DEFAULT_HERO,
  },
  "SEEK Limited": {
    color: "#0D3880",
    domain: "seek.com.au",
    isSeek: true,
    heroImageUrl: DEFAULT_HERO,
  },
  Atlassian: {
    color: "#0052CC",
    domain: "atlassian.com",
    logoUrl: wiki("8/82/Atlassian-logo.svg"),
    heroImageUrl: unsplash("photo-1497366811353-6870744d04b2"),
  },
  Canva: {
    color: "#00C4CC",
    domain: "canva.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Canva_icon_2021.svg/120px-Canva_icon_2021.svg.png",
    heroImageUrl: unsplash("photo-1524758631624-e2822e304c36"),
  },
  Deloitte: {
    color: "#86BC25",
    domain: "deloitte.com",
    logoUrl: wiki("5/56/Deloitte.svg"),
    heroImageUrl: unsplash("photo-1486406146926-c627a92ad1ab"),
  },
  Westpac: {
    color: "#D5002B",
    domain: "westpac.com.au",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Westpac_logo.svg/320px-Westpac_logo.svg.png",
    heroImageUrl: unsplash("photo-1486406146926-c627a92ad1ab"),
  },
  Accenture: {
    color: "#A100FF",
    domain: "accenture.com",
    logoUrl: wiki("c/cd/Accenture.svg"),
    heroImageUrl: unsplash("photo-1497366754035-f200968a6e72"),
  },
  Telstra: {
    color: "#0E64AA",
    domain: "telstra.com.au",
    logoUrl: wiki("2/2c/Telstra_logo.svg"),
    heroImageUrl: unsplash("photo-1519389950473-47ba0277781c"),
  },
  Qantas: {
    color: "#E0001B",
    domain: "qantas.com",
    logoUrl: wiki("9/93/Qantas_logo.svg"),
    heroImageUrl: unsplash("photo-1436491865332-7a61a109cc05"),
  },
  "Transport for NSW": {
    color: "#002664",
    domain: "transport.nsw.gov.au",
    heroImageUrl: unsplash("photo-1474487548417-781cb71495f3"),
  },
  Ticketek: {
    color: "#E60278",
    domain: "ticketek.com.au",
    heroImageUrl: unsplash("photo-1470229722913-7c0e2dbbafd3"),
  },
  "Origin Energy": {
    color: "#FF6600",
    domain: "originenergy.com.au",
    heroImageUrl: unsplash("photo-1473341304170-971dccb5ac1e"),
  },
  Salesforce: {
    color: "#00A1E0",
    domain: "salesforce.com",
    logoUrl: wiki("f/f9/Salesforce.com_logo.svg"),
    heroImageUrl: unsplash("photo-1553877522-43269d4ea984"),
  },
  Mirvac: {
    color: "#003A70",
    domain: "mirvac.com",
    heroImageUrl: unsplash("photo-1486406146926-c627a92ad1ab"),
  },
  "Ramsay Health Care": {
    color: "#005EB8",
    domain: "ramsayhealth.com",
    heroImageUrl: unsplash("photo-1519494026892-80bbd2d6fd0d"),
  },
  "Macquarie Group": {
    color: "#000000",
    domain: "macquarie.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Macquarie_Group_logo.svg/320px-Macquarie_Group_logo.svg.png",
    heroImageUrl: unsplash("photo-1565514020471-b8909511cdc3"),
  },
  Ogilvy: {
    color: "#FF0000",
    domain: "ogilvy.com",
    logoUrl: wiki("0/0e/Ogilvy_logo.svg"),
    heroImageUrl: unsplash("photo-1542744173-8eaa618958f1"),
  },
  "Woolworths Group": {
    color: "#178241",
    domain: "woolworthsgroup.com.au",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/Woolworths_Limited_logo.svg/320px-Woolworths_Limited_logo.svg.png",
    heroImageUrl: unsplash("photo-1542838132-92c53300491e"),
  },
  KPMG: {
    color: "#00338D",
    domain: "kpmg.com",
    logoUrl: wiki("1/19/KPMG_logo.svg"),
    heroImageUrl: unsplash("photo-1454165804606-c3d57bc86b40"),
  },
  "University of Sydney": {
    color: "#E64626",
    domain: "sydney.edu.au",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/University_of_Sydney_logo.svg/320px-University_of_Sydney_logo.svg.png",
    heroImageUrl: unsplash("photo-1523050854058-8d82d16b9037"),
  },
  "AWS Professional Services": {
    color: "#FF9900",
    domain: "aws.amazon.com",
    logoUrl: wiki("9/93/Amazon_Web_Services_Logo.svg"),
    heroImageUrl: unsplash("photo-1451187580459-43490279c0fa"),
  },
  "Electrical Trades Union Services": {
    color: "#C8102E",
    domain: "etu.org.au",
    heroImageUrl: unsplash("photo-1504328345606-18bbc8c9d7d1"),
  },
  "Employment Hero": {
    color: "#5A31F4",
    domain: "employmenthero.com",
    heroImageUrl: unsplash("photo-1521737604893-d14cc237f11d"),
  },
  "NSW Health": {
    color: "#002664",
    domain: "health.nsw.gov.au",
    heroImageUrl: unsplash("photo-1519494026892-80bbd2d6fd0d"),
  },
  Lendlease: {
    color: "#E35205",
    domain: "lendlease.com",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Lendlease_logo.svg/320px-Lendlease_logo.svg.png",
    heroImageUrl: unsplash("photo-1503387762-592deb58ef4e"),
  },
  Maxxia: {
    color: "#E60278",
    domain: "maxxia.com.au",
    heroImageUrl: unsplash("photo-1497366216548-37526070297c"),
  },
  Cartier: {
    color: "#1A1A1A",
    domain: "cartier.com",
    logoUrl: wiki("8/86/Cartier_logo.svg"),
    heroImageUrl: unsplash("photo-1515562141207-7a88fb7ce338"),
  },
  "Tiffany & Co.": {
    color: "#81D8D0",
    domain: "tiffany.com",
    logoUrl: wiki("5/56/Tiffany_%26_Co._logo.svg"),
    heroImageUrl: unsplash("photo-1515562141207-7a88fb7ce338"),
  },
  Flybuys: {
    color: "#E60278",
    domain: "flybuys.com.au",
    heroImageUrl: unsplash("photo-1556742049-0cfed4f6a45d"),
  },
}

const DEFAULT_BRAND: CompanyBrand = {
  color: "#2E3849",
  heroImageUrl: DEFAULT_HERO,
}

/** Ordered logo sources: primary mark, then Google favicon via domain */
export function getCompanyLogoSources(company: string): string[] {
  const brand = getCompanyBrand(company)
  if (brand.isSeek) return []

  const sources: string[] = []
  if (brand.logoUrl) sources.push(brand.logoUrl)
  if (brand.domain) sources.push(getCompanyFaviconUrl(brand.domain))
  return sources
}

/** Brand assets for job cards and detail views — logos match production company marks */
export function getCompanyBrand(company: string): CompanyBrand {
  return BRANDS[company] ?? DEFAULT_BRAND
}

export function getCompanyHeroImageUrl(company: string, override?: string) {
  if (override) return override
  return getCompanyBrand(company).heroImageUrl
}

export function getCompanyInitials(company: string) {
  return company
    .split(/\s+/)
    .filter((word) => word.length > 0 && word !== "&" && word !== "of" && word !== "for")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}
