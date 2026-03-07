import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Badge = ({ children, className, variant = "outline" }) => {
  const variants = {
    outline: "border border-border text-muted",
    accent: "border border-accent text-accent",
    danger: "border border-danger text-danger",
  };

  return (
    <span
      className={twMerge(
        "px-2 py-1 font-mono text-[10px] uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
