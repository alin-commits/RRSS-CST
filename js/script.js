(function () {
  const posts = window.CST_POSTS || [];

  let modalPost = null;
  let modalIndex = 0;

  const grid = document.getElementById("grid");

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCard = document.querySelector(".modal");
  const modalMedia = document.querySelector(".modal__media");
  const modalSide = document.querySelector(".modal__side");
  const modalImg = document.getElementById("modalImg");
  const modalDots = document.getElementById("modalDots");
  const modalTitle = document.getElementById("modalTitle");
  const modalCaption = document.getElementById("modalCaption");

  function formatCaption(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

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
    modalCaption.innerHTML = formatCaption(modalPost.caption);

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

  // Gestos táctiles tipo Instagram: swipe horizontal sobre la foto cambia
  // de slide; swipe hacia abajo desde cualquier parte del post arrastra
  // TODA la tarjeta (foto + texto) y la cierra, como en IG.
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDeltaX = 0;
  let touchDeltaY = 0;
  let dragging = false;
  let dragMode = null; // "slide" | "close" | "ignore"

  modalCard.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDeltaX = 0;
      touchDeltaY = 0;
      dragging = true;
      dragMode = null;
      modalCard.style.transition = "none";
    },
    { passive: true }
  );

  modalCard.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging || e.touches.length !== 1) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      touchDeltaY = e.touches[0].clientY - touchStartY;

      if (dragMode === null && (Math.abs(touchDeltaX) > 8 || Math.abs(touchDeltaY) > 8)) {
        const overMedia = modalMedia.contains(e.target);
        const sideAtTop = !overMedia && modalSide.scrollTop <= 0;
        const isMostlyVertical = Math.abs(touchDeltaY) > Math.abs(touchDeltaX);

        if (isMostlyVertical && touchDeltaY > 0 && (overMedia || sideAtTop)) {
          dragMode = "close";
        } else if (!isMostlyVertical && overMedia) {
          dragMode = "slide";
        } else {
          dragMode = "ignore";
        }
      }

      if (dragMode === "close") {
        e.preventDefault();
        modalCard.style.transform = `translateY(${touchDeltaY}px)`;
        modalCard.style.opacity = String(Math.max(1 - touchDeltaY / 400, 0.4));
      } else if (dragMode === "slide") {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    modalCard.style.transition = "";

    const SWIPE_THRESHOLD = 50;
    const CLOSE_THRESHOLD = 110;

    if (dragMode === "slide" && Math.abs(touchDeltaX) > SWIPE_THRESHOLD) {
      showSlide(touchDeltaX < 0 ? 1 : -1);
    } else if (dragMode === "close" && touchDeltaY > CLOSE_THRESHOLD) {
      closeModal();
    }

    modalCard.style.transform = "";
    modalCard.style.opacity = "";
    dragMode = null;
  }

  modalCard.addEventListener("touchend", endDrag);
  modalCard.addEventListener("touchcancel", endDrag);

  render();
})();
