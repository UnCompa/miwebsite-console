"use client"

import clsx from "clsx"
import { motion } from "framer-motion"
import type React from "react"
import { useId } from "react"
import { themesSwitcher, type Theme } from "../../constants/theme.constants"

export interface SwitcherProps {
  // Estado
  checked: boolean
  onChange: (checked: boolean) => void

  // Apariencia
  label?: React.ReactNode
  labelPosition?: "left" | "right"
  size?: "sm" | "md" | "lg"
  theme?: Theme

  // Estados
  disabled?: boolean
  required?: boolean

  // Clases personalizadas
  className?: string
  switchClassName?: string
  labelClassName?: string

  // Otros
  name?: string
  id?: string
}

const Switcher: React.FC<SwitcherProps> = ({
  checked,
  onChange,
  label,
  labelPosition = "right",
  size = "md",
  theme = "primary",
  disabled = false,
  required = false,
  className,
  switchClassName,
  labelClassName,
  name,
  id: propId,
}) => {
  const generatedId = useId()
  const id = propId || `switcher-${generatedId}`

  // Extraer el color del tema

  // Tamaños del switch
  const switchSizes = {
    sm: {
      container: "w-8 h-4",
      circle: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      container: "w-11 h-6",
      circle: "w-5 h-5",
      translate: "translate-x-1.1",
    },
    lg: {
      container: "w-14 h-7",
      circle: "w-6 h-6",
      translate: "translate-x-7",
    },
  }

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div
      className={clsx(
        "flex items-center",
        labelPosition === "left" ? "flex-row-reverse justify-end" : "justify-start",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {/* Switch */}
      <div className={clsx("relative inline-flex items-center shrink-0", switchClassName)}>
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
        />

        <motion.div
          className={clsx(
            "cursor-pointer rounded-full transition-colors",
            switchSizes[size].container,
            checked ? `${themesSwitcher[theme]}` : "bg-neutral-700",
            disabled && "cursor-not-allowed",
          )}
          animate={{ backgroundColor: checked ? `var(--${themesSwitcher[theme].replace("-", "-")})` : "rgb(64, 64, 64)" }}
          onClick={handleChange}
        >
          <motion.div
            className={clsx(
              "absolute top-0.5 left-0.5 bg-white rounded-full shadow-md transform",
              switchSizes[size].circle,
            )}
            animate={{
              x: checked ? switchSizes[size].translate.split("-")[2].split("x-") + "rem" : "0rem",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "text-sm text-gray-200 select-none",
            labelPosition === "left" ? "mr-3" : "ml-3",
            disabled && "cursor-not-allowed",
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Switcher

