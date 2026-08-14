import { cn } from "@/lib/utils"

interface RatingProps {
  rating: number
  size?: "small" | "standard" | "large"
  showTextRating?: boolean
  className?: string
}

const sizeClasses: Record<string, string> = {
  small: "h-4 w-4",
  standard: "h-5 w-5",
  large: "h-6 w-6",
}

export function Rating({ rating, size = "standard", showTextRating = false, className }: RatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg
            key={`full-${i}`}
            className={cn(sizeClasses[size], "text-[#FDC221]")}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className={cn(sizeClasses[size], "text-[#FDC221]")} viewBox="0 0 24 24">
            <defs>
              <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D2D7DF" />
              </linearGradient>
            </defs>
            <path
              fill="url(#halfGradient)"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg
            key={`empty-${i}`}
            className={cn(sizeClasses[size], "text-[#D2D7DF]")}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      {showTextRating && <span className="text-sm text-[#2E3849] font-medium ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}
