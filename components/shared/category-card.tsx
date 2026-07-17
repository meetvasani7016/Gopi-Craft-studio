import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
  size?: "default" | "large";
}

export function CategoryCard({ category, className, size = "default" }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn("group relative block overflow-hidden rounded-lg", className)}
      prefetch
    >
      <div
        className={cn(
          "relative overflow-hidden bg-secondary",
          size === "large" ? "aspect-[4/5]" : "aspect-[3/4]"
        )}
      >
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h3 className="font-serif text-lg text-white md:text-xl">{category.name}</h3>
        <p className="mt-1 text-xs text-white/80 md:text-sm">
          {category.productCount} products
        </p>
      </div>
    </Link>
  );
}
