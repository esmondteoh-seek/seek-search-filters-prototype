import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes, useId } from "react"
import { Text } from "./text"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type" | "size"> {
  label: string
  description?: string
  tone?: "neutral" | "critical"
  size?: "standard" | "small"
  className?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, tone = "neutral", size = "standard", id: providedId, className, ...props },
  ref,
) {
  const generatedId = useId()
  const id = providedId || generatedId

  const checkboxSize = size === "small" ? "h-4 w-4" : "h-5 w-5"

  return (
    <div className={cn("flex gap-3", className)}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={cn(
          checkboxSize,
          "mt-0.5 shrink-0 rounded border-[#ABB3C1] text-[#1E47A9] cursor-pointer",
          "focus:ring-2 focus:ring-[#1E47A9] focus:ring-offset-2",
          tone === "critical" && "border-[#B91E1E]",
        )}
        {...props}
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <label htmlFor={id} className="cursor-pointer">
          <Text size={size}>{label}</Text>
        </label>
        {description && (
          <Text tone="secondary" size="small" component="p">
            {description}
          </Text>
        )}
      </div>
    </div>
  )
})
