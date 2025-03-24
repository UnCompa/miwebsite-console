"use client"

import clsx from "clsx"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import { themes, type Theme } from "../../constants/theme.constants"

// Define dropdown direction
export type DropdownDirection = "down" | "up" | "left" | "right"

// Define dropdown item props
interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  icon?: ElementType
  disabled?: boolean
  className?: string
}

// Define dropdown props
interface DropdownProps {
  label?: string | ReactNode
  icon?: ElementType
  items: DropdownItemProps[]
  theme?: Theme
  direction?: DropdownDirection
  buttonClassName?: string
  menuClassName?: string
  fullWidth?: boolean
}

// Direction-based positioning classes
const directionClasses = {
  down: "top-full left-0 mt-1",
  up: "bottom-full left-0 mb-1",
  left: "right-full top-0 mr-1",
  right: "left-full top-0 ml-1",
}

const Dropdown = ({
  label,
  icon: Icon,
  items,
  theme = "primary",
  direction = "down",
  buttonClassName,
  menuClassName,
  fullWidth = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleItemClick = (onClick?: () => void) => {
    return () => {
      if (onClick) onClick()
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className={clsx("relative inline-block", fullWidth && "w-full")}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center justify-between gap-2 font-medium px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95 shadow-2xl",
          fullWidth && "w-full",
          themes[theme],
          buttonClassName,
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon size={18} />}
          {label}
        </span>
        <ChevronDown
          size={16}
          className={clsx("ml-2 transition-transform duration-200", isOpen && "transform rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          className={clsx(
            "absolute z-10 min-w-[200px] rounded-md shadow-lg bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50 py-1 animate-in fade-in-50 zoom-in-95 duration-100",
            directionClasses[direction],
            menuClassName,
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            const ItemIcon = item.icon
            return (
              <button
                key={index}
                onClick={!item.disabled ? handleItemClick(item.onClick) : undefined}
                className={clsx(
                  "flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors",
                  "hover:bg-neutral-700/50 focus:bg-neutral-700/50 focus:outline-none",
                  item.disabled ? "opacity-50 cursor-not-allowed" : "",
                  item.className,
                )}
                disabled={item.disabled}
                role="menuitem"
              >
                {ItemIcon && <ItemIcon size={16} />}
                {item.children}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown

