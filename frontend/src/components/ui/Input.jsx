import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

export const Input = ({
  label,
  className,
  error,
  hint,
  index,          // optional: "01", "02" etc for numbered fields
  type    = "text",
  variant = "underline", // "underline" | "box"
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasVal = !!props.value || !!props.defaultValue;

  const borderColor = error
    ? "#ff2d2d"
    : focused
    ? "#e8ff00"
    : hasVal
    ? "#333333"
    : "#1e1e1e";

  const labelColor = error
    ? "#ff2d2d"
    : focused
    ? "#e8ff00"
    : "#555555";

  return (
    <div className={twMerge("w-full flex flex-col gap-0", className)}>

      {/* Label row */}
      {(label || index) && (
        <div className="flex items-center gap-3 mb-2">
          {index && (
            <span className="font-mono text-xs shrink-0"
              style={{ color: focused ? "#e8ff00" : "#333333", transition: "color 0.05s" }}>
              {index}
            </span>
          )}
          {label && (
            <label className="font-mono text-xs tracking-[0.4em] uppercase block"
              style={{ color: labelColor, transition: "color 0.05s" }}>
              {label}
            </label>
          )}
        </div>
      )}

      {/* Input wrapper */}
      <div className="relative" style={{
        ...(variant === "underline"
          ? { borderBottom: `2px solid ${borderColor}` }
          : { border: `1px solid ${borderColor}` }),
        transition: "border-color 0.05s linear",
        backgroundColor: variant === "box" && focused ? "#0d0d0d" : "transparent",
      }}>
        <input
          type={type}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            caretColor:  "#e8ff00",
            padding:     variant === "underline" ? "10px 0" : "14px 16px",
          }}
          className="w-full bg-transparent font-mono text-sm tracking-wider text-white outline-none placeholder-[#2a2a2a]"
          {...props}
        />

        {/* Focused cursor blink indicator — right side */}
        {focused && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 w-[1px] h-5 bg-[#e8ff00]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.75 }}
          />
        )}

        {/* Check dot when filled and not focused */}
        {hasVal && !focused && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#e8ff00]" />
        )}
      </div>

      {/* Hint / error message */}
      <AnimatePresence>
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <p className="font-mono text-xs tracking-widest mt-2"
              style={{ color: error ? "#ff2d2d" : "#444444" }}>
              {error
                ? `ERROR — ${error.toUpperCase()}`
                : hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};