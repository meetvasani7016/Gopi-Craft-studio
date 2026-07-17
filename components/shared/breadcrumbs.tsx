import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Breadcrumb } from "@/types";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("py-4", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-text-muted">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-text"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-text-light" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-text">
                {item.label}
              </Link>
            ) : (
              <span className="text-text" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
