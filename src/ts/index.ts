import { fetchProducts, initProducts, loadMore, Product } from "./products";
import { getUniqueColors, getUniqueSizes } from "./utils";
import {
  renderColors,
  renderPrices,
  renderSizes,
  sortSizes,
} from "../ts/components/filters";
import { initOrderBy } from "./components/orderby";
import { initMobileButtons } from "./components/mobileButtons";

async function main() {
  const products: Product[] = await fetchProducts();
  
  const colors = getUniqueColors(products);
  renderColors(colors);
  
  const sizes = getUniqueSizes(products);
  const orderedSizes = sortSizes(sizes);
  renderSizes(orderedSizes);
  
  renderPrices();
  
  await initProducts();
  initOrderBy();
  
  initMobileButtons(colors, orderedSizes);
  
  const loadBtn = document.getElementById("load-more");
  if (loadBtn) loadBtn.addEventListener("click", loadMore);
}

document.addEventListener("DOMContentLoaded", main);