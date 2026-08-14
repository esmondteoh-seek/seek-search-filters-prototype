import { useEffect, useRef, useState } from "react"
import { SeekLogo } from "@/components/seek-logo"
import { IconChevronDown } from "@/components/braid/icons"
import { cn } from "@/lib/utils"
import { navigateToHome, useAppViewState } from "@/src/hooks/useAppNavigation"

const navItems = [
  { label: "Job search", id: "job-search" as const },
  { label: "People search", id: "people-search" as const },
  { label: "Career advice", id: "career-advice" as const },
  { label: "Companies", id: "companies" as const },
  { label: "Recruiters", id: "recruiters" as const },
]

interface SiteHeaderProps {
  showDivider?: boolean
  userName?: string
  /** When false, header scrolls with page (mobile SERP) */
  sticky?: boolean
  /** Slide header off-screen — used with scroll-away behaviour */
  hidden?: boolean
  /** Skip transform transition when reduced motion is preferred */
  instant?: boolean
  /** Underline Job search — defaults to home + jobs (SERP) */
  jobSearchActive?: boolean
  /** Active nav underline colour — brand pink matches Strong Applicant Figma */
  activeNavUnderline?: "neutral" | "brand"
}

export function SiteHeader({
  showDivider = false,
  userName = "Michael",
  sticky = true,
  hidden = false,
  instant = false,
  jobSearchActive,
  activeNavUnderline = "neutral",
}: SiteHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const appView = useAppViewState()
  const jobSearchIsActive =
    jobSearchActive ?? (appView === "home" || appView === "jobs")

  useEffect(() => {
    if (hidden) setProfileOpen(false)
  }, [hidden])

  useEffect(() => {
    if (!profileOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [profileOpen])

  const handleHomeNav = (e: React.MouseEvent) => {
    e.preventDefault()
    navigateToHome()
  }

  return (
    <header
      className={cn(
        "bg-white",
        !instant && "transition-[transform,box-shadow,border-color] duration-200 ease-out",
        sticky && "sticky top-0 z-50 will-change-transform",
        hidden && sticky && "-translate-y-full pointer-events-none",
        showDivider ? "border-b border-[#EAECF1] shadow-sm" : "border-b border-[#EAECF1]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 lg:px-0">
        <div className="flex min-w-0 items-center gap-10 lg:gap-12">
          <a href="/" aria-label="SEEK Home" className="shrink-0" onClick={handleHomeNav}>
            <SeekLogo className="h-10 w-auto text-[#2E3849]" />
          </a>
          <nav className="hidden items-stretch self-stretch lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = item.id === "job-search" && jobSearchIsActive
              const isJobSearch = item.id === "job-search"

              return (
                <a
                  key={item.label}
                  href={isJobSearch ? "/" : "#"}
                  onClick={isJobSearch ? handleHomeNav : (e) => e.preventDefault()}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center px-3.5 text-sm tracking-tight",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E47A9]",
                    active
                      ? "font-medium text-[#2E3849]"
                      : "font-normal text-[#697586] hover:text-[#2E3849]",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      className={cn(
                        "absolute inset-x-3.5 bottom-0 h-0.5",
                        activeNavUnderline === "brand" ? "bg-[#E60278]" : "bg-[#2E3849]",
                      )}
                      aria-hidden
                    />
                  ) : null}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block" ref={menuRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-1.5 text-sm font-medium text-[#2E3849] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              {userName}
              <IconChevronDown className={cn("h-4 w-4 text-[#697586] transition-transform", profileOpen && "rotate-180")} />
            </button>
            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 min-w-[180px] origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-[#EAECF1] filter-menu-enter"
              >
                {["Profile", "Saved searches", "Saved jobs", "Settings"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    role="menuitem"
                    className="block px-5 py-3 text-sm text-[#2E3849] hover:bg-[#F3F5F7]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#" className="hidden text-sm font-medium text-[#1E47A9] hover:underline lg:block">
            Employer site
          </a>
          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-[#2E3849] lg:hidden"
          >
            Menu
            <IconChevronDown className="h-4 w-4 text-[#697586]" />
          </button>
        </div>
      </div>
    </header>
  )
}
