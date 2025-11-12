const B = () => window.bootstrap;

function blurActive() {
  const ae = document.activeElement;
  if (ae && typeof ae.blur === "function") ae.blur();
}

export function forceCloseModalById(id, onHidden) {
  const el = document.getElementById(id);
  const Boot = B();
  blurActive();
  if (!el || !Boot?.Modal) {
    el?.classList?.remove("show");
    if (el) el.style.display = "none";
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
    if (typeof onHidden === "function") onHidden();
    return;
  }
  el.addEventListener("hide.bs.modal", blurActive, { once: true });
  el.addEventListener("hidden.bs.modal", () => {
    if (typeof onHidden === "function") onHidden();
  }, { once: true });

  const instance = Boot.Modal.getOrCreateInstance(el);
  instance.hide();
  setTimeout(() => {
    if (el.classList.contains("show")) {
      el.classList.remove("show");
      el.style.display = "none";
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
      if (typeof onHidden === "function") onHidden();
    }
  }, 500);
}

export function openModalById(id) {
  const el = document.getElementById(id);
  const Boot = B();
  if (el && Boot?.Modal) {
    const modal = Boot.Modal.getOrCreateInstance(el, { focus: true, backdrop: true });
    modal.show();
  } else {
    console.warn(`Modal con id "${id}" no encontrado o Bootstrap no cargado.`);
  }
}

export function closeAllModals() {
  blurActive();
  const Boot = B();
  document.querySelectorAll(".modal.show").forEach(el => {
    if (Boot?.Modal) {
      Boot.Modal.getOrCreateInstance(el).hide();
    } else {
      el.classList.remove("show");
      el.style.display = "none";
    }
  });
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
}

export function switchModals(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const Boot = B();
  blurActive();
  if (!fromEl || !Boot?.Modal) {
    closeAllModals();
    openModalById(toId);
    return;
  }
  const onHidden = () => {
    fromEl.removeEventListener("hidden.bs.modal", onHidden);
    openModalById(toId);
  };
  fromEl.addEventListener("hidden.bs.modal", onHidden, { once: true });
  const onHide = () => blurActive();
  fromEl.addEventListener("hide.bs.modal", onHide, { once: true });
  Boot.Modal.getOrCreateInstance(fromEl).hide();
}