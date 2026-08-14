"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  name: string
  value: string
  onChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

interface RadioGroupProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function RadioGroup({ name, value = "", onChange, children, className }: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(value)
  const currentValue = value || internalValue

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <RadioGroupContext.Provider value={{ name, value: currentValue, onChange: handleChange }}>
      <div role="radiogroup" className={cn("flex flex-col gap-3", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioItemProps {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export function RadioItem({ value, label, description, disabled = false }: RadioItemProps) {
  const context = React.useContext(RadioGroupContext)
  const isChecked = context?.value === value

  return (
    <label className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-50")}>
      <input
        type="radio"
        name={context?.name}
        value={value}
        checked={isChecked}
        onChange={() => context?.onChange(value)}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isChecked ? "border-[#0d3880] bg-[#0d3880]" : "border-[#C8CED8] bg-white",
        )}
      >
        {isChecked && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <div className="flex flex-col">
        <span className="text-[#2E3849]">{label}</span>
        {description && <span className="text-sm text-[#5A6881]">{description}</span>}
      </div>
    </label>
  )
}
