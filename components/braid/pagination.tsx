"use client"

import { IconChevronLeft, IconChevronRight } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  total: number
  onChange: (page: number) => void
  label?: string
  className?: string
}

export function Pagination({ page, total, onChange, label = "Pagination", className }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = []

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", total)
      } else if (page >= total - 2) {
        pages.push(1, "ellipsis", total - 3, total - 2, total - 1, total)
      } else {
        pages.push(1, "ellipsis", page - 1, page, page + 1, "ellipsis", total)
      }
    }

    return pages
  }

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          page === 1 ? "cursor-not-allowed text-[#C8CED8]" : "text-[#5A6881] hover:bg-[#F5F6F8]",
        )}
        aria-label="Previous page"
      >
        <IconChevronLeft className="h-5 w-5" />
      </button>

      {getVisiblePages().map((p, index) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[#5A6881]">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              page === p ? "bg-[#0d3880] text-white" : "text-[#5A6881] hover:bg-[#F5F6F8]",
            )}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          page === total ? "cursor-not-allowed text-[#C8CED8]" : "text-[#5A6881] hover:bg-[#F5F6F8]",
        )}
        aria-label="Next page"
      >
        <IconChevronRight className="h-5 w-5" />
      </button>
    </nav>
  )
}
