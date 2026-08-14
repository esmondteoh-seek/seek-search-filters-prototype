import { type AnchorHTMLAttributes, type ReactNode } from "react"

/** Vite stub — replaces next/link in the Braid button-link wrapper */
export default function Link({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
