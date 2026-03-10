import React from "react";
import { twMerge } from "tailwind-merge";

const VARIANTS = {
  outline: {
    border:  "1px solid #2a2a2a",
    color:   "#555555",
    bg:      "transparent",
  },
  accent: {
    border:  "1px solid #e8ff00",
    color:   "var(--color-accent)",
    bg:      "transparent",
  },
  "accent-fill": {
    border:  "1px solid #e8ff00",
    color:   "#000000",
    bg:      "var(--color-accent)",
  },
  danger: {
    border:  "1px solid #ff2d2d",
    color:   "#ff2d2d",
    bg:      "transparent",
  },
  "danger-fill": {
    border:  "1px solid #ff2d2d",
    color:   "#ffffff",
    bg:      "#ff2d2d",
  },
  success: {
    border:  "1px solid #00ff88",
    color:   "#00ff88",
    bg:      "transparent",
  },
  muted: {
    border:  "1px solid #1e1e1e",
    color:   "#444444",
    bg:      "transparent",
  },
  dark: {
    border:  "1px solid #1a1a1a",
    color:   "#333333",
    bg:      "#0e0e0e",
  },
};

export const Badge = ({
  children,
  className,
  variant = "outline",
  dot = false,
  pulse = false,
  size = "sm",
}) => {
  const v = VARIANTS[variant] || VARIANTS.outline;

  const sizes = {
    xs: { fontSize: "9px",  padding: "2px 6px",  letterSpacing: "0.35em" },
    sm: { fontSize: "10px", padding: "3px 8px",  letterSpacing: "0.4em"  },
    md: { fontSize: "11px", padding: "4px 10px", letterSpacing: "0.35em" },
  };

  const sz = sizes[size] || sizes.sm;

  return (
    <span
      className={twMerge("inline-flex items-center gap-2 font-mono uppercase", className)}
      style={{
        border:          v.border,
        color:           v.color,
        backgroundColor: v.bg,
        fontSize:        sz.fontSize,
        padding:         sz.padding,
        letterSpacing:   sz.letterSpacing,
        lineHeight:      1,
      }}
    >
      {dot && (
        <span
          className="shrink-0 rounded-full"
          style={{
            width:           "5px",
            height:          "5px",
            backgroundColor: v.color,
            animation:       pulse ? "pulse 1.4s ease-in-out infinite" : "none",
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;