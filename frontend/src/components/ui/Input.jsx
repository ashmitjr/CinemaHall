import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const Input = ({ label, className, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="font-mono text-xs uppercase text-muted tracking-widest">{label}</label>}
      <input
        className={twMerge(
          "bg-transparent border-b border-border py-3 font-body text-lg focus:border-accent outline-none transition-colors placeholder:text-muted/30",
          error && "border-danger",
          className
        )}
        {...props}
      />
      {error && <span className="font-mono text-[10px] text-danger uppercase mt-1">{error}</span>}
    </div>
  );
};
