"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice, getWhatsAppUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useEffect } from "react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { products: recentlyViewed, addProduct } = useRecentlyViewed();

  // Track product view
  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product]);

  // Set default variant options selection
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    if (product.variantsDefinition) {
      product.variantsDefinition.forEach(def => {
        if (def.values.length > 0) {
          defaults[def.name] = def.values[0];
        }
      });
    }
    return defaults;
  });

  // Look up matched database variant
  const matchedVariant = product.variants?.find(v => 
    Object.entries(selectedOptions).every(([name, val]) => v.options[name] === val)
  );

  const currentPrice = matchedVariant?.price ?? product.price.amount;
  const currentStock = matchedVariant ? matchedVariant.stockCount : (product.stockCount ?? 0);
  const currentSku = matchedVariant?.sku ?? product.sku;
  const isOutOfStock = matchedVariant ? (currentStock <= 0) : !product.inStock;

  const getStockStatus = () => {
    if (isOutOfStock || currentStock <= 0) {
      return { label: "Out of Stock", color: "text-red-600 bg-red-50 border-red-200" };
    }
    const threshold = matchedVariant?.lowStockThreshold ?? product.lowStockThreshold ?? 5;
    if (currentStock <= threshold) {
      return { label: `Low Stock (${currentStock} left)`, color: "text-amber-600 bg-amber-50 border-amber-200" };
    }
    return { label: `In Stock (${currentStock} available)`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    addItem(product, quantity, selectedOptions);
  };

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ src: "/images/placeholder-product-1.jpg", alt: product.name }];

  const whatsappUrl = getWhatsAppUrl(
    siteConfig.whatsapp.number,
    `Hi, I'm interested in ${product.name} (SKU: ${currentSku})`,
    `${siteConfig.url}/products/${product.slug}`
  );

  return (
    <div className="space-y-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="space-y-4">
        <button
          onClick={() => setZoomOpen(true)}
          className="relative aspect-square overflow-hidden rounded-lg bg-secondary cursor-zoom-in"
          aria-label="Zoom product image"
        >
          <Image
            src={images[selectedImage]?.src || "/images/placeholder-product-1.jpg"}
            alt={images[selectedImage]?.alt || product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </button>
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  selectedImage === i ? "border-accent" : "border-transparent"
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Zoom Dialog */}
        {zoomOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setZoomOpen(false)}
            role="dialog"
            aria-label="Image zoom"
          >
            <div className="relative max-h-[90vh] max-w-[90vw] aspect-square">
              <Image
                src={images[selectedImage]?.src || "/images/placeholder-product-1.jpg"}
                alt={images[selectedImage]?.alt || product.name}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Buy Card */}
      <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">{product.category.name}</p>
          <h1 className="mt-2 font-serif text-2xl md:text-3xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1" aria-label={`${product.rating} out of 5 stars`}>
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-text-muted">({product.reviewCount} reviews)</span>
            </div>
            {product.badges?.map((badge) => (
              <Badge key={badge} variant={badge === "sale" ? "sale" : badge === "new" ? "new" : "accent"}>
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-medium">{formatPrice(currentPrice)}</span>
          {product.price.compareAt && (
            <span className="text-lg text-text-light line-through">
              {formatPrice(product.price.compareAt)}
            </span>
          )}
          <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ml-2", stockStatus.color)}>
            {stockStatus.label}
          </div>
        </div>

        <div className="text-xs text-text-muted">
          SKU: <span className="font-mono text-text">{currentSku}</span>
        </div>

        <p className="text-sm leading-relaxed text-text-muted">{product.shortDescription}</p>

        {/* Dynamic Database Variants */}
        {product.variantsDefinition && product.variantsDefinition.length > 0 && (
          <div className="space-y-4 border-t border-border pt-4">
            {product.variantsDefinition.map((def) => (
              <div key={def.name}>
                <label className="text-sm font-medium text-text">{def.name}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {def.values.map((val) => {
                    const isSelected = selectedOptions[def.name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [def.name]: val }))}
                        className={cn(
                          "rounded-md border px-4 py-2 text-sm transition-colors min-h-[44px]",
                          isSelected
                            ? "border-accent bg-accent/5 text-accent font-medium"
                            : "border-border hover:border-accent/50 text-text-muted"
                        )}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        {(!product.variantsDefinition || product.variantsDefinition.length === 0) && product.customizationOptions?.map((option) => (
          <div key={option.id}>
            <label className="text-sm font-medium">{option.name}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {option.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, [option.id]: variant.value }))
                  }
                  className={cn(
                    "rounded-md border px-4 py-2 text-sm transition-colors min-h-[44px]",
                    selectedOptions[option.id] === variant.value
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-border hover:border-accent/50"
                  )}
                  disabled={!variant.inStock}
                >
                  {variant.name}
                  {variant.priceModifier ? ` (+${formatPrice(variant.priceModifier)})` : ""}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border hover:bg-secondary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium" aria-live="polite">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border hover:bg-secondary"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            variant="default"
            size="lg"
            className="flex-1"
            disabled={isOutOfStock}
          >
            {!isOutOfStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-13 w-13"
            onClick={() => toggleItem(product)}
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist(product.id)}
          >
            <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-accent text-accent")} />
          </Button>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="lg" className="w-full mt-3">
            Order via WhatsApp
          </Button>
        </a>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
          <div className="text-center">
            <Truck className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-2 text-xs text-text-muted">Free shipping above ₹2,999</p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-2 text-xs text-text-muted">Authentic handcrafted</p>
          </div>
          <div className="text-center">
            <RotateCcw className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-2 text-xs text-text-muted">7-day returns</p>
          </div>
        </div>

        {/* Specs & FAQs */}
        <Accordion type="single" collapsible>
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs">
            <AccordionTrigger>Specifications</AccordionTrigger>
            <AccordionContent>
              <dl className="space-y-2">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between text-sm">
                    <dt className="text-text-muted">{spec.label}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">Estimated delivery: {product.shipping.estimatedDays}</p>
              <p className="text-sm mt-2">Free shipping on orders above ₹{product.shipping.freeAbove}</p>
            </AccordionContent>
          </AccordionItem>
          {product.faqs.length > 0 && (
            <AccordionItem value="faqs">
              <AccordionTrigger>FAQs</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {product.faqs.map((faq) => (
                    <div key={faq.id}>
                      <p className="text-sm font-medium">{faq.question}</p>
                      <p className="text-sm text-text-muted mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed && recentlyViewed.filter(p => p.id !== product.id).length > 0 && (
        <section className="border-t border-border pt-16 mt-16 w-full col-span-2">
          <h2 className="font-serif text-2xl mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {recentlyViewed
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}
