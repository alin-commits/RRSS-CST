(function () {
  const posts = window.CST_POSTS || [];

  let modalPost = null;
  let modalIndex = 0;

  const grid = document.getElementById("grid");

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalImg = document.getElementById("modalImg");
  const modalDots = document.getElementById("modalDots");
  const modalTitle = document.getElementById("modalTitle");
  const modalCaption = document.getElementById("modalCaption");

  function render() {
    grid.innerHTML = "";
    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${post.folder}/${post.images[0]}" alt="${post.title}" loading="lazy">
        ${post.images.length > 1 ? '<div class="card__multi">▣</div>' : ""}
        <div class="card__overlay">
          <div class="card__overlay-title">${post.title}</div>
        </div>
      `;
      card.addEventListener("click", () => openModal(post.id));
      grid.appendChild(card);
    });
  }

  function openModal(postId) {
    modalPost = posts.find((p) => p.id === postId);
    modalIndex = 0;
    renderModal();
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    modalPost = null;
    document.body.style.overflow = "";
  }

  function renderModal() {
    if (!modalPost) return;

    modalImg.src = `${modalPost.folder}/${modalPost.images[modalIndex]}`;
    modalImg.alt = modalPost.title;
    modalTitle.textContent = modalPost.title;
    modalCaption.textContent = modalPost.caption;

    modalDots.innerHTML = "";
    if (modalPost.images.length > 1) {
      modalPost.images.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "modal__dot" + (i === modalIndex ? " active" : "");
        modalDots.appendChild(dot);
      });
    }
  }

  function showSlide(delta) {
    if (!modalPost) return;
    const total = modalPost.images.length;
    modalIndex = (modalIndex + delta + total) % total;
    renderModal();
  }

  document
    .getElementById("modalCloseBtn")
    .addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document
    .getElementById("modalPrevBtn")
    .addEventListener("click", () => showSlide(-1));
  document
    .getElementById("modalNextBtn")
    .addEventListener("click", () => showSlide(1));

  document.addEventListener("keydown", (e) => {
    if (modalBackdrop.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showSlide(-1);
    if (e.key === "ArrowRight") showSlide(1);
  });

  render();
})();
