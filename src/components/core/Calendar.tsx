"use client"

import clsx from "clsx"
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"
import { es } from "date-fns/locale"
import type React from "react"
import { forwardRef, useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa"
import { type Theme, themes } from "../../constants/theme.constants"

// Importar los estilos de react-datepicker
import "react-datepicker/dist/react-datepicker.css"

export type SelectionMode = "day" | "week" | "month" | "range"

// Tipo para rangos predefinidos
export interface PresetRange {
  label: string
  value: [Date, Date]
}

export interface CalendarProps {
  // Valores y callbacks
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void

  // Configuración
  selectionMode?: SelectionMode
  minDate?: Date
  maxDate?: Date

  // Rangos predefinidos para métricas
  showPresetRanges?: boolean
  presetRanges?: PresetRange[]

  // Personalización
  theme?: Theme
  label?: string
  placeholder?: string
  showClearButton?: boolean
  dateFormat?: string
  rangeDisplayFormat?: string

  // Estados
  disabled?: boolean
  error?: boolean
  errorMessage?: string

  // Clases personalizadas
  className?: string
  calendarClassName?: string
  inputClassName?: string
}

// Rangos predefinidos comunes para métricas
const defaultPresetRanges = (): PresetRange[] => {
  const today = new Date()
  const yesterday = subDays(today, 1)

  return [
    {
      label: "Hoy",
      value: [startOfDay(today), endOfDay(today)],
    },
    {
      label: "Ayer",
      value: [startOfDay(yesterday), endOfDay(yesterday)],
    },
    {
      label: "Últimos 7 días",
      value: [startOfDay(subDays(today, 6)), endOfDay(today)],
    },
    {
      label: "Últimos 30 días",
      value: [startOfDay(subDays(today, 29)), endOfDay(today)],
    },
    {
      label: "Este mes",
      value: [startOfMonth(today), endOfDay(today)],
    },
    {
      label: "Mes pasado",
      value: [startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1))],
    },
    {
      label: "Este año",
      value: [startOfYear(today), endOfDay(today)],
    },
  ]
}

// Componente personalizado para el input del calendario
const CustomInput = forwardRef<HTMLDivElement, any>(
  (
    { value, onClick, placeholder, disabled, theme = "primary", error, showClearButton, onClear, rangeDisplayFormat },
    ref,
  ) => {
    // Extraer el color del tema
    const themeColor =
      themes[theme]
        .split(" ")
        .find((cls) => cls.startsWith("text-"))
        ?.replace("text-", "") || "cyan-500"

    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center gap-2 bg-neutral-950 rounded-lg px-4 py-2 cursor-pointer",
          error ? "ring-2 ring-red-500/40" : `focus-within:ring-2 focus-within:ring-${themeColor}/40`,
          "transition-all shadow-inner text-base",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        onClick={disabled ? undefined : onClick}
      >
        <FaCalendarAlt className={clsx(error ? "text-red-500" : `text-${themeColor}`)} />
        <div className="flex-1 text-white">
          {value || <span className="text-gray-400">{placeholder || "Seleccionar fecha"}</span>}
        </div>
        {value && showClearButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Limpiar selección"
          >
            <FaTimes />
          </button>
        )}
      </div>
    )
  },
)

CustomInput.displayName = "CustomInput"

const Calendar: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  onChange,
  selectionMode = "day",
  minDate,
  maxDate,
  showPresetRanges = false,
  presetRanges,
  theme = "primary",
  label,
  placeholder,
  showClearButton = true,
  dateFormat = "dd/MM/yyyy",
  rangeDisplayFormat = "dd MMM yyyy",
  disabled = false,
  error = false,
  errorMessage,
  className,
  calendarClassName,
  inputClassName,
}) => {
  // Estado local para manejar las fechas seleccionadas
  const [dates, setDates] = useState<[Date | null, Date | null]>([startDate, endDate])

  // Usar rangos predefinidos por defecto o los proporcionados
  const availablePresetRanges = presetRanges || defaultPresetRanges()

  // Extraer el color del tema para usarlo en los estilos personalizados
  const themeColor =
    themes[theme]
      .split(" ")
      .find((cls) => cls.startsWith("text-"))
      ?.replace("text-", "") || "cyan-500"

  // Actualizar el estado local cuando cambian las props
  useEffect(() => {
    setDates([startDate, endDate])
  }, [startDate, endDate])

  // Función para formatear el rango de fechas como string para mostrar en el input
  const formatDateRange = (start: Date | null, end: Date | null): string => {
    if (!start) return ""

    if (selectionMode === "day" || !end || isSameDay(start, end)) {
      return format(start, dateFormat)
    }

    return `${format(start, rangeDisplayFormat)} - ${format(end, rangeDisplayFormat)}`
  }

  // Función para manejar el cambio de fechas según el modo de selección
  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange(null, null)
      return
    }

    let newStartDate: Date | null = null
    let newEndDate: Date | null = null

    switch (selectionMode) {
      case "day":
        newStartDate = startOfDay(date)
        newEndDate = endOfDay(date)
        break

      case "week":
        newStartDate = startOfWeek(date, { weekStartsOn: 1 }) // Semana comienza el lunes
        newEndDate = endOfWeek(date, { weekStartsOn: 1 })
        break

      case "month":
        newStartDate = startOfMonth(date)
        newEndDate = endOfMonth(date)
        break

      case "range":
        if (!dates[0] || dates[1]) {
          // Si no hay fecha inicial o ya hay un rango completo, comenzar nuevo rango
          newStartDate = startOfDay(date)
          newEndDate = null
        } else {
          // Si ya hay fecha inicial pero no final
          if (date < dates[0]) {
            // Si la nueva fecha es anterior a la inicial, intercambiar
            newStartDate = startOfDay(date)
            newEndDate = endOfDay(dates[0])
          } else {
            // Si la nueva fecha es posterior a la inicial
            newStartDate = dates[0]
            newEndDate = endOfDay(date)
          }
        }
        break
    }

    onChange(newStartDate, newEndDate)
  }

  // Función para aplicar un rango predefinido
  const applyPresetRange = (range: [Date, Date]) => {
    onChange(range[0], range[1])
  }

  // Función para limpiar la selección
  const handleClear = () => {
    onChange(null, null)
  }

  // Función para resaltar días según el modo de selección
  const highlightDays = (date: Date) => {
    if (!dates[0]) return false

    if (selectionMode === "day") {
      return isSameDay(date, dates[0])
    }

    if (selectionMode === "week") {
      const weekStart = startOfWeek(dates[0], { weekStartsOn: 1 })
      const weekEnd = endOfWeek(dates[0], { weekStartsOn: 1 })
      return date >= weekStart && date <= weekEnd
    }

    if (selectionMode === "month") {
      const monthStart = startOfMonth(dates[0])
      const monthEnd = endOfMonth(dates[0])
      return date >= monthStart && date <= monthEnd
    }

    if (selectionMode === "range" && dates[1]) {
      return date >= dates[0] && date <= dates[1]
    }

    return isSameDay(date, dates[0])
  }

  // Función para obtener el formato URL de las fechas
  const getUrlFormat = (): string => {
    if (!dates[0]) return ""

    const start = dates[0].toISOString()
    const end = dates[1] ? dates[1].toISOString() : dates[0].toISOString()

    return `startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`
  }

  // Estilos personalizados para el calendario
  const calendarStyles = `
    .react-datepicker {
      background-color: #1a1a1a;
      border: 1px solid #333;
      border-radius: 0.5rem;
      font-family: inherit;
      overflow: hidden;
    }
    
    .react-datepicker__header {
      background-color: #262626;
      border-bottom: 1px solid #333;
      padding-top: 0.5rem;
    }
    
    .react-datepicker__current-month {
      color: white;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .react-datepicker__day-name {
      color: #999;
    }
    
    .react-datepicker__day {
      color: #ccc;
    }
    
    .react-datepicker__day:hover {
      background-color: #333;
      border-radius: 0.25rem;
    }
    
    .react-datepicker__day--selected,
    .react-datepicker__day--in-range {
      background-color: var(--${themeColor.replace("-", "-")});
      color: white;
      border-radius: 0.25rem;
    }
    
    .react-datepicker__day--keyboard-selected {
      background-color: var(--${themeColor.replace("-", "-")});
      color: white;
    }
    
    .react-datepicker__day--outside-month {
      color: #666;
    }
    
    .react-datepicker__navigation {
      top: 0.75rem;
    }
    
    .react-datepicker__navigation-icon::before {
      border-color: #ccc;
    }
    
    .react-datepicker__navigation:hover *::before {
      border-color: white;
    }
  `

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {/* Estilos personalizados */}
      <style>{calendarStyles}</style>

      {/* Label */}
      {label && <label className="text-sm font-medium text-gray-200">{label}</label>}

      {/* DatePicker */}
      <div className={inputClassName}>
        <DatePicker
          selected={dates[0]}
          startDate={dates[0]}
          endDate={dates[1]}
          onChange={handleDateChange}
          selectsRange={selectionMode === "range"}
          minDate={minDate}
          maxDate={maxDate}
          locale={es}
          dateFormat={dateFormat}
          disabled={disabled}
          calendarClassName={calendarClassName}
          customInput={
            <CustomInput
              placeholder={placeholder}
              disabled={disabled}
              theme={theme}
              error={error}
              showClearButton={showClearButton}
              onClear={handleClear}
              value={formatDateRange(dates[0], dates[1])}
              rangeDisplayFormat={rangeDisplayFormat}
            />
          }
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-2 py-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                type="button"
                className={clsx(
                  "p-1 rounded-full",
                  `hover:bg-${themeColor}/20`,
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                <FaChevronLeft className="text-white" />
              </button>

              <span className="text-white font-medium">{format(date, "MMMM yyyy", { locale: es })}</span>

              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                type="button"
                className={clsx(
                  "p-1 rounded-full",
                  `hover:bg-${themeColor}/20`,
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                <FaChevronRight className="text-white" />
              </button>
            </div>
          )}
          highlightDates={[
            {
              "react-datepicker__day--highlighted": Array.from({ length: 366 }, (_, i) =>
                addDays(new Date(), i - 183),
              ).filter(highlightDays),
            },
          ]}
        />
      </div>

      {/* Rangos predefinidos */}
      {showPresetRanges && (
        <div className="mt-3 flex flex-wrap gap-2">
          {availablePresetRanges.map((range, index) => (
            <button
              key={`preset-${index}`}
              onClick={() => applyPresetRange(range.value)}
              className={clsx(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                `bg-${themeColor}/10 hover:bg-${themeColor}/20 text-${themeColor}`,
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && errorMessage && <p className="text-xs text-red-400 mt-1">{errorMessage}</p>}

      {/* URL Format Display */}
      {dates[0] && (
        <div className="mt-2 p-3 bg-neutral-900 rounded-lg text-xs font-mono overflow-x-auto">
          <p className="text-gray-400 mb-1">Formato URL:</p>
          <code className={`text-${themeColor}`}>{getUrlFormat()}</code>
        </div>
      )}
    </div>
  )
}

export default Calendar

