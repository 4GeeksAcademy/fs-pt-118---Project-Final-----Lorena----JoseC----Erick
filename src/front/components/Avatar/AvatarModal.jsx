import React, { useRef, useState } from "react";
import { AVATAR_MAP } from "./Avatar";
import { forceCloseModalById } from "../../utils/modalUtils";
import CloudinaryServices from "../../Services/Cloudinary";


const MAX_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const AvatarModal = ({ id = "avatarModal", current, onSelect }) => {


  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isSelected = (value) => {
    // value puede ser una clave (predefinido) o una URL (personalizado)
    return value === current;
  };

  const handleOpenFile = () => {
    setErrorMsg("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg("Invalid format. Use JPG, PNG or WEBP.");
      e.target.value = "";
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_MB) {
      setErrorMsg(`The image exceeds ${MAX_MB} MB.`);
      e.target.value = "";
      return;
    }

    setErrorMsg("");
    setUploading(true);
    CloudinaryServices.uploadPerfilImage(file).then((url) => {
      onSelect(url);
      forceCloseModalById(id)
    })
      .catch((err) => {
        setErrorMsg(err?.message || "Error uploading image. Try again later.");
      })
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  };


  return (
    <div id={id} className="modal fade" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content colorModals">
          <div className="modal-header">
            <h5 className="modal-title">Choose</h5>
            <button
              type="button"
              className="btn-close btn-close-white" 
              aria-label="Close"
              onClick={() => forceCloseModalById(id)}
            />
          </div>

          <div className="modal-body text-center text-light">
            {errorMsg && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMsg}
              </div>
            )}

            <div className="row g-3 justify-content-center"> 
              {Object.entries(AVATAR_MAP).map(([key, url]) => {
                const selected = isSelected(key) || isSelected(url);
                return (
                  <div key={key} className="col-4 col-sm-4 d-flex justify-content-center">
                    <button
                      type="button"
                      className={`btn p-1 w-100 ${selected ? "border border-2 border-primary" : "border-0"}`}
                      style={{ borderRadius: "999px" }}
                      onClick={() => {
                        onSelect(key);
                        forceCloseModalById(id);
                      }}
                      aria-label={`Choose avatar ${key}`}
                      >
                      <img
                        src={url}
                        alt={`Avatar ${key}`}
                        className="rounded-circle w-100"
                        style={{ borderRadius: "999px" }}
                        />
                    </button>
                  </div>
                );
              })}
                <div className="col-4 col-sm-4 d-flex justify-content-center ">
                <button
                  type="button"
                  className={`btn p-1 w-100 border-2 d-flex flex-column align-items-center justify-content-center
                     ${isSelected(current) ? "border-primary" : "border-secondary-subtle"}`}  
                     style={{ borderRadius: "999px" }}          
                  onClick={handleOpenFile}
                  aria-label="Upload a custom avatar"
                >
                  {uploading ? (
                    <>
                      <div className="spinner-border" role="status" aria-hidden="true" />
                      <small className="mt-2 ">
                        <div className="spinner-grow text-light" role="status">
                          <span className="visually-hidden">UpLoading...</span>
                        </div>
                      </small>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up" style={{fontSize: 28, color: "#44ac32ff"}} />
                      <small className="mt-2" style={{ color: "#44ac32ff" }}  >Upload</small>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="mt-3">
              <small className="text-body-white d-block">
                Allowed formats: JPG, PNG, WEBP. Max size: {MAX_MB} MB.
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-dark"
              onClick={() => forceCloseModalById(id)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
