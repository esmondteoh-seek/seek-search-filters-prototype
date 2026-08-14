"use client"

import type * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { IconClose, IconPositive, IconCritical, IconInfo, IconCaution } from "@/components/braid/icons"
import { cn } from "@/lib/utils"

type ToastTone = "neutral" | "positive" | "critical" | "caution"

interface Toast {
  id: string
  message: string
  description?: string
  tone: ToastTone
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...toast, id }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const toneStyles = {
    neutral: "bg-white border-[#878f9b]",
    positive: "bg-[#f4faf3] border-[#138a08]",
    critical: "bg-[#fff1f3] border-[#d0011b]",
    caution: "bg-[#fef8f1] border-[#8a4800]",
  }

  const icons = {
    neutral: <IconInfo className="h-5 w-5 text-[#2765cf]" />,
    positive: <IconPositive className="h-5 w-5 text-[#138a08]" />,
    critical: <IconCritical className="h-5 w-5 text-[#d0011b]" />,
    caution: <IconCaution className="h-5 w-5 text-[#8a4800]" />,
  }

  return (
    <div
      role="alert"
      className={cn("flex w-80 items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg", toneStyles[toast.tone])}
    >
      {icons[toast.tone]}
      <div className="flex-1">
        <p className="font-medium text-[#2d3648]">{toast.message}</p>
        {toast.description && <p className="mt-1 text-sm text-[#5a6881]">{toast.description}</p>}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-[#2765cf] hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="text-[#5a6881] hover:text-[#2d3648]">
        <IconClose className="h-4 w-4" />
      </button>
    </div>
  )
}
