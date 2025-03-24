import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Theme, themes } from "../../constants/theme.constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  theme?: Theme;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  theme = "primary",
  size = "md",
  closeOnClickOutside = true,
  showCloseButton = true,
  className,
  contentClassName,
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Prevent body scroll when modal is open
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
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className={clsx(
              "relative flex flex-col w-full bg-neutral-900/90 border border-neutral-800 rounded-lg shadow-xl",
              modalSizes[size],
              className
            )}
            tabIndex={-1}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.2
            }}
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
            <div className={clsx("flex-1 p-4 overflow-auto", contentClassName)}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-neutral-800">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
