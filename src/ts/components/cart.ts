import { Product } from "../products";

export interface CartItem extends Product {
  quantity: number;
}

let cart: CartItem[] = [];

export function getCart(): CartItem[] {
  return cart;
}

function saveCart(updatedCart: CartItem[]) {
  cart = updatedCart;
}

export function addToCart(product: Product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartCounter();
}

export function removeFromCart(productId: string) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartCounter();
}

export function updateCartCounter() {
  const counter = document.getElementById("cart-counter");
  if (!counter) return;

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  counter.textContent = totalQuantity.toString();
}
