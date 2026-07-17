"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { Product, WishlistItem } from "@/types";
import { generateId } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-media-query";

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems, isHydrated] = useLocalStorage<WishlistItem[]>("gcs-wishlist", []);

  const addItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        if (prev.some((item) => item.productId === product.id)) return prev;
        return [
          ...prev,
          { id: generateId(), productId: product.id, product, addedAt: new Date().toISOString() },
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    },
    [setItems]
  );

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const toggleItem = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    },
    [isInWishlist, removeItem, addItem]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, isInWishlist, toggleItem, isHydrated }),
    [items, addItem, removeItem, isInWishlist, toggleItem, isHydrated]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
