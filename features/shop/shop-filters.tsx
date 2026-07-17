"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { ShopFilters, Category } from "@/types";
import { fetchCategories } from "@/lib/supabase/actions";
import { filterConfig, sortOptions } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ShopFiltersProps {
  onFilterChange?: (filters: ShopFilters) => void;
  className?: string;
}

export function ShopFiltersPanel({ onFilterChange, className }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategoriesList);
  }, []);

  const currentFilters: ShopFilters = useMemo(() => ({
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

  const updateFilters = useCallback(
    (updates: Partial<ShopFilters>) => {
      const newFilters = { ...currentFilters, ...updates };
      const params = new URLSearchParams();

      if (newFilters.categories?.length) params.set("categories", newFilters.categories.join(","));
      if (newFilters.priceMin) params.set("priceMin", String(newFilters.priceMin));
      if (newFilters.priceMax) params.set("priceMax", String(newFilters.priceMax));
      if (newFilters.materials?.length) params.set("materials", newFilters.materials.join(","));
      if (newFilters.occasions?.length) params.set("occasions", newFilters.occasions.join(","));
      if (newFilters.inStock) params.set("inStock", "true");
      if (newFilters.customizable) params.set("customizable", "true");
      if (newFilters.sort && newFilters.sort !== "featured") params.set("sort", newFilters.sort);
      if (newFilters.search) params.set("q", newFilters.search);
      if (newFilters.collection) params.set("collection", newFilters.collection);

      router.push(`/shop?${params.toString()}`, { scroll: false });
      onFilterChange?.(newFilters);
    },
    [currentFilters, router, onFilterChange]
  );

  const toggleArrayFilter = (
    key: "categories" | "materials" | "occasions",
    value: string
  ) => {
    const current = currentFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({ [key]: updated.length ? updated : undefined });
  };

  const clearFilters = () => {
    router.push("/shop", { scroll: false });
    onFilterChange?.({});
  };

  const activeFilterCount = [
    currentFilters.categories?.length,
    currentFilters.materials?.length,
    currentFilters.occasions?.length,
    currentFilters.priceMin || currentFilters.priceMax,
    currentFilters.inStock,
    currentFilters.customizable,
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Sort By</h3>
        <select
          value={currentFilters.sort || "featured"}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full h-11 rounded-md border border-border bg-primary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Sort products"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Category</h3>
        <div className="space-y-2">
          {categoriesList.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentFilters.categories?.includes(cat.slug) || false}
                onChange={() => toggleArrayFilter("categories", cat.slug)}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                {cat.name} ({cat.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Price Range</h3>
        <div className="space-y-2">
          {filterConfig.priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={
                  currentFilters.priceMin === range.min &&
                  (range.max === null
                    ? !currentFilters.priceMax
                    : currentFilters.priceMax === range.max)
                }
                onChange={() =>
                  updateFilters({
                    priceMin: range.min,
                    priceMax: range.max ?? undefined,
                  })
                }
                className="h-4 w-4 border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Material</h3>
        <div className="space-y-2">
          {filterConfig.materials.map((mat) => (
            <label key={mat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentFilters.materials?.includes(mat) || false}
                onChange={() => toggleArrayFilter("materials", mat)}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                {mat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.inStock || false}
            onChange={(e) => updateFilters({ inStock: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={currentFilters.customizable || false}
            onChange={(e) => updateFilters({ customizable: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          <span className="text-sm">Customizable</span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium lg:hidden"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-primary p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg">Filters</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:block w-64 shrink-0", className)}>
        <h2 className="font-serif text-lg mb-6">Filters</h2>
        {filterContent}
      </aside>
    </>
  );
}
