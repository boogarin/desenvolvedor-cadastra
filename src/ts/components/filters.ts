import { PriceRange, activeFilters, applyFilters } from "../products";

const sizeOrder = ["P", "M", "G", "GG", "U", "36", "38", "40", "44"];
const priceRanges: PriceRange[] = [
  { label: "de R$0 até R$50", min: 0, max: 50 },
  { label: "de R$51 até R$150", min: 51, max: 150 },
  { label: "de R$151 até R$300", min: 151, max: 300 },
  { label: "de R$301 até R$500", min: 301, max: 500 },
  { label: "a partir de R$500", min: 501 },
];

export function renderColors(colors: string[]) {
  const container = document.querySelector<HTMLDivElement>(".colors-list");
  const toggleBtn = document.querySelector<HTMLButtonElement>(
    ".toggle-show-colors",
  );
  if (!container || !toggleBtn) return;

  const maxVisible = 5;

  function render(showAll: boolean) {
    container.innerHTML = "";
    const visibleColors = showAll ? colors : colors.slice(0, maxVisible);

    visibleColors.forEach((color) => {
      const label = document.createElement("label");
      label.className = "form-control";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = color;
      input.addEventListener("change", () => {
        input.checked
          ? activeFilters.colors.add(color)
          : activeFilters.colors.delete(color);
        applyFilters();
      });

      const span = document.createElement("span");
      span.className = "label-checkbox";
      span.textContent = color;

      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });

    toggleBtn.textContent = showAll ? "Ver menos cores" : "Ver todas as cores";
  }

  let expanded = false;
  render(expanded);

  toggleBtn.addEventListener("click", () => {
    expanded = !expanded;
    render(expanded);
  });
}

export function renderSizes(sizes: string[]) {
  const container = document.querySelector<HTMLDivElement>(".size-filter");
  if (!container) return;
  container.innerHTML = "";

  sizes.forEach((size) => {
    const button = document.createElement("button");
    button.className = "size-field";
    button.textContent = size;

    button.addEventListener("click", () => {
      if (activeFilters.sizes.has(size)) {
        activeFilters.sizes.delete(size);
        button.classList.remove("selected");
      } else {
        activeFilters.sizes.add(size);
        button.classList.add("selected");
      }
      applyFilters();
    });

    container.appendChild(button);
  });
}

export function sortSizes(sizes: string[]): string[] {
  return sizes.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
}

export function renderPrices() {
  const container = document.querySelector<HTMLDivElement>(".price-filter");
  if (!container) return;
  container.innerHTML = "";

  priceRanges.forEach((range) => {
    const label = document.createElement("label");
    label.className = "form-control";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = `${range.min}-${range.max ?? "max"}`;

    input.addEventListener("change", () => {
      if (input.checked) activeFilters.prices.push(range);
      else
        activeFilters.prices = activeFilters.prices.filter((r) => r !== range);
      applyFilters();
    });

    const span = document.createElement("span");
    span.textContent = range.label;

    label.appendChild(input);
    label.appendChild(span);
    container.appendChild(label);
  });
}
