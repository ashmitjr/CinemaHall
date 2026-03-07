import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Button = ({ children, className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-accent text-black hover:bg-white",
    outline: "border border-border text-white hover:border-accent",
    danger: "bg-danger text-white hover:bg-white hover:text-black",
  };

  return (
    <button
      className={twMerge(
        "px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
