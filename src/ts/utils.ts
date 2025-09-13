import { Product } from "./products";

export function getUniqueColors(products: Product[]): string[] {
  const colors = products.map((p) => p.color);
  return Array.from(new Set(colors));
}

export function getUniqueSizes(products: Product[]): string[] {
  const sizes = products.flatMap((p) => p.size);
  return Array.from(new Set(sizes));
}

export function getPrices(products: Product[]): number[] {
  const prices = products.map((p) => p.price);
  return Array.from(new Set(prices)).sort((a, b) => a - b);
}
