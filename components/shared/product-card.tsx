"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

const badgeMap = {
  new: "new" as const,
  bestseller: "accent" as const,
  limited: "limited" as const,
  sale: "sale" as const,
};

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const primaryBadge = product.badges?.[0];

  const mainImage = product.images?.[0] || {
    src: "/images/placeholder-product-1.jpg",
    alt: product.name,
  };
  const categoryName = product.category?.name || "Uncategorized";

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="block" prefetch>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={priority}
          />
          {primaryBadge && (
            <Badge
              variant={badgeMap[primaryBadge]}
              className="absolute left-3 top-3"
            >
              {primaryBadge === "bestseller" ? "Best Seller" : primaryBadge}
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-sm font-medium text-white">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {categoryName}
          </p>
          <h3 className="font-serif text-base leading-snug text-text group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{formatPrice(product.price.amount)}</span>
            {product.price.compareAt && (
              <span className="text-sm text-text-light line-through">
                {formatPrice(product.price.compareAt)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleItem(product);
        }}
        className={cn(
          "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all",
          "hover:bg-white hover:scale-110",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        )}
        aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={inWishlist}
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", inWishlist ? "fill-accent text-accent" : "text-text")}
        />
      </button>
    </article>
  );
}
