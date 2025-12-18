function sipCarouselScroll(id, dir) {
  const el = document.getElementById(id);
  if (!el) return;

  const card = el.querySelector(".carousel-card");
  const amount = card ? Math.floor(card.getBoundingClientRect().width * 1.1) : 420;
  el.scrollBy({ left: dir * amount, behavior: "smooth" });
}

function sipCardSlide(ev, cardId, dir) {
  ev.preventDefault();
  ev.stopPropagation();

  const box = document.getElementById(cardId);
  if (!box) return;

  const slides = box.querySelectorAll(".card-slide");
  if (!slides.length) return;

  let idx = parseInt(box.dataset.index || "0", 10);
  idx = (idx + dir + slides.length) % slides.length;
  box.dataset.index = String(idx);

  slides.forEach((img, i) => img.classList.toggle("is-active", i === idx));
}

function sipUpdateRowArrows(wrap) {
  const row = wrap.querySelector(".carousel");
  const left = wrap.querySelector(".carousel-overlay.left");
  const right = wrap.querySelector(".carousel-overlay.right");
  if (!row || !left || !right) return;

  const canScroll = row.scrollWidth > row.clientWidth + 2;
  if (!canScroll) { left.style.display="none"; right.style.display="none"; return; }
  left.style.display=""; right.style.display="";

  left.disabled = row.scrollLeft <= 1;
  right.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
}

/* ---------- Lightbox ---------- */
function sipLightboxOpen(src, alt) {
  const lb = document.getElementById("sipLightbox");
  if (!lb) return;
  const img = lb.querySelector(".sip-lightbox-img");
  img.src = src;
  img.alt = alt || "";
  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function sipLightboxClose() {
  const lb = document.getElementById("sipLightbox");
  if (!lb) return;
  const img = lb.querySelector(".sip-lightbox-img");
  img.src = "";
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function sipInitLightbox() {
  const lb = document.getElementById("sipLightbox");
  if (!lb) return;

  // Click image in any carousel thumb to open (uses the currently active slide)
  document.addEventListener("click", (ev) => {
    const thumb = ev.target.closest(".carousel-thumb");
    if (!thumb) return;

    // If user clicked mini arrows, ignore (they already stopPropagation, but extra safety)
    if (ev.target.closest(".card-nav")) return;

    const active = thumb.querySelector(".card-slide.is-active");
    if (!active) return;

    // Prevent navigating to the artwork page when opening lightbox
    ev.preventDefault();

    sipLightboxOpen(active.src, active.alt);
  });

  // Close controls
  lb.addEventListener("click", (ev) => {
    // click outside image closes
    if (ev.target === lb) sipLightboxClose();
  });

  const closeBtn = lb.querySelector(".sip-lightbox-close");
  if (closeBtn) closeBtn.addEventListener("click", sipLightboxClose);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") sipLightboxClose();
  });
}

function sipInitCarousels() {
  const wraps = document.querySelectorAll(".carousel-wrap");
  wraps.forEach((wrap) => {
    const row = wrap.querySelector(".carousel");
    if (!row) return;

    const update = () => sipUpdateRowArrows(wrap);
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    update();
  });

  sipInitLightbox();
}

document.addEventListener("DOMContentLoaded", sipInitCarousels);
