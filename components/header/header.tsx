"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { SeekLogo } from "@/components/seek-logo"
import { IconChevronUp } from "@/components/braid/icons"
import { MobileNav } from "./mobile-nav"
import { MobileProfileMenu } from "./mobile-profile-menu"

const navItems = [
  { label: "Job search", href: "/", active: true },
  { label: "People search", href: "/people-search" },
  { label: "Career advice", href: "/career-advice" },
  { label: "Companies", href: "/companies" },
  { label: "Recruiters", href: "/recruiters" },
]

const profileMenuItems = [
  { label: "Profile", href: "/profile/me" },
  { label: "Saved searches", href: "/my-activity/saved-searches" },
  { label: "Saved jobs", href: "/my-activity/saved-jobs" },
  { label: "Applied jobs", href: "/my-activity/applied-jobs" },
  { label: "Settings", href: "/settings" },
]

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [profileMenuOpen])

  return (
    <header className="top-0 z-50 w-full border-b border-[#EAECF1] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 lg:px-8 justify-between flex-row">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center" aria-label="SEEK Home">
            <SeekLogo className="h-10 w-auto text-[#2E3849]" />
          </Link>

          <nav className="ml-10 hidden items-stretch self-stretch lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex h-16 items-center px-3.5 text-sm tracking-tight transition-colors ${
                  item.active ? "font-medium text-[#2E3849]" : "font-normal text-[#697586] hover:text-[#2E3849]"
                }`}
              >
                {item.label}
                {item.active && <span className="absolute inset-x-3.5 bottom-0 h-0.5 bg-[#2E3849]" />}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 justify-end">
          {/* User Avatar with Dropdown - Desktop */}
          <div className="relative hidden lg:block">
            <button
              ref={buttonRef}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1"
              aria-haspopup="true"
              aria-expanded={profileMenuOpen}
              aria-label="Profile menu"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0D6FA] text-sm font-medium"
                aria-hidden="true"
              >
                <span className="text-[#2E3849]">R</span>
              </div>
              <IconChevronUp
                className={`h-4 w-4 text-[#2E3849] transition-transform duration-200 ${
                  profileMenuOpen ? "" : "rotate-180"
                }`}
              />
            </button>

            {profileMenuOpen && (
              <div
                ref={menuRef}
                role="menu"
                tabIndex={-1}
                className="absolute right-0 top-full mt-1 min-w-[180px] overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-[#EAECF1]"
                style={{
                  boxShadow: "0 4px 14px rgba(28, 28, 28, 0.12)",
                }}
              >
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    role="menuitem"
                    tabIndex={-1}
                    className="block px-5 py-3 text-sm text-[#2E3849] transition-colors hover:bg-[#F3F5F7]"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-[#EAECF1]" />
                <button
                  role="menuitem"
                  tabIndex={-1}
                  className="block w-full px-5 py-3 text-left text-sm text-[#B91E1E] transition-colors hover:bg-[#F3F5F7]"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <Link
            href="/employer"
            className="hidden text-sm font-medium text-[#1E47A9] transition-colors hover:underline lg:block"
          >
            Employer site
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileProfileMenuOpen(!mobileProfileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0D6FA]"
              aria-label={mobileProfileMenuOpen ? "Close profile menu" : "Open profile menu"}
              aria-expanded={mobileProfileMenuOpen}
            >
              <span className="text-base font-medium text-[#2E3849]">R</span>
            </button>

            <button
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2E3849"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <MobileProfileMenu
        isOpen={mobileProfileMenuOpen}
        onClose={() => setMobileProfileMenuOpen(false)}
        onOpenMainNav={() => setMobileNavOpen(true)}
      />
    </header>
  )
}
