import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  subtitle,
  align = "center",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        <h2 id={id} className="font-serif text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-lg text-sm text-text-muted md:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
