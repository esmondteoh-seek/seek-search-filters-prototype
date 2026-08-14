"use client"

import Link from "next/link"
import { SeekLogo } from "@/components/seek-logo"

interface MobileProfileMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenMainNav: () => void
}

const profileMenuItems = [
  { label: "Profile", href: "/profile/me" },
  { label: "Saved searches", href: "/my-activity/saved-searches" },
  { label: "Saved jobs", href: "/my-activity/saved-jobs" },
  { label: "Applied jobs", href: "/my-activity/applied-jobs" },
  { label: "Settings", href: "/settings" },
]

export function MobileProfileMenu({ isOpen, onClose, onOpenMainNav }: MobileProfileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white lg:hidden">
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#EAECF1]">
        <Link href="/" onClick={onClose} aria-label="SEEK Home">
          <SeekLogo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          {/* Rounded square avatar */}
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0D6FA]"
            aria-label="Close profile menu"
          >
            <span className="text-base font-medium text-[#2E3849]">R</span>
          </button>
          <button
            onClick={() => {
              onClose()
              onOpenMainNav()
            }}
            aria-label="Open main menu"
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

      {/* User Name */}
      <div className="px-4 py-4 border-b border-[#EAECF1]">
        <span className="text-lg font-semibold text-[#2E3849]">Richard</span>
      </div>

      {/* Profile Menu Items */}
      <nav className="flex flex-col" aria-label="Profile menu">
        {profileMenuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="px-4 py-4 text-lg text-[#5A6881] hover:bg-[#F3F5F7]"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-[#EAECF1]" />

      {/* Sign out - red text */}
      <button onClick={onClose} className="w-full px-4 py-4 text-left text-lg text-[#D0011B] hover:bg-[#F3F5F7]">
        Sign out
      </button>

      {/* Divider */}
      <div className="border-t border-[#EAECF1]" />
    </div>
  )
}
