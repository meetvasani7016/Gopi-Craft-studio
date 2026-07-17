import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "sale" | "new" | "limited";
}

const variantStyles = {
  default: "bg-secondary text-text",
  accent: "bg-accent/10 text-accent-dark",
  outline: "border border-border text-text-muted",
  sale: "bg-error/10 text-error",
  new: "bg-success/10 text-success",
  limited: "bg-accent text-white",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tracking-wide uppercase",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
