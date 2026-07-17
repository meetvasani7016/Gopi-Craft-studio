"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-text text-primary hover:bg-text/90 active:scale-[0.98]",
        accent: "bg-accent text-white hover:bg-accent-dark active:scale-[0.98]",
        outline: "border border-border bg-transparent hover:bg-secondary active:scale-[0.98]",
        ghost: "hover:bg-secondary active:scale-[0.98]",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto",
        destructive: "bg-error text-white hover:bg-error/90 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-md",
        sm: "h-9 px-4 text-xs rounded-md",
        lg: "h-13 px-8 text-base rounded-md",
        xl: "h-14 px-10 text-base rounded-md",
        icon: "h-11 w-11 rounded-md",
        "icon-sm": "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
