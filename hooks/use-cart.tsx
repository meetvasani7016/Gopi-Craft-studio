"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { Cart, CartItem, Product } from "@/types";
import { siteConfig } from "@/config/site";
import { generateId } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-media-query";

interface CartContextValue {
  cart: Cart;
  addItem: (product: Product, quantity?: number, options?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  isHydrated: boolean;
}

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
};

function calculateCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= siteConfig.freeShippingThreshold ? 0 : subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  return {
    items,
    subtotal,
    shipping,
    discount: 0,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems, isHydrated] = useLocalStorage<CartItem[]>("gcs-cart", []);

  const cart = useMemo(() => calculateCart(items), [items]);

  const addItem = useCallback(
    (product: Product, quantity = 1, options: Record<string, string> = {}) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            item.productId === product.id &&
            JSON.stringify(item.selectedOptions) === JSON.stringify(options)
        );

        if (existing) {
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        const newItem: CartItem = {
          id: generateId(),
          productId: product.id,
          product,
          quantity,
          selectedOptions: options,
          price: product.price.amount,
        };

        return [...prev, newItem];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    },
    [setItems, removeItem]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const value = useMemo(
    () => ({ cart, addItem, removeItem, updateQuantity, clearCart, isInCart, isHydrated }),
    [cart, addItem, removeItem, updateQuantity, clearCart, isInCart, isHydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
