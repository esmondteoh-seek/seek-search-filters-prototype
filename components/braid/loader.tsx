import { cn } from "@/lib/utils"

type LoaderSize = "xsmall" | "small" | "standard" | "large"

interface LoaderProps {
  size?: LoaderSize
  delayVisibility?: boolean
  className?: string
}

const sizeClasses: Record<LoaderSize, string> = {
  xsmall: "h-3 w-3",
  small: "h-4 w-4",
  standard: "h-6 w-6",
  large: "h-8 w-8",
}

export function Loader({ size = "standard", delayVisibility = false, className }: LoaderProps) {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className={cn(
        "flex gap-1",
        delayVisibility && "animate-[fadeIn_200ms_ease-in_200ms_forwards] opacity-0",
        className,
      )}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn("rounded-full bg-[#1E47A9]", sizeClasses[size], "animate-bounce")}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
