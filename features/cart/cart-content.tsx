"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export function CartContent() {
  const { cart, updateQuantity, removeItem, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="h-24 skeleton rounded-lg" />
    ))}</div>;
  }

  if (cart.items.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-12 w-12 text-text-light" />
          <h2 className="mt-4 font-serif text-xl">Your cart is empty</h2>
          <p className="mt-2 text-sm text-text-muted">Discover our handcrafted collection</p>
          <Button asChild variant="accent" className="mt-6">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <FadeIn key={item.id}>
            <div className="flex gap-4 rounded-lg border border-border p-4">
              <Link href={`/products/${item.product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-secondary">
                <Image
                  src={item.product.images[0].src}
                  alt={item.product.images[0].alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.product.slug}`} className="font-serif text-sm hover:text-accent transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded border border-border hover:bg-secondary"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded border border-border hover:bg-secondary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-text-light hover:text-error transition-colors p-2"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Shipping</span>
              <span>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</span>
            </div>
            {cart.subtotal < siteConfig.freeShippingThreshold && cart.subtotal > 0 && (
              <p className="text-xs text-accent">
                Add {formatPrice(siteConfig.freeShippingThreshold - cart.subtotal)} more for free shipping
              </p>
            )}
            <div className="flex justify-between border-t border-border pt-3 font-medium text-base">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
          </div>
          <Button asChild variant="default" size="lg" className="w-full">
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={clearCart} className="w-full text-text-muted">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
