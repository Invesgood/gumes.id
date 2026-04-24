export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  material: string;
  priceNum: number;
  price: string;
  image: string;
  size: number;
  color?: string;
  qty: number;
}

const KEY = "gumes_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "cartId" | "qty">, qty = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find(
    (c) => c.productId === item.productId && c.size === item.size && c.color === item.color
  );
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...item, cartId: `${item.productId}-${item.size}-${item.color || ""}-${Date.now()}`, qty });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(cartId: string): CartItem[] {
  const cart = getCart().filter((c) => c.cartId !== cartId);
  saveCart(cart);
  return cart;
}

export function updateQty(cartId: string, qty: number): CartItem[] {
  const cart = getCart().map((c) => (c.cartId === cartId ? { ...c, qty } : c));
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  saveCart([]);
}

export function formatIDR(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
