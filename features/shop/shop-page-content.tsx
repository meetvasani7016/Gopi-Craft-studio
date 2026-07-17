"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ShopFilters, Product } from "@/types";
import { filterProducts, sortProducts } from "@/lib/shop";
import { fetchProducts } from "@/lib/supabase/actions";
import { ShopFiltersPanel } from "./shop-filters";
import { ProductCard } from "@/components/shared/product-card";
import { FadeIn } from "@/components/motion/fade-in";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

export function ShopPageContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((res) => {
      setAllProducts(res);
      setLoading(false);
    });
  }, []);

  const filters: ShopFilters = useMemo(() => ({
    categories: searchParams.get("categories")?.split(",").filter(Boolean),
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    materials: searchParams.get("materials")?.split(",").filter(Boolean),
    occasions: searchParams.get("occasions")?.split(",").filter(Boolean),
    inStock: searchParams.get("inStock") === "true",
    customizable: searchParams.get("customizable") === "true",
    sort: searchParams.get("sort") || "featured",
    search: searchParams.get("q") || undefined,
    collection: searchParams.get("collection") || undefined,
  }), [searchParams]);

  const products = useMemo(() => {
    const filtered = filterProducts(allProducts, filters);
    return sortProducts(filtered, filters.sort);
  }, [allProducts, filters]);

  if (loading) {
    return (
      <div className="mt-10 flex gap-8">
        <ShopFiltersPanel />
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 flex gap-8">
      <ShopFiltersPanel />
      <div className="flex-1">
        <p className="text-sm text-text-muted mb-6" aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-lg">No products found</p>
            <p className="mt-2 text-sm text-text-muted">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <ProductCard product={product} priority={i < 4} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
