import clsx from "clsx";
import { ButtonHTMLAttributes, ElementType } from "react";
import { Theme, themes } from "../../constants/theme.constants";
import LoadingSpinner from "./LoadingSpinner";

// Definir los temas de colore

// Definir las props del botón
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: Theme;
  icon?: ElementType;
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({ theme = "primary", icon: Icon, children, isLoading = false, className, ...props }) => {
  return (
    <button
      className={clsx(
        "flex gap-1 items-center justify-center font-medium w-max min-w-42 rounded-lg transition-all cursor-pointer active:scale-95 shadow-2xl",
        themes[theme],
        className
      )}
      {...props}
    >
      {isLoading
        ? <LoadingSpinner theme={theme}/>
        : <>
          {Icon && <Icon />} <span>{children}</span>
        </>
      }
    </button>
  );
};

export default Button;
