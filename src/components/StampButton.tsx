"use client";

import { forwardRef } from "react";

type StampButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

/**
 * The chunky stamped CTA — butcher-red with a 2px hard shadow that depresses
 * on press. `outline` is the secondary ink-bordered variant.
 */
export const StampButton = forwardRef<HTMLButtonElement, StampButtonProps>(
  function StampButton(
    { variant = "primary", className = "", children, ...rest },
    ref
  ) {
    if (variant === "outline") {
      return (
        <button
          ref={ref}
          className={`font-mono ${className}`}
          style={{
            fontSize: 12,
            letterSpacing: "1px",
            color: "#2B1D10",
            background: "transparent",
            border: "1.5px solid #2B1D10",
            borderRadius: 3,
            padding: "11px 18px",
            cursor: "pointer",
          }}
          {...rest}
        >
          {children}
        </button>
      );
    }
    return (
      <button
        ref={ref}
        className={`btn-stamp ${className}`}
        style={{ fontSize: 13, padding: 14 }}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
