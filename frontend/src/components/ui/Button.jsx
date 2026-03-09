import React from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const VARIANTS = {
  primary: {
    bg:          "#e8ff00",
    color:       "#000000",
    border:      "1px solid #e8ff00",
    hoverBg:     "#ffffff",
    hoverColor:  "#000000",
    hoverBorder: "1px solid #ffffff",
  },
  outline: {
    bg:          "transparent",
    color:       "#888888",
    border:      "1px solid #2a2a2a",
    hoverBg:     "transparent",
    hoverColor:  "#ffffff",
    hoverBorder: "1px solid #e8ff00",
  },
  danger: {
    bg:          "transparent",
    color:       "#ff2d2d",
    border:      "1px solid #ff2d2d",
    hoverBg:     "#ff2d2d",
    hoverColor:  "#ffffff",
    hoverBorder: "1px solid #ff2d2d",
  },
  "danger-fill": {
    bg:          "#ff2d2d",
    color:       "#ffffff",
    border:      "1px solid #ff2d2d",
    hoverBg:     "#cc2020",
    hoverColor:  "#ffffff",
    hoverBorder: "1px solid #cc2020",
  },
  ghost: {
    bg:          "transparent",
    color:       "#555555",
    border:      "1px solid transparent",
    hoverBg:     "transparent",
    hoverColor:  "#ffffff",
    hoverBorder: "1px solid transparent",
  },
  dark: {
    bg:          "#0e0e0e",
    color:       "#666666",
    border:      "1px solid #1e1e1e",
    hoverBg:     "#141414",
    hoverColor:  "#ffffff",
    hoverBorder: "1px solid #2a2a2a",
  },
};

export const Button = ({
  children,
  className,
  variant    = "primary",
  size       = "md",
  loading    = false,
  disabled   = false,
  fullWidth  = false,
  onClick,
  type       = "button",
  ...props
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;

  const sizes = {
    sm: { padding: "8px 16px",  fontSize: "10px", letterSpacing: "0.35em" },
    md: { padding: "14px 24px", fontSize: "11px", letterSpacing: "0.35em" },
    lg: { padding: "18px 32px", fontSize: "13px", letterSpacing: "0.3em"  },
  };
  const sz = sizes[size] || sizes.md;

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      onMouseEnter={e => {
        if (isDisabled) return;
        e.currentTarget.style.backgroundColor = v.hoverBg;
        e.currentTarget.style.color           = v.hoverColor;
        e.currentTarget.style.border          = v.hoverBorder;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = v.bg;
        e.currentTarget.style.color           = v.color;
        e.currentTarget.style.border          = v.border;
      }}
      className={twMerge(
        "font-mono uppercase tracking-widest inline-flex items-center justify-center gap-3 relative overflow-hidden",
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-crosshair",
        className
      )}
      style={{
        backgroundColor: v.bg,
        color:           v.color,
        border:          v.border,
        padding:         sz.padding,
        fontSize:        sz.fontSize,
        letterSpacing:   sz.letterSpacing,
        lineHeight:      1,
        transition:      "background-color 0.05s linear, color 0.05s linear, border-color 0.05s linear",
      }}
      {...props}
    >
      {loading && (
        <motion.span
          className="w-3 h-3 border border-current shrink-0"
          style={{ borderTopColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {children}
    </motion.button>
  );
};
export default Button;
