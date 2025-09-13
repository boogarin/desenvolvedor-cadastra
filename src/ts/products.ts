import { addToCart } from "./components/cart";
import { getCurrentSortOption, sortProducts } from "./components/orderby";

export interface Product {
  id: string;
  name: string;
  price: number;
  parcelamento: [number, number];
  color: string;
  image: string;
  size: string[];
  date: string;
}

export interface PriceRange {
  label: string;
  min: number;
  max?: number;
}

export interface ProductFilters {
  colors: Set<string>;
  sizes: Set<string>;
  prices: PriceRange[];
}

export const activeFilters: ProductFilters = {
  colors: new Set(),
  sizes: new Set(),
  prices: [],
};

let allProducts: Product[] = [];
export let displayedCount = 0;
export const PRODUCTS_PER_PAGE = 9;

export function resetDisplayedCount() {
  displayedCount = 0;
}

export function incrementDisplayedCount(count: number, total: number) {
  displayedCount = Math.min(displayedCount + count, total);
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:5000/products");
  return res.json();
}

export function renderProducts(products: Product[], append = false) {
  const container = document.querySelector<HTMLDivElement>(
    ".products-container"
  );
  if (!container) return;

  if (!append) container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;

    const name = document.createElement("h2");
    name.textContent = product.name;
    name.className = "product-name";

    const price = document.createElement("p");
    price.textContent = `R$${product.price.toFixed(2)}`;
    price.className = "product-price";

    const [times, value] = product.parcelamento;
    const installments = document.createElement("p");
    installments.textContent = `até ${times}x de R$${value.toFixed(2)}`;
    installments.className = "product-installments";

    const button = document.createElement("button");
    button.textContent = "COMPRAR";
    button.className = "buy-btn";
    button.addEventListener("click", () => addToCart(product));

    card.append(img, name, price, installments, button);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

export function getFilteredProducts(): Product[] {
  return allProducts
    .filter(
      (p) =>
        activeFilters.colors.size === 0 || activeFilters.colors.has(p.color)
    )
    .filter(
      (p) =>
        activeFilters.sizes.size === 0 ||
        p.size.some((s) => activeFilters.sizes.has(s))
    )
    .filter((p) =>
      activeFilters.prices.length === 0
        ? true
        : activeFilters.prices.some(
            (range) =>
              p.price >= range.min &&
              (range.max === undefined || p.price <= range.max)
          )
    );
}

export function applyFilters() {
  resetDisplayedCount();
  const filtered = getFilteredProducts();
  renderProducts(getProductsToDisplay(filtered, PRODUCTS_PER_PAGE), false);
  updateLoadMoreButton(filtered.length);
}

function getProductsToDisplay(products: Product[], count: number) {
  const sortOption = getCurrentSortOption();
  const sorted = sortOption ? sortProducts(sortOption, products) : products;
  const nextProducts = sorted.slice(displayedCount, displayedCount + count);
  incrementDisplayedCount(nextProducts.length, sorted.length);
  return nextProducts;
}

export function loadMore() {
  const filtered = getFilteredProducts();
  const nextProducts = getProductsToDisplay(filtered, PRODUCTS_PER_PAGE);
  renderProducts(nextProducts, true);
  updateLoadMoreButton(filtered.length);
}

export function updateLoadMoreButton(totalFiltered: number) {
  const loadBtn = document.getElementById("load-more");
  if (!loadBtn) return;

  loadBtn.style.display =
    totalFiltered > PRODUCTS_PER_PAGE && displayedCount < totalFiltered
      ? "block"
      : "none";
}

export async function initProducts() {
  allProducts = await fetchProducts();
  resetDisplayedCount();
  loadMore();
}
