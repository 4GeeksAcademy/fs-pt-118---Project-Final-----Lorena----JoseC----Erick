/**
 * Utilidades para manejar modales Bootstrap desde React.
 * Incluye cierre forzado, navegación posterior, y encadenado seguro.
 */

const B = () => window.bootstrap;

/** Quita el foco actual de forma segura (evita el warning aria-hidden + focus) */
function blurActive() {
  const ae = document.activeElement;
  if (ae && typeof ae.blur === "function") ae.blur();
}

/**
 * Fuerza el cierre de un modal Bootstrap y ejecuta una acción al finalizar.
 * @param {string} id - ID del modal en el DOM (ej. "loginModal")
 * @param {function} [onHidden] - Función opcional a ejecutar tras cerrar el modal
 */
export function forceCloseModalById(id, onHidden) {
  const el = document.getElementById(id);
  const Boot = B();

  // Evita que un descendiente mantenga el foco cuando el contenedor pase a aria-hidden
  blurActive();

  // Si no hay bootstrap o el modal no existe → fallback manual
  if (!el || !Boot?.Modal) {
    el?.classList?.remove("show");
    if (el) el.style.display = "none";
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
    if (typeof onHidden === "function") onHidden();
    return;
  }

  // Refuerzo: al empezar a ocultarse, blurea
  el.addEventListener("hide.bs.modal", blurActive, { once: true });

  // Al quedar oculto, ejecuta callback
  el.addEventListener(
    "hidden.bs.modal",
    () => { if (typeof onHidden === "function") onHidden(); },
    { once: true }
  );

  // Ocultar
  const instance = Boot.Modal.getOrCreateInstance(el);
  instance.hide();

  // Salvaguarda por si no dispara eventos
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

/**
 * Abre un modal Bootstrap por su ID.
 * @param {string} id - ID del modal a abrir (ej. "registerModal")
 */
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

/**
 * Cierra todos los modales abiertos y elimina los backdrops.
 */
export function closeAllModals() {
  // evita foco retenido antes de empezar a cerrar
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

/**
 * Cambia de un modal a otro de forma segura:
 * cierra 'fromId' y, cuando esté oculto, abre 'toId'
 */
export function switchModals(fromId, toId) {
  const fromEl = document.getElementById(fromId);
  const Boot = B();

  // importante: blurear antes de iniciar el cierre
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

  // refuerzo: si el navegador es lento, blurea también cuando empiece el hide
  const onHide = () => blurActive();
  fromEl.addEventListener("hide.bs.modal", onHide, { once: true });

  Boot.Modal.getOrCreateInstance(fromEl).hide();
}
