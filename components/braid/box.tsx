import type React from "react"
import { cn } from "@/lib/utils"
import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from "react"
import type { JSX } from "react/jsx-runtime"

type SpaceValue =
  | "none"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "gutter"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "xxxlarge"

type ResponsiveValue<T> = T | { mobile?: T; tablet?: T; desktop?: T; wide?: T }

interface BoxProps<C extends ElementType = "div"> extends Omit<ComponentPropsWithoutRef<C>, "className"> {
  component?: C
  className?: string
  // Display
  display?: ResponsiveValue<"block" | "flex" | "inline" | "inlineBlock" | "none">
  // Position
  position?: "relative" | "absolute" | "fixed" | "sticky"
  // Spacing
  padding?: ResponsiveValue<SpaceValue>
  paddingX?: ResponsiveValue<SpaceValue>
  paddingY?: ResponsiveValue<SpaceValue>
  paddingTop?: ResponsiveValue<SpaceValue>
  paddingBottom?: ResponsiveValue<SpaceValue>
  paddingLeft?: ResponsiveValue<SpaceValue>
  paddingRight?: ResponsiveValue<SpaceValue>
  margin?: ResponsiveValue<SpaceValue>
  marginX?: ResponsiveValue<SpaceValue>
  marginY?: ResponsiveValue<SpaceValue>
  marginTop?: ResponsiveValue<SpaceValue>
  marginBottom?: ResponsiveValue<SpaceValue>
  marginLeft?: ResponsiveValue<SpaceValue>
  marginRight?: ResponsiveValue<SpaceValue>
  gap?: ResponsiveValue<SpaceValue>
  // Flexbox
  alignItems?: ResponsiveValue<"flexStart" | "center" | "flexEnd">
  justifyContent?: ResponsiveValue<"flexStart" | "center" | "flexEnd" | "spaceBetween">
  flexDirection?: ResponsiveValue<"row" | "column" | "rowReverse" | "columnReverse">
  flexWrap?: "wrap" | "nowrap"
  flexGrow?: 0 | 1
  flexShrink?: 0
  // Layout
  width?: "full" | "touchable"
  height?: "full" | "touchable"
  maxWidth?: "xsmall" | "small" | "medium" | "large" | "content"
  // Appearance
  background?:
    | "body"
    | "surface"
    | "brand"
    | "brandAccent"
    | "brandAccentHover"
    | "brandAccentActive"
    | "formAccent"
    | "formAccentHover"
    | "formAccentActive"
    | "formAccentSoft"
    | "positive"
    | "positiveLight"
    | "critical"
    | "criticalLight"
    | "criticalSoft"
    | "caution"
    | "cautionLight"
    | "info"
    | "infoLight"
    | "promote"
    | "promoteLight"
    | "neutral"
    | "neutralLight"
    | "neutralSoft"
    | "customLight"
    | "customDark"
  borderRadius?: ResponsiveValue<"none" | "small" | "standard" | "large" | "xlarge" | "full">
  boxShadow?:
    | "small"
    | "medium"
    | "large"
    | "borderNeutral"
    | "borderNeutralLight"
    | "borderField"
    | "borderFormAccent"
    | "borderCritical"
    | "borderPositive"
    | "borderCaution"
    | "borderInfo"
    | "borderPromote"
    | "outlineFocus"
  // Text
  textAlign?: ResponsiveValue<"left" | "center" | "right">
  // Interaction
  cursor?: "default" | "pointer"
  overflow?: "auto" | "hidden" | "scroll" | "visible"
  userSelect?: "none"
  // Z-index
  zIndex?: 0 | 1 | 2 | "dropdown" | "modal" | "notification" | "sticky"
}

const spaceMap: Record<SpaceValue, string> = {
  none: "0",
  xxsmall: "0.25rem",
  xsmall: "0.5rem",
  small: "0.75rem",
  medium: "1rem",
  gutter: "1.5rem",
  large: "2rem",
  xlarge: "2.5rem",
  xxlarge: "3rem",
  xxxlarge: "4rem",
}

const spaceTailwind: Record<SpaceValue, string> = {
  none: "0",
  xxsmall: "1",
  xsmall: "2",
  small: "3",
  medium: "4",
  gutter: "6",
  large: "8",
  xlarge: "10",
  xxlarge: "12",
  xxxlarge: "16",
}

function getResponsiveClass(
  prop: ResponsiveValue<string> | undefined,
  prefix: string,
  map: Record<string, string>,
): string {
  if (!prop) return ""
  if (typeof prop === "string") {
    return `${prefix}-${map[prop] || prop}`
  }
  const classes: string[] = []
  if (prop.mobile) classes.push(`${prefix}-${map[prop.mobile] || prop.mobile}`)
  if (prop.tablet) classes.push(`md:${prefix}-${map[prop.tablet] || prop.tablet}`)
  if (prop.desktop) classes.push(`lg:${prefix}-${map[prop.desktop] || prop.desktop}`)
  if (prop.wide) classes.push(`xl:${prefix}-${map[prop.wide] || prop.wide}`)
  return classes.join(" ")
}

const displayMap: Record<string, string> = {
  block: "block",
  flex: "flex",
  inline: "inline",
  inlineBlock: "inline-block",
  none: "hidden",
}

const alignItemsMap: Record<string, string> = {
  flexStart: "items-start",
  center: "items-center",
  flexEnd: "items-end",
}

const justifyContentMap: Record<string, string> = {
  flexStart: "justify-start",
  center: "justify-center",
  flexEnd: "justify-end",
  spaceBetween: "justify-between",
}

const flexDirectionMap: Record<string, string> = {
  row: "flex-row",
  column: "flex-col",
  rowReverse: "flex-row-reverse",
  columnReverse: "flex-col-reverse",
}

const backgroundMap: Record<string, string> = {
  body: "bg-white",
  surface: "bg-white",
  brand: "bg-[#051A49]",
  brandAccent: "bg-[#0D3880]",
  brandAccentHover: "bg-[#072462]",
  brandAccentActive: "bg-[#051A49]",
  formAccent: "bg-[#1E47A9]",
  formAccentHover: "bg-[#122F83]",
  formAccentActive: "bg-[#081C60]",
  formAccentSoft: "bg-[#E5F0FD]",
  positive: "bg-[#12784F]",
  positiveLight: "bg-[#E2F7F1]",
  critical: "bg-[#B91E1E]",
  criticalLight: "bg-[#FFE3E2]",
  criticalSoft: "bg-[#FEF3F3]",
  caution: "bg-[#FDC221]",
  cautionLight: "bg-[#FEF8DE]",
  info: "bg-[#1D559D]",
  infoLight: "bg-[#E3F2FB]",
  promote: "bg-[#7F35A9]",
  promoteLight: "bg-[#F9EBFD]",
  neutral: "bg-[#2E3849]",
  neutralLight: "bg-[#F3F5F7]",
  neutralSoft: "bg-[#F3F5F7]",
  customLight: "bg-white",
  customDark: "bg-gray-900",
}

const borderRadiusMap: Record<string, string> = {
  none: "rounded-none",
  small: "rounded-sm",
  standard: "rounded",
  large: "rounded-lg",
  xlarge: "rounded-xl",
  full: "rounded-full",
}

const boxShadowMap: Record<string, string> = {
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-lg",
  borderNeutral: "ring-1 ring-[#D2D7DF]",
  borderNeutralLight: "ring-1 ring-[#EAECF1]",
  borderField: "ring-1 ring-[#ABB3C1]",
  borderFormAccent: "ring-1 ring-[#1E47A9]",
  borderCritical: "ring-1 ring-[#B91E1E]",
  borderPositive: "ring-1 ring-[#12784F]",
  borderCaution: "ring-1 ring-[#FDC221]",
  borderInfo: "ring-1 ring-[#1D559D]",
  borderPromote: "ring-1 ring-[#7F35A9]",
  outlineFocus: "ring-2 ring-[#1E47A9] ring-offset-2",
}

const maxWidthMap: Record<string, string> = {
  xsmall: "max-w-xs",
  small: "max-w-sm",
  medium: "max-w-md",
  large: "max-w-lg",
  content: "max-w-prose",
}

const zIndexMap: Record<string | number, string> = {
  0: "z-0",
  1: "z-10",
  2: "z-20",
  dropdown: "z-30",
  modal: "z-50",
  notification: "z-[60]",
  sticky: "z-40",
}

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    component: Component = "div",
    className,
    display,
    position,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    gap,
    alignItems,
    justifyContent,
    flexDirection,
    flexWrap,
    flexGrow,
    flexShrink,
    width,
    height,
    maxWidth,
    background,
    borderRadius,
    boxShadow,
    textAlign,
    cursor,
    overflow,
    userSelect,
    zIndex,
    ...props
  },
  ref,
) {
  const classes = cn(
    // Display
    display && (typeof display === "string" ? displayMap[display] : getResponsiveClass(display, "", displayMap)),
    // Position
    position,
    // Padding
    padding && getResponsiveClass(padding, "p", spaceTailwind),
    paddingX && getResponsiveClass(paddingX, "px", spaceTailwind),
    paddingY && getResponsiveClass(paddingY, "py", spaceTailwind),
    paddingTop && getResponsiveClass(paddingTop, "pt", spaceTailwind),
    paddingBottom && getResponsiveClass(paddingBottom, "pb", spaceTailwind),
    paddingLeft && getResponsiveClass(paddingLeft, "pl", spaceTailwind),
    paddingRight && getResponsiveClass(paddingRight, "pr", spaceTailwind),
    // Margin
    margin && getResponsiveClass(margin, "m", spaceTailwind),
    marginX && getResponsiveClass(marginX, "mx", spaceTailwind),
    marginY && getResponsiveClass(marginY, "my", spaceTailwind),
    marginTop && getResponsiveClass(marginTop, "mt", spaceTailwind),
    marginBottom && getResponsiveClass(marginBottom, "mb", spaceTailwind),
    marginLeft && getResponsiveClass(marginLeft, "ml", spaceTailwind),
    marginRight && getResponsiveClass(marginRight, "mr", spaceTailwind),
    // Gap
    gap && getResponsiveClass(gap, "gap", spaceTailwind),
    // Flexbox
    alignItems && (typeof alignItems === "string" ? alignItemsMap[alignItems] : ""),
    justifyContent && (typeof justifyContent === "string" ? justifyContentMap[justifyContent] : ""),
    flexDirection && (typeof flexDirection === "string" ? flexDirectionMap[flexDirection] : ""),
    flexWrap === "wrap" && "flex-wrap",
    flexWrap === "nowrap" && "flex-nowrap",
    flexGrow === 1 && "grow",
    flexGrow === 0 && "grow-0",
    flexShrink === 0 && "shrink-0",
    // Layout
    width === "full" && "w-full",
    width === "touchable" && "w-11",
    height === "full" && "h-full",
    height === "touchable" && "h-11",
    maxWidth && maxWidthMap[maxWidth],
    // Appearance
    background && backgroundMap[background],
    borderRadius && (typeof borderRadius === "string" ? borderRadiusMap[borderRadius] : ""),
    boxShadow && boxShadowMap[boxShadow],
    // Text
    textAlign && (typeof textAlign === "string" ? `text-${textAlign}` : ""),
    // Interaction
    cursor === "pointer" && "cursor-pointer",
    cursor === "default" && "cursor-default",
    overflow && `overflow-${overflow}`,
    userSelect === "none" && "select-none",
    // Z-index
    zIndex !== undefined && zIndexMap[zIndex],
    className,
  )

  return <Component ref={ref} className={classes} {...props} />
}) as <C extends ElementType = "div">(props: BoxProps<C> & { ref?: React.Ref<HTMLElement> }) => JSX.Element
