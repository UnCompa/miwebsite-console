import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Theme, themes } from "../../constants/theme.constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  theme?: Theme;
  position?: "left" | "right";
  width?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const sidebarWidths = {
  xs: "w-64",
  sm: "w-72",
  md: "w-80",
  lg: "w-96",
  xl: "w-[28rem]",
  full: "w-full max-w-md",
};

const Sidebar = ({
  isOpen,
  onClose,
  title,
  children,
  theme = "primary",
  position = "left",
  width = "md",
  closeOnClickOutside = true,
  showCloseButton = true,
  className,
  contentClassName,
}: SidebarProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Extract the text color from the theme
  const themeTextColor = themes[theme].split(" ").find(cls => cls.startsWith("text-"));

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnClickOutside && overlayRef.current === e.target) {
      onClose();
    }
  };

  // Focus trap
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  // Variants for animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const sidebarVariants = {
    hidden: {
      x: position === "left" ? "-100%" : "100%",
      opacity: 0.5
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    },
    exit: {
      x: position === "left" ? "-100%" : "100%",
      opacity: 0.5,
      transition: {
        type: "spring",
        damping: 35,
        stiffness: 300
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={sidebarRef}
            className={clsx(
              "flex flex-col h-full bg-neutral-900/90 border-neutral-800 shadow-xl",
              sidebarWidths[width],
              position === "left" ? "border-r" : "border-l ml-auto",
              className
            )}
            tabIndex={-1}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                {title && (
                  <h3 className={clsx("text-lg font-semibold", themeTextColor)}>
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                    aria-label="Cerrar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={clsx("flex-1 overflow-auto", contentClassName)}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Sidebar;
