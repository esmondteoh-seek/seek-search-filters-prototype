import { cn } from "@/lib/utils"

interface AvatarProps {
  name?: string
  src?: string
  size?: "xsmall" | "small" | "standard" | "large" | "xlarge"
  className?: string
}

export function Avatar({ name, src, size = "standard", className }: AvatarProps) {
  const sizeClasses = {
    xsmall: "h-6 w-6 text-xs",
    small: "h-8 w-8 text-sm",
    standard: "h-10 w-10 text-base",
    large: "h-12 w-12 text-lg",
    xlarge: "h-16 w-16 text-xl",
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getBackgroundColor = (name: string) => {
    const colors = ["bg-[#F0D6FA]", "bg-[#D0EFFF]", "bg-[#D4F7E5]", "bg-[#FFECD4]", "bg-[#FFD9D9]"]
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  if (src) {
    return (
      <img
        src={src || "/placeholder.svg"}
        alt={name || "Avatar"}
        className={cn("rounded-lg object-cover", sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg font-medium text-[#2E3849]",
        sizeClasses[size],
        name ? getBackgroundColor(name) : "bg-[#E8EAF0]",
        className,
      )}
      aria-label={name}
    >
      {name ? getInitials(name) : "?"}
    </div>
  )
}
