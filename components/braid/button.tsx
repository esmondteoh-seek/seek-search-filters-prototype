import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"

type ButtonVariant = "solid" | "ghost" | "soft" | "transparent"
type ButtonTone = "brandAccent" | "critical" | "formAccent" | "neutral"
type ButtonSize = "standard" | "small"

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  icon?: ReactNode
  iconPosition?: "leading" | "trailing"
  loading?: boolean
  bleed?: boolean
  className?: string
}

const baseClasses =
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E47A9] focus-visible:ring-offset-2"

const sizeClasses: Record<ButtonSize, string> = {
  standard: "h-11 px-5 text-base rounded-lg gap-2",
  small: "h-9 px-4 text-sm rounded-md gap-1.5",
}

const variantToneClasses: Record<ButtonVariant, Record<ButtonTone, string>> = {
  solid: {
    brandAccent: "bg-[#0D3880] text-white hover:bg-[#072462] active:bg-[#051A49]",
    critical: "bg-[#B91E1E] text-white hover:bg-[#941110] active:bg-[#750606]",
    formAccent: "bg-[#1E47A9] text-white hover:bg-[#122F83] active:bg-[#081C60]",
    neutral: "bg-[#2E3849] text-white hover:bg-[#1C2330] active:bg-[#0E131B]",
  },
  ghost: {
    brandAccent: "border border-[#0D3880] text-[#0D3880] hover:bg-[#F0F6FC] active:bg-[#DCE5F2]",
    critical: "border border-[#B91E1E] text-[#B91E1E] hover:bg-[#FEF3F3] active:bg-[#FFE3E2]",
    formAccent: "border border-[#1E47A9] text-[#1E47A9] hover:bg-[#F0F7FE] active:bg-[#E5F0FD]",
    neutral: "border border-[#2E3849] text-[#2E3849] hover:bg-[#F3F5F7] active:bg-[#EAECF1]",
  },
  soft: {
    brandAccent: "bg-[#DCE5F2] text-[#0D3880] hover:bg-[#B6C7E0] active:bg-[#7795C2]",
    critical: "bg-[#FEF3F3] text-[#B91E1E] hover:bg-[#FFE3E2] active:bg-[#FDC8C8]",
    formAccent: "bg-[#E5F0FD] text-[#1E47A9] hover:bg-[#C9DEFA] active:bg-[#99BFF7]",
    neutral: "bg-[#F3F5F7] text-[#2E3849] hover:bg-[#EAECF1] active:bg-[#D2D7DF]",
  },
  transparent: {
    brandAccent: "text-[#0D3880] hover:bg-[#F0F6FC] active:bg-[#DCE5F2]",
    critical: "text-[#B91E1E] hover:bg-[#FEF3F3] active:bg-[#FFE3E2]",
    formAccent: "text-[#1E47A9] hover:bg-[#F0F7FE] active:bg-[#E5F0FD]",
    neutral: "text-[#2E3849] hover:bg-[#F3F5F7] active:bg-[#EAECF1]",
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "ghost",
    tone = "neutral",
    size = "standard",
    icon,
    iconPosition = "leading",
    loading = false,
    bleed = false,
    className,
    disabled,
    ...props
  },
  ref,
) {
  const effectiveVariant = tone !== "neutral" && variant === "ghost" ? "solid" : variant

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantToneClasses[effectiveVariant][tone],
        bleed && variant === "transparent" && "-mx-3",
        bleed && variant !== "transparent" && "-my-1",
        loading && "opacity-70 cursor-wait",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "leading" && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === "trailing" && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
})
