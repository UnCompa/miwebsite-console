import clsx from "clsx"
import type { HTMLAttributes, ReactNode } from "react"
import type { Theme } from "../../constants/theme.constants"

// Define Card props
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Theme
  children: ReactNode
  bordered?: boolean
  elevated?: boolean
  className?: string
}

// Define Card Header props
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children: ReactNode
}

// Define Card Body props
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children: ReactNode
}

// Define Card Footer props
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children: ReactNode
}

// Card theme styles
const cardThemes = {
  neutral: "bg-stone-950/5 border-stone-200/10 text-stone-200",
  primary: "bg-neutral-900/5 border-cyan-500/10 text-cyan-700",
  secondary: "bg-neutral-900/5 border-blue-500/10 text-blue-700",
  danger: "bg-red-900/5 border-red-500/10 text-red-700",
  success: "bg-green-900/5 border-green-500/10 text-green-700",
  warning: "bg-yellow-900/5 border-yellow-500/10 text-yellow-700",
} as const

// Card component
const Card = ({ theme = "neutral", children, bordered = true, elevated = false, className, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-lg transition-all",
        cardThemes[theme],
        bordered && "border",
        elevated && "shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Header component
const CardHeader = ({ className, children, ...props }: CardHeaderProps) => {
  return (
    <div className={clsx("px-6 py-4 border-b border-inherit", className)} {...props}>
      {children}
    </div>
  )
}

// Card Body component
const CardBody = ({ className, children, ...props }: CardBodyProps) => {
  return (
    <div className={clsx("px-6 py-4", className)} {...props}>
      {children}
    </div>
  )
}

// Card Footer component
const CardFooter = ({ className, children, ...props }: CardFooterProps) => {
  return (
    <div className={clsx("px-6 py-4 border-t border-inherit", className)} {...props}>
      {children}
    </div>
  )
}

// Attach subcomponents to Card
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card

