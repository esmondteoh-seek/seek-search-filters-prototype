"use client"

import { useState } from "react"
import Link from "next/link"
import { IconChevronDown, IconClose, IconLocation } from "@/components/braid/icons"
import { SeekLogo } from "@/components/seek-logo"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: "Job search", href: "/", active: true },
  { label: "People search", href: "/people-search", active: false },
  { label: "Career advice", href: "/career-advice", active: false },
  { label: "Companies", href: "/companies", active: false },
  { label: "Recruiters", href: "/recruiters", active: false },
]

const countries = [
  { name: "Australia", code: "AU" },
  { name: "New Zealand", code: "NZ" },
  { name: "Hong Kong", code: "HK" },
  { name: "Indonesia", code: "ID" },
  { name: "Malaysia", code: "MY" },
  { name: "Philippines", code: "PH" },
  { name: "Singapore", code: "SG" },
  { name: "Thailand", code: "TH" },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("Australia")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white lg:hidden">
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#EAECF1]">
        <Link href="/" onClick={onClose} aria-label="SEEK Home">
          <SeekLogo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0D6FA] text-base font-medium">
            <span className="text-[#2E3849]">R</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center text-[#2E3849]"
          >
            <IconClose className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <nav className="flex flex-col" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className={`relative px-4 py-4 text-lg text-[#2E3849] hover:bg-[#F3F5F7] ${
              item.active ? "font-medium" : "font-normal"
            }`}
          >
            {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0D3880]" />}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-[#EAECF1]" />

      <div className="relative">
        <button
          onClick={() => setCountryOpen(!countryOpen)}
          className="flex w-full items-center justify-between px-4 py-4 text-[#2E3849] hover:bg-[#F3F5F7]"
          aria-expanded={countryOpen}
        >
          <div className="flex items-center gap-3">
            <IconLocation className="h-5 w-5 text-[#5A6881]" strokeWidth={1.5} />
            <span className="text-lg">{selectedCountry}</span>
          </div>
          <IconChevronDown
            className={`h-5 w-5 text-[#5A6881] transition-transform ${countryOpen ? "rotate-180" : ""}`}
            strokeWidth={1.5}
          />
        </button>

        {countryOpen && (
          <div className="border-t border-[#EAECF1] bg-[#F8F9FB]">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country.name)
                  setCountryOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-base hover:bg-[#EAECF1] ${
                  selectedCountry === country.name ? "text-[#0D3880] font-medium" : "text-[#2E3849]"
                }`}
              >
                {country.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#EAECF1]" />

      <Link
        href="/employer"
        onClick={onClose}
        className="block px-4 py-4 text-lg font-medium text-[#1E47A9] hover:bg-[#F3F5F7]"
      >
        Employer site
      </Link>

      <div className="border-t border-[#EAECF1]" />
    </div>
  )
}
