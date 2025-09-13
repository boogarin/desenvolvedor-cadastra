import { createOrderDrawer } from "./mobileOrderDrawer";
import { createFilterDrawer } from "./mobileFilterDrawer";

export function initMobileButtons(colors?: string[], sizes?: string[]) {
  const toolbar = document.querySelector(".toolbar");
  if (!toolbar) return;

  const mobileButtons = document.createElement("div");
  mobileButtons.className = "mobile-buttons";

  const filterBtn = document.createElement("button");
  filterBtn.textContent = "Filtrar";
  filterBtn.className = "mobile-filter-btn";

  const orderBtn = document.createElement("button");
  orderBtn.textContent = "Ordenar";
  orderBtn.className = "mobile-orderby-btn";

  mobileButtons.appendChild(filterBtn);
  mobileButtons.appendChild(orderBtn);
  toolbar.appendChild(mobileButtons);

  const orderDrawer = createOrderDrawer();
  const filterDrawer = createFilterDrawer(colors, sizes);

  orderBtn.addEventListener("click", () => orderDrawer.classList.add("open"));
  filterBtn.addEventListener("click", () => filterDrawer.classList.add("open"));
}
