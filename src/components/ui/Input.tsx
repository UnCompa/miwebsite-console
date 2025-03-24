import clsx from 'clsx';
import React, { forwardRef, useId, useState } from 'react';
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { InputTheme, inputThemes } from '../../constants/theme.constants';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // Propiedades básicas
  label?: string;
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Estilo y apariencia
  icon?: React.ReactNode;
  theme?: InputTheme;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;

  // Funcionalidades específicas
  showPasswordToggle?: boolean;
  helperText?: string;

  // Manejo de errores
  error?: boolean;
  errorMessage?: string;

  // Contenedor
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  // Propiedades básicas
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,

  // Estilo y apariencia
  icon,
  theme = 'primary',
  size = 'md',
  fullWidth = true,

  // Funcionalidades específicas
  showPasswordToggle = false,
  helperText,

  // Manejo de errores
  error = false,
  errorMessage,

  // Clases personalizadas
  containerClassName,
  labelClassName,
  inputClassName,
  helperTextClassName,
  errorClassName,

  // Otras propiedades
  disabled,
  required,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();

  // Extraer el color del tema para usarlo en los estados de foco y error
  const inputThemeColor = inputThemes[theme] || 'cyan-500';

  // Determinar el tamaño del input
  const sizeClasses = {
    sm: 'py-1 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg',
  };

  return (
    <div className={clsx(
      'flex flex-col gap-1',
      fullWidth && 'w-full',
      containerClassName
    )}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'text-sm font-medium text-gray-200',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
            error && 'text-red-400',
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      {/* Input container */}
      <div className={clsx(
        'flex items-center gap-2 bg-neutral-950 rounded-lg px-4',
        sizeClasses[size],
        'transition-all shadow-inner',
        error
          ? 'ring-2 ring-red-500/40'
          : `focus-within:ring-2 focus-within:ring-[${inputThemeColor}] focus:ring-[${inputThemeColor}/40]`,
        disabled && 'opacity-60 cursor-not-allowed',
        inputClassName
      )}>
        {/* Icon */}
        {icon && (
          <span className={clsx(
            'text-gray-400',
            error && 'text-red-400'
          )}>
            {icon}
          </span>
        )}

        {/* Input */}
        <input
          id={inputId}
          ref={ref}
          type={showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx(
            'bg-transparent flex-1 outline-none text-white placeholder-gray-400',
            disabled && 'cursor-not-allowed'
          )}
          {...rest}
        />

        {/* Password toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={clsx(
              `text-${inputThemeColor} text-lg`,
              disabled && 'opacity-60 cursor-not-allowed'
            )}
            disabled={disabled}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}

        {/* Error icon */}
        {error && !showPasswordToggle && (
          <FaExclamationCircle className="text-red-500" />
        )}
      </div>

      {/* Helper text or error message */}
      {(helperText || (error && errorMessage)) && (
        <p className={clsx(
          'text-xs mt-1',
          error ? 'text-red-400' : 'text-gray-400',
          error ? errorClassName : helperTextClassName
        )}>
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
