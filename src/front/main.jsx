
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'

// Bootstrap desde npm (CSS + bundle JS) — chicos no instales CDN Bootstrap (el <script> )
import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap global para utilizar funcionalidades JS
import * as bootstrap from "bootstrap"


import './index.css'  // Global styles for your application

import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration

import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';

window.bootstrap = bootstrap;

// --- Pequeño bridge para encadenar modales ---
function FocusGuard() {
  React.useEffect(() => {
    const blurActive = () => {
      const ae = document.activeElement;
      if (ae && typeof ae.blur === "function") ae.blur();
    };

    const isInsideHiddenModal = (node) =>
      node && node.closest && node.closest('.modal[aria-hidden="true"]');

    const onFocusIn = (e) => {
      const hiddenModal = isInsideHiddenModal(e.target);
      if (hiddenModal) {
        if (typeof e.target.blur === "function") e.target.blur();
        requestAnimationFrame(() => {
          document.body.focus?.();
        });
      }
    };

    const onHide = () => blurActive();

    const onShow = (ev) => {
      const root = ev.target;
      requestAnimationFrame(() => {
        const auto = root.querySelector("[autofocus]");
        const firstInput = root.querySelector(
          'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
        );
        (auto || firstInput || root).focus?.();
      });
    };

    const onClickCapture = (e) => {
      const btn = e.target.closest('[data-bs-dismiss="modal"], [data-modal-chain]');
      if (!btn) return;
      btn.blur?.();
      blurActive();
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("hide.bs.modal", onHide);
    document.addEventListener("show.bs.modal", onShow);
    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("hide.bs.modal", onHide);
      document.removeEventListener("show.bs.modal", onShow);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return null;
}

function ModalChainBridge() {
    useEffect(() => {
        let nextTarget = null;

        const handleClick = (e) => {
            const btn = e.target.closest("[data-modal-chain]");
            if (!btn) return;
            nextTarget = btn.getAttribute("data-modal-chain");
            // El propio boton lleva data-bs-dismiss="modal"
            // Cuando termine de ocultarse, abrimos el siguiente en 'hidden.bs.modal'
        };

        const handleHidden = () => {
            if (nextTarget) {
                const el = document.querySelector(nextTarget);
                if (el && window.bootstrap?.Modal) {
                    const modal = window.bootstrap.Modal.getOrCreateInstance(el);
                    modal.show();
                }
                nextTarget = null;
            }
        };

        document.addEventListener("click", handleClick);
        document.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, []);

    return null; // No renderiza nada; solo instala los listeners
}

const Main = () => {

    if (! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
            <BackendURL />
        </React.StrictMode>
    );
    return (
        <React.StrictMode>
            {/* Provide global state to all components */}
            <StoreProvider>
                {/* Instala el encadenado Modales Boostrap */}
                <ModalChainBridge />
                {/* Set up routing for the application */}
                <FocusGuard />
                <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                </RouterProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
