import { cn } from "@/lib/utils"
import { type AnchorHTMLAttributes, forwardRef, type ReactNode } from "react"

interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  children: ReactNode
  weight?: "regular" | "weak"
  showVisited?: boolean
  hitArea?: "standard" | "large"
  className?: string
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { children, weight = "regular", showVisited = false, hitArea = "standard", className, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(
        "underline underline-offset-2 transition-colors",
        weight === "regular" ? "text-[#1E47A9] hover:text-[#122F83]" : "text-inherit hover:text-[#1E47A9]",
        showVisited && "visited:text-[#5B2084]",
        hitArea === "large" && "py-2 -my-2 px-1 -mx-1",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
})
