"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { searchAll } from "@/lib/shop";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-media-query";

export function SearchContent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const results = debouncedQuery.length >= 2 ? searchAll(debouncedQuery) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="pt-20 section-padding">
      <div className="container-site max-w-2xl">
        <h1 className="font-serif text-3xl text-center">Search</h1>

        <form onSubmit={handleSubmit} className="mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
          <Input
            type="search"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-13 text-base"
            aria-label="Search"
            autoFocus
          />
        </form>

        {results && (
          <div className="mt-10" role="region" aria-label="Search results">
            {results.products.length === 0 ? (
              <p className="text-center text-text-muted py-8">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : (
              <>
                <p className="text-sm text-text-muted mb-6">
                  {results.products.length} results for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                  {results.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
