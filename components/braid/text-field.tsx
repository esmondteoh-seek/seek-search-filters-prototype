import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react"
import { Text } from "./text"

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size"> {
  label: string
  secondaryLabel?: ReactNode
  tertiaryLabel?: ReactNode
  description?: string
  message?: string
  tone?: "neutral" | "critical" | "positive"
  className?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, secondaryLabel, tertiaryLabel, description, message, tone = "neutral", id: providedId, className, ...props },
  ref,
) {
  const generatedId = useId()
  const id = providedId || generatedId
  const descriptionId = description ? `${id}-description` : undefined
  const messageId = message ? `${id}-message` : undefined

  const inputToneClasses = {
    neutral: "ring-[#ABB3C1] focus:ring-[#1E47A9]",
    critical: "ring-[#B91E1E] focus:ring-[#B91E1E]",
    positive: "ring-[#12784F] focus:ring-[#12784F]",
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="block">
          <Text weight="medium">{label}</Text>
          {secondaryLabel && (
            <Text tone="secondary" size="small">
              {" "}
              {secondaryLabel}
            </Text>
          )}
        </label>
        {tertiaryLabel && (
          <Text tone="link" size="small">
            {tertiaryLabel}
          </Text>
        )}
      </div>

      {description && (
        <Text id={descriptionId} tone="secondary" size="small" component="p">
          {description}
        </Text>
      )}

      <input
        ref={ref}
        id={id}
        aria-describedby={cn(descriptionId, messageId) || undefined}
        aria-invalid={tone === "critical" ? "true" : undefined}
        className={cn(
          "w-full h-11 px-3 rounded-lg bg-white ring-1 transition-shadow",
          "text-[#2E3849] placeholder:text-[#838FA5]",
          "focus:outline-none focus:ring-2",
          inputToneClasses[tone],
        )}
        {...props}
      />

      {message && (
        <Text
          id={messageId}
          tone={tone === "critical" ? "critical" : tone === "positive" ? "positive" : "secondary"}
          size="small"
          component="p"
        >
          {message}
        </Text>
      )}
    </div>
  )
})
