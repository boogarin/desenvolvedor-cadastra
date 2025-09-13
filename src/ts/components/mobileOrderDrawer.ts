import { setSortOption, sortProducts } from "../components/orderby";

export function createOrderDrawer() {
  const orderDrawer = document.createElement("div");
  orderDrawer.className = "drawer mobile-order-drawer";

  const orderHeader = document.createElement("div");
  orderHeader.className = "drawer-header";

  const orderHeaderContent = document.createElement("div");
  orderHeaderContent.className = "drawer-header-content";

  const title = document.createElement("h2");
  title.textContent = "ORDENAR";

  const closeIcon = document.createElement("img");
  closeIcon.src = "/img/close.png";
  closeIcon.alt = "Fechar";
  closeIcon.className = "close-btn";
  closeIcon.style.cursor = "pointer";

  orderHeaderContent.appendChild(title);
  orderHeaderContent.appendChild(closeIcon);
  orderHeader.appendChild(orderHeaderContent);
  orderDrawer.appendChild(orderHeader);

  let currentMobileSortOption = "";

  const btnContainer = document.createElement("div");
  btnContainer.className = "drawer-buttons";

  const options = [
    { label: "Mais recentes", value: "recent" },
    { label: "Menor preço", value: "lowest" },
    { label: "Maior preço", value: "highest" },
  ];

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt.label;
    btn.className = "drawer-option-btn";

    btn.addEventListener("click", () => {
      setSortOption(opt.value);
      orderDrawer.classList.remove("open");
    });

    btnContainer.appendChild(btn);
  });

  orderDrawer.appendChild(btnContainer);
  document.body.appendChild(orderDrawer);

  closeIcon.addEventListener("click", () =>
    orderDrawer.classList.remove("open")
  );

  return orderDrawer;
}
