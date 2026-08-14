"use client"

import Link from "next/link"
import { IconChevronDown, IconChevronUp, IconLocation } from "@/components/braid/icons"
import { useState } from "react"
import { GumLeaf } from "./gum-leaf"

const footerSections = [
  {
    title: "Job seekers",
    links: [
      { label: "Job search", href: "/" },
      { label: "Profile", href: "/profile/me" },
      { label: "People search", href: "/profiles/search" },
      { label: "Saved searches", href: "/my-activity/saved-searches" },
      { label: "Saved jobs", href: "/my-activity/saved-jobs" },
      { label: "Applied jobs", href: "/my-activity/applied-jobs" },
      { label: "Career advice", href: "/career-advice" },
      { label: "Explore careers", href: "/career-advice/explore-careers" },
      { label: "Explore salaries", href: "/career-advice/explore-salaries" },
      { label: "Companies", href: "/companies" },
      { label: "Recruiters", href: "/recruiters" },
      { label: "Community", href: "/community" },
    ],
    expandable: [
      {
        label: "Download apps",
        items: [
          { label: "iOS App", href: "https://apps.apple.com/au/app/seek-jobs/id520400855" },
          { label: "Android App", href: "https://play.google.com/store/apps/details?id=au.com.seek" },
        ],
      },
      {
        label: "SEEK sites",
        items: [
          { label: "Employer site", href: "/employer" },
          { label: "Courses", href: "https://www.seek.com.au/learning/" },
          { label: "Volunteering", href: "https://www.volunteer.com.au/" },
        ],
      },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Register for free", href: "/employer/register" },
      { label: "Post a job ad", href: "/employer/post-job" },
      { label: "Products & prices", href: "/employer/products" },
      { label: "Customer service", href: "/employer/support" },
      { label: "Hiring advice", href: "/employer/hiring-advice" },
      { label: "Market insights", href: "/employer/market-insights" },
      { label: "Recruitment software partners", href: "/employer/software-partners" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "About SEEK", href: "/about" },
      { label: "Newsroom", href: "/about/newsroom" },
      { label: "Investors", href: "/about/investors" },
      { label: "Careers", href: "/about/careers" },
    ],
    expandable: [
      {
        label: "International partners",
        items: [
          { label: "Jobstreet", href: "https://www.jobstreet.com" },
          { label: "Jobsdb", href: "https://www.jobsdb.com" },
          { label: "Catho", href: "https://www.catho.com.br" },
        ],
      },
      {
        label: "Partner services",
        items: [
          { label: "Certsy", href: "https://www.certsy.com" },
          { label: "Sidekicker", href: "https://www.sidekicker.com" },
          { label: "JobAdder", href: "https://www.jobadder.com" },
        ],
      },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Contact us", href: "/contact" },
      { label: "Product & tech blog", href: "/about/news/product-tech" },
      { label: "SEEK videos", href: "/about/videos" },
    ],
    expandable: [
      {
        label: "Social",
        items: [
          { label: "Facebook", href: "https://www.facebook.com/SEEK" },
          { label: "Instagram", href: "https://www.instagram.com/seekau" },
          { label: "Twitter", href: "https://twitter.com/seekjobs" },
          { label: "YouTube", href: "https://www.youtube.com/seek" },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/seek" },
        ],
      },
    ],
  },
]

const countries = [
  { label: "Australia", code: "AU" },
  { label: "New Zealand", code: "NZ" },
  { label: "Hong Kong", code: "HK" },
  { label: "Indonesia", code: "ID" },
  { label: "Malaysia", code: "MY" },
  { label: "Philippines", code: "PH" },
  { label: "Singapore", code: "SG" },
  { label: "Thailand", code: "TH" },
]

function ExpandableItem({
  label,
  items,
}: {
  label: string
  items: { label: string; href: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-[#5A6881] transition-colors hover:text-[#1E47A9]"
        aria-expanded={isOpen}
      >
        {label}
        {isOpen ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-2 pl-3">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-sm text-[#5A6881] transition-colors hover:text-[#1E47A9] hover:underline"
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(countries[0])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-[#2E3849]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <IconLocation className="h-4 w-4 text-[#5A6881]" />
        {selected.label}
        {isOpen ? (
          <IconChevronUp className="h-4 w-4 text-[#5A6881]" />
        ) : (
          <IconChevronDown className="h-4 w-4 text-[#5A6881]" />
        )}
      </button>
      {isOpen && (
        <ul
          className="absolute bottom-full left-0 mb-2 min-w-[160px] rounded-xl bg-white py-2 shadow-lg ring-1 ring-[#EAECF1]"
          role="listbox"
        >
          {countries.map((country) => (
            <li key={country.code}>
              <button
                onClick={() => {
                  setSelected(country)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#F7F8FB] ${
                  selected.code === country.code ? "font-medium text-[#1E47A9]" : "text-[#2E3849]"
                }`}
                role="option"
                aria-selected={selected.code === country.code}
              >
                {country.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-8 lg:py-12">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-base font-semibold text-[#2E3849]">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#5A6881] transition-colors hover:text-[#1E47A9] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {section.expandable?.map((expandable) => (
                  <li key={expandable.label}>
                    <ExpandableItem label={expandable.label} items={expandable.items} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Indigenous Acknowledgement */}
      <div className="border-t border-[#EAECF1]">
        <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <GumLeaf className="shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#2E3849]">
                SEEK acknowledges the Traditional Custodians of the lands on which it operates its online employment
                marketplace.
              </p>
              <p className="text-sm font-medium text-[#2E3849]">
                The gum leaf represents a symbol of welcome and it acknowledges the diverse countries, environments and
                communities.
              </p>
              <p className="text-sm text-[#5A6881]">
                Artwork by Bitja, Dixon Patten Jnr, Gunnai, Gunditjmara, Yorta Yorta and Dhudhuroa, Bayila Creative.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#EAECF1]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center lg:px-8">
          <CountrySelector />
          <div className="flex flex-wrap items-center gap-6">
            <nav className="flex flex-wrap items-center gap-6 text-sm" aria-label="Legal links">
              <Link href="/terms" className="text-[#5A6881] transition-colors hover:text-[#1E47A9] hover:underline">
                Terms & conditions
              </Link>
              <Link href="/security" className="text-[#5A6881] transition-colors hover:text-[#1E47A9] hover:underline">
                Security
              </Link>
              <Link href="/privacy" className="text-[#5A6881] transition-colors hover:text-[#1E47A9] hover:underline">
                Privacy
              </Link>
            </nav>
            <p className="text-sm text-[#5A6881]">© SEEK. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
