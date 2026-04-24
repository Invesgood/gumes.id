"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  CartItem,
  getCart,
  addToCart as libAdd,
  removeFromCart as libRemove,
  updateQty as libUpdateQty,
  clearCart as libClear,
} from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "cartId" | "qty">, qty?: number) => void;
  removeItem: (cartId: string) => void;
  updateQty: (cartId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "cartId" | "qty">, qty = 1) => {
    setItems(libAdd(item, qty));
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems(libRemove(cartId));
  }, []);

  const updateQty = useCallback((cartId: string, qty: number) => {
    if (qty < 1) return;
    setItems(libUpdateQty(cartId, qty));
  }, []);

  const clearCart = useCallback(() => {
    libClear();
    setItems([]);
  }, []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.priceNum * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, subtotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
