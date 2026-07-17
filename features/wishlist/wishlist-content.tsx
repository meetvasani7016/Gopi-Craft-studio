"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export function WishlistContent() {
  const { items, removeItem, isHydrated } = useWishlist();
  const { addItem } = useCart();

  if (!isHydrated) {
    return <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="aspect-[3/4] skeleton rounded-lg" />
    ))}</div>;
  }

  if (items.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-16">
          <Heart className="mx-auto h-12 w-12 text-text-light" />
          <h2 className="mt-4 font-serif text-xl">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-text-muted">Save items you love for later</p>
          <Button asChild variant="accent" className="mt-6">
            <Link href="/shop">Explore Collection</Link>
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {items.map((item) => (
        <FadeIn key={item.id}>
          <div className="group relative">
            <Link href={`/products/${item.product.slug}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={item.product.images[0].src}
                  alt={item.product.images[0].alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-3 font-serif text-sm">{item.product.name}</h3>
              <p className="text-sm font-medium">{formatPrice(item.product.price.amount)}</p>
            </Link>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={() => addItem(item.product)}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add to Cart
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => removeItem(item.productId)}
                aria-label={`Remove ${item.product.name} from wishlist`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
