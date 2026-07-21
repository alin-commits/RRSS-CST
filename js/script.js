(function () {
  const posts = window.CST_POSTS || [];
  const STATUS_LABEL = {
    pendiente: "Pendiente",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
  };

  let statuses = {}; // post_id -> { status, note, updated_at }
  let currentFilter = "todos";
  let modalPost = null;
  let modalIndex = 0;

  const grid = document.getElementById("grid");
  const emptyState = document.getElementById("emptyState");
  const statPending = document.getElementById("statPending");
  const statApproved = document.getElementById("statApproved");
  const statRejected = document.getElementById("statRejected");
  const demoBanner = document.getElementById("demoBanner");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalImg = document.getElementById("modalImg");
  const modalDots = document.getElementById("modalDots");
  const modalTitle = document.getElementById("modalTitle");
  const modalCaption = document.getElementById("modalCaption");
  const modalNote = document.getElementById("modalNote");
  const modalStatusRow = document.getElementById("modalStatusRow");
  const btnApprove = document.getElementById("btnApprove");
  const btnReject = document.getElementById("btnReject");
  const rejectNoteBox = document.getElementById("rejectNoteBox");
  const rejectNoteText = document.getElementById("rejectNoteText");
  const btnConfirmReject = document.getElementById("btnConfirmReject");
  const btnCancelReject = document.getElementById("btnCancelReject");

  function statusOf(postId) {
    return (statuses[postId] && statuses[postId].status) || "pendiente";
  }

  function render() {
    const filtered = posts.filter((p) => {
      if (currentFilter === "todos") return true;
      return statusOf(p.id) === currentFilter;
    });

    grid.innerHTML = "";
    emptyState.hidden = filtered.length !== 0;

    filtered.forEach((post) => {
      const status = statusOf(post.id);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${post.folder}/${post.images[0]}" alt="${post.title}" loading="lazy">
        ${post.images.length > 1 ? '<div class="card__multi">▣</div>' : ""}
        <span class="card__status-dot card__status-dot--${status}"></span>
        <div class="card__overlay">
          <div class="card__overlay-title">${post.title}</div>
          <span class="badge badge--${status}">${STATUS_LABEL[status]}</span>
        </div>
      `;
      card.addEventListener("click", () => openModal(post.id));
      grid.appendChild(card);
    });

    const counts = { pendiente: 0, aprobado: 0, rechazado: 0 };
    posts.forEach((p) => counts[statusOf(p.id)]++);
    statPending.textContent = counts.pendiente;
    statApproved.textContent = counts.aprobado;
    statRejected.textContent = counts.rechazado;

    filterButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.filter === currentFilter)
    );
  }

  function openModal(postId) {
    modalPost = posts.find((p) => p.id === postId);
    modalIndex = 0;
    rejectNoteBox.classList.remove("open");
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
    const status = statusOf(modalPost.id);
    const row = statuses[modalPost.id];

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

    modalStatusRow.innerHTML = `<span class="badge badge--${status}">${STATUS_LABEL[status]}</span>`;

    if (modalPost.type === "video-pending" && modalPost.videoNote) {
      modalNote.hidden = false;
      modalNote.textContent = "🎥 " + modalPost.videoNote;
    } else {
      modalNote.hidden = true;
    }

    if (row && row.note && status === "rechazado") {
      modalNote.hidden = false;
      modalNote.textContent =
        (modalNote.textContent ? modalNote.textContent + " — " : "") +
        "Motivo del rechazo: " +
        row.note;
    }
  }

  function showSlide(delta) {
    if (!modalPost) return;
    const total = modalPost.images.length;
    modalIndex = (modalIndex + delta + total) % total;
    renderModal();
  }

  async function saveStatus(status, note) {
    if (!modalPost) return;
    const postId = modalPost.id;
    const updated = await window.CST_DATA.setStatus(postId, status, note);
    statuses[postId] = updated;
    renderModal();
    render();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      render();
    });
  });

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

  btnApprove.addEventListener("click", () => {
    rejectNoteBox.classList.remove("open");
    saveStatus("aprobado", null);
  });

  btnReject.addEventListener("click", () => {
    rejectNoteText.value = "";
    rejectNoteBox.classList.add("open");
  });

  btnCancelReject.addEventListener("click", () => {
    rejectNoteBox.classList.remove("open");
  });

  btnConfirmReject.addEventListener("click", () => {
    saveStatus("rechazado", rejectNoteText.value.trim() || null);
    rejectNoteBox.classList.remove("open");
  });

  async function init() {
    demoBanner.hidden = window.CST_DATA.isConfigured;
    statuses = await window.CST_DATA.fetchStatuses();
    render();

    window.CST_DATA.subscribeToChanges((row) => {
      if (!row || !row.post_id) return;
      statuses[row.post_id] = row;
      render();
      if (modalPost && modalPost.id === row.post_id) renderModal();
    });
  }

  init();
})();
