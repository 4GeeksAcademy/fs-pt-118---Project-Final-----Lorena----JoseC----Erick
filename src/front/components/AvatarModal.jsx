import React from "react";
import { AVATAR_MAP } from "./Avatar"; 
import { forceCloseModalById } from "../utils/modalUtils";

// Reutiliazable modal Chic@s
const AvatarModal = ({ id = "avatarModal", current, onSelect }) => {
  return (
    <div id={id} className="modal fade" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content colorModals">
          <div className="modal-header">
            <h5 className="modal-title">Choose</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => forceCloseModalById(id)}
            />
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {Object.entries(AVATAR_MAP).map(([key, url]) => (
                <div key={key} className="col-4 col-sm-3">
                  <button
                    type="button"
                    className={`btn p-1 w-100 ${
                      key === current ? "border border-2 border-primary" : "border-0"
                    }`}
                    style={{ borderRadius: "999px" }}
                    onClick={() => {
                      onSelect(key);
                      forceCloseModalById(id);
                    }}
                  >
                    <img
                      src={url}
                      alt={`Avatar ${key}`}
                      className="rounded-circle w-100"
                      style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => forceCloseModalById(id)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
