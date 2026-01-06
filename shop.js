const shopContainer = document.querySelector(".cd-grid");

function renderShop() {
  shopContainer.innerHTML = ""; // clear grid

  Object.values(CD_LIBRARY).forEach(cd => {
    const cdSlot = document.createElement("div");
    cdSlot.classList.add("cd-slot");

    // Insert CD with title and download button
    cdSlot.innerHTML = `
      <div class="cd" style="--art:url('${cd.art}')"></div>
      <button class="download-btn">Download</button>
      <p class="cd-title">${cd.title}</p>
    `;

    // Download handler
    cdSlot.querySelector(".download-btn").addEventListener("click", () => {
      addCDToUser(cd.id);
      alert(`${cd.title} added to your binder!`);
    });

    shopContainer.appendChild(cdSlot);
  });
}

// Render the shop on page load
renderShop();
