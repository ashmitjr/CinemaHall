import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,         // optional: JSX for action buttons row
  variant = "default", // "default" | "danger" | "confirm"
  size    = "md",      // "sm" | "md" | "lg" | "full"
}) => {

  /* Escape key closes modal */
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else        document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const accentColor = variant === "danger" ? "#ff2d2d" : "var(--color-accent)";

  const sizes = {
    sm:   "max-w-md",
    md:   "max-w-2xl",
    lg:   "max-w-4xl",
    full: "max-w-[96vw]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.96, opacity: 0, y: 16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`relative w-full ${sizes[size] || sizes.md} overflow-hidden`}
            style={{
              backgroundColor: "#0e0e0e",
              border:          `1px solid #2a2a2a`,
              borderTop:       `2px solid ${accentColor}`,
            }}
            onClick={e => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6"
              style={{ borderBottom: "1px solid #1a1a1a" }}>
              <div className="flex items-center gap-4">
                {/* Accent dot */}
                <div className="w-2 h-2 shrink-0"
                  style={{ backgroundColor: accentColor }} />
                <h2 className="font-display uppercase text-white"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", lineHeight: 1 }}>
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-xs tracking-widest text-[#444444] hover:text-[#ff2d2d] px-3 py-2 ml-8 shrink-0"
                style={{
                  border: "1px solid #1e1e1e",
                  transition: "color 0.05s, border-color 0.05s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff2d2d"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; }}>
                ESC ×
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-8 overflow-y-auto" style={{ maxHeight: "70vh" }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-8 py-5 flex items-center justify-end gap-3"
                style={{ borderTop: "1px solid #1a1a1a" }}>
                {footer}
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};