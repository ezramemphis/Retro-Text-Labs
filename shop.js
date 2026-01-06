const shopContainer = document.querySelector(".cd-grid");

function renderShop() {
  shopContainer.innerHTML = ""; // clear grid
  Object.values(CD_LIBRARY).forEach(cd => {
    const cdSlot = document.createElement("div");
    cdSlot.classList.add("cd-slot");
    cdSlot.innerHTML = `
      <div class="cd" style="--art:url('${cd.art}')"></div>
      <div class="hub-ring"></div>
      <button class="download-btn">Download</button>
      <p class="cd-title">${cd.title || cd.id}</p>
    `;

    // Download handler
    cdSlot.querySelector(".download-btn").addEventListener("click", () => {
      addCDToUser(cd.id);
      alert(`${cd.title || cd.id} added to your binder!`);
    });

    shopContainer.appendChild(cdSlot);
  });
}

renderShop();
