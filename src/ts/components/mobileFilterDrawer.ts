import { PriceRange, activeFilters, applyFilters } from "../products";

const priceRanges: PriceRange[] = [
  { label: "de R$0 até R$50", min: 0, max: 50 },
  { label: "de R$51 até R$150", min: 51, max: 150 },
  { label: "de R$151 até R$300", min: 151, max: 300 },
  { label: "de R$301 até R$500", min: 301, max: 500 },
  { label: "a partir de R$500", min: 501 },
];

interface FilterDropdownConfig {
  title: string;
  className: string;
  renderContent: (container: HTMLDivElement) => void;
}

function createDropdown(config: FilterDropdownConfig): HTMLDivElement {
  const dropdown = document.createElement("div");
  dropdown.className = `filter-dropdown ${config.className}`;

  const header = document.createElement("div");
  header.className = "dropdown-header";

  const title = document.createElement("h3");
  title.className = "dropdown-title";
  title.textContent = config.title;

  const arrow = document.createElement("span");
  arrow.className = "dropdown-arrow";
  arrow.textContent = "▼";

  header.appendChild(title);
  header.appendChild(arrow);

  const content = document.createElement("div");
  content.className = "dropdown-content";

  config.renderContent(content);

  dropdown.appendChild(header);
  dropdown.appendChild(content);

  header.addEventListener("click", () => {
    const isOpen = dropdown.classList.contains("open");

    document.querySelectorAll(".filter-dropdown").forEach((d) => {
      if (d !== dropdown) {
        d.classList.remove("open");
      }
    });

    dropdown.classList.toggle("open");
  });

  return dropdown;
}

function renderColorsDropdown(container: HTMLDivElement, colors: string[]) {
  const colorsList = document.createElement("div");
  colorsList.className = "colors-list";

  colors.forEach((color) => {
    const label = document.createElement("label");
    label.className = "form-control";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = color;
    input.checked = activeFilters.colors.has(color);

    input.addEventListener("change", () => {
      if (input.checked) {
        activeFilters.colors.add(color);
      } else {
        activeFilters.colors.delete(color);
      }
      applyFilters();
    });

    const span = document.createElement("span");
    span.className = "label-checkbox";
    span.textContent = color;

    label.appendChild(input);
    label.appendChild(span);
    colorsList.appendChild(label);
  });

  container.appendChild(colorsList);
}

function renderSizesDropdown(container: HTMLDivElement, sizes: string[]) {
  const sizeFilter = document.createElement("div");
  sizeFilter.className = "size-filter";

  sizes.forEach((size) => {
    const button = document.createElement("button");
    button.className = "size-field";
    button.textContent = size;

    if (activeFilters.sizes.has(size)) {
      button.classList.add("selected");
    }

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

    sizeFilter.appendChild(button);
  });

  container.appendChild(sizeFilter);
}

function renderPricesDropdown(container: HTMLDivElement) {
  const priceList = document.createElement("div");
  priceList.className = "price-filter";

  priceRanges.forEach((range) => {
    const label = document.createElement("label");
    label.className = "form-control";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = `${range.min}-${range.max ?? "max"}`;
    input.checked = activeFilters.prices.some((r) => r === range);

    input.addEventListener("change", () => {
      if (input.checked) {
        activeFilters.prices.push(range);
      } else {
        activeFilters.prices = activeFilters.prices.filter((r) => r !== range);
      }
      applyFilters();
    });

    const span = document.createElement("span");
    span.className = "label-checkbox";
    span.textContent = range.label;

    label.appendChild(input);
    label.appendChild(span);
    priceList.appendChild(label);
  });

  container.appendChild(priceList);
}

export function createFilterDrawer(colors?: string[], sizes?: string[]) {
  const filterDrawer = document.createElement("div");
  filterDrawer.className = "drawer mobile-filter-drawer";

  const filterHeader = document.createElement("div");
  filterHeader.className = "drawer-header";

  const filterHeaderContent = document.createElement("div");
  filterHeaderContent.className = "drawer-header-content";

  const title = document.createElement("h2");
  title.textContent = "FILTRAR";

  const closeIcon = document.createElement("img");
  closeIcon.src = "/img/close.png";
  closeIcon.alt = "Fechar";
  closeIcon.className = "close-btn";
  closeIcon.style.cursor = "pointer";

  filterHeaderContent.appendChild(title);
  filterHeaderContent.appendChild(closeIcon);
  filterHeader.appendChild(filterHeaderContent);
  filterDrawer.appendChild(filterHeader);

  const filterContent = document.createElement("div");
  filterContent.className = "filter-content";

  if (colors && colors.length > 0) {
    const colorsDropdown = createDropdown({
      title: "CORES",
      className: "colors-dropdown filter-group",
      renderContent: (container) => renderColorsDropdown(container, colors),
    });
    filterContent.appendChild(colorsDropdown);
  }

  if (sizes && sizes.length > 0) {
    const sizesDropdown = createDropdown({
      title: "TAMANHOS",
      className: "sizes-dropdown filter-group",
      renderContent: (container) => renderSizesDropdown(container, sizes),
    });
    filterContent.appendChild(sizesDropdown);
  }

  const pricesDropdown = createDropdown({
    title: "FAIXA DE PREÇOS",
    className: "prices-dropdown filter-group",
    renderContent: renderPricesDropdown,
  });
  filterContent.appendChild(pricesDropdown);

  const actions = document.createElement("div");
  actions.className = "filter-actions";

  const applyBtn = document.createElement("button");
  applyBtn.className = "btn apply-btn";
  applyBtn.textContent = "Aplicar";
  applyBtn.addEventListener("click", () => {
    applyFilters();
    filterDrawer.classList.remove("open");
  });

  const clearBtn = document.createElement("button");
  clearBtn.className = "btn clear-btn";
  clearBtn.textContent = "Limpar";
  clearBtn.addEventListener("click", () => {
    activeFilters.colors.clear();
    activeFilters.sizes.clear();
    activeFilters.prices = [];
    applyFilters();

    filterContent.querySelectorAll("input[type=checkbox]").forEach((input) => {
      (input as HTMLInputElement).checked = false;
    });
    filterContent.querySelectorAll(".size-field.selected").forEach((btn) => {
      btn.classList.remove("selected");
    });
  });

  actions.appendChild(applyBtn);
  actions.appendChild(clearBtn);
  filterContent.appendChild(actions);

  filterDrawer.appendChild(filterContent);

  document.body.appendChild(filterDrawer);

  closeIcon.addEventListener("click", () => {
    filterDrawer.classList.remove("open");
    filterContent.querySelectorAll(".filter-dropdown").forEach((d) => {
      d.classList.remove("open");
    });
  });

  return filterDrawer;
}
