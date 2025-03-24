import clsx from "clsx";
import { ButtonHTMLAttributes, ElementType } from "react";
import { invertedThemes, Theme, themes } from "../../constants/theme.constants";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: Theme;
  icon?: ElementType;
  isLoading?: boolean;
  fullWidth?: boolean;
  inverted?: boolean; // Nueva prop para alternar temas
}

const Button: React.FC<ButtonProps> = ({
  theme = "primary",
  icon: Icon,
  children,
  isLoading = false,
  fullWidth = true,
  inverted = false,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex gap-2 items-center justify-center font-medium px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95 shadow-2xl",
        `${fullWidth ? 'w-full' : "w-max"}`,
        inverted ? invertedThemes[theme] : themes[theme], // Cambia según la prop "inverted"
        className
      )}
      {...props}
    >
      {isLoading
        ? <LoadingSpinner theme={theme} />
        : <>
          {Icon && <Icon />} <span>{children}</span>
        </>
      }
    </button>
  );
};

export default Button;
