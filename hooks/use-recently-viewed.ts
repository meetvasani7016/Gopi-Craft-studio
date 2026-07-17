"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";

const LOCAL_STORAGE_KEY = "gcs-recently-viewed";
const MAX_ITEMS = 4;

export function useRecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse recently viewed items:", err);
      }
    }
  }, []);

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      // Filter out existing occurrence of this product to move it to the front
      const filtered = prev.filter((p) => p.id !== product.id);
      
      // We only store essential properties to avoid local storage bloat
      const slimProduct: Product = {
        ...product,
        description: "",
        images: product.images.slice(0, 1),
        specs: [],
        faqs: [],
        relatedProductIds: []
      } as Product;

      const updated = [slimProduct, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { products, addProduct };
}
