import {
  getFilteredProducts,
  renderProducts,
  Product,
  PRODUCTS_PER_PAGE,
  updateLoadMoreButton,
  incrementDisplayedCount,
  resetDisplayedCount,
} from "../products";

let currentSortOption = "";

export function setSortOption(option: string) {
  currentSortOption = option;

  resetDisplayedCount();
  const filtered = getFilteredProducts();
  const sorted = sortProducts(option, filtered);

  const countToShow = Math.min(PRODUCTS_PER_PAGE, sorted.length);
  renderProducts(sorted.slice(0, countToShow), false);
  incrementDisplayedCount(countToShow, sorted.length);
  updateLoadMoreButton(sorted.length);
}

export function getCurrentSortOption() {
  return currentSortOption;
}

export function initOrderBy() {
  const sortSelect = document.getElementById(
    "sort-products",
  ) as HTMLSelectElement;
  if (!sortSelect) return;

  sortSelect.value = "";

  sortSelect.addEventListener("change", () => {
    currentSortOption = sortSelect.value;

    resetDisplayedCount();
    const filtered = getFilteredProducts();
    const sorted = sortProducts(currentSortOption, filtered);

    const countToShow = Math.min(PRODUCTS_PER_PAGE, sorted.length);
    renderProducts(sorted.slice(0, countToShow), false);

    incrementDisplayedCount(countToShow, sorted.length);
    updateLoadMoreButton(sorted.length);
  });
}

export function sortProducts(option: string, products: Product[]): Product[] {
  const sorted = [...products];

  switch (option) {
    case "recent":
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      break;
    case "lowest":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "highest":
      sorted.sort((a, b) => b.price - a.price);
      break;
  }

  return sorted;
}
