import { Cart, CartItem, Product } from "@shared/types";

const CART_STORAGE_KEY = "indianbaazaar-cart";

export const getCart = (): Cart => {
  if (typeof window === "undefined") return { items: [], total: 0 };

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
};

export const saveCart = (cart: Cart): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const addToCart = (
  productId: string,
  quantity: number = 1,
  selectedSize?: string,
  selectedColor?: string,
): Cart => {
  const cart = getCart();
  const existingItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, selectedSize, selectedColor });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (
  productId: string,
  selectedSize?: string,
  selectedColor?: string,
): Cart => {
  const cart = getCart();
  cart.items = cart.items.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      ),
  );
  saveCart(cart);
  return cart;
};

export const updateQuantity = (
  productId: string,
  quantity: number,
  selectedSize?: string,
  selectedColor?: string,
): Cart => {
  const cart = getCart();
  const item = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor,
  );

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId, selectedSize, selectedColor);
    }
    item.quantity = quantity;
  }

  saveCart(cart);
  return cart;
};

export const calculateTotal = (cart: Cart, products: Product[]): number => {
  return cart.items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (
      !product ||
      !product.our_price ||
      isNaN(product.our_price) ||
      !item.quantity ||
      isNaN(item.quantity)
    ) {
      return total;
    }
    const itemTotal = product.our_price * item.quantity;
    return total + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);
};

export const getCartItemCount = (cart: Cart): number => {
  return cart.items.reduce((count, item) => count + (item.quantity || 0), 0);
};

export const clearCart = (): Cart => {
  const emptyCart = { items: [], total: 0 };
  saveCart(emptyCart);
  return emptyCart;
};
