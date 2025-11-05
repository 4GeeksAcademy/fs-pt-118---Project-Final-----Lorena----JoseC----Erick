import React, { useRef, useState } from "react";
import { forceCloseModalById } from "../../utils/modalUtils";
import CloudinaryServices from "../../Services/Cloudinary";
import styles from "./AvatarModal.module.css";

// --- Configuracion ---
const MAX_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const DICEBEAR_STYLES = [
  "initials",
  "adventurer",
  "fun-emoji",
  "bottts",
  "avataaars",
  "thumbs",
  "notionists",
];

// Genera una URL de DiceBear con estilo y semilla
const getDicebearUrl = (style, seed, size = 240) =>
  `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=${size}&radius=50`;

const AvatarModal = ({ id = "avatarModal", current, userName = "User", onSelect }) => {

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [style, setStyle] = useState("initials");
  const [seeds, setSeeds] = useState(generateSeeds(userName));

  function generateSeeds(baseName) {
    const baseSeed = baseName.trim().replace(/\s+/g, "-").toLowerCase() || "user";
    const random = Math.random().toString(36).substring(2, 8);
    return [
      baseSeed,
      `${baseSeed}-01`,
      `${baseSeed}-02`,
      `${baseSeed}-03`,
      `${baseSeed}-${random}`,
      `${baseSeed}-${random}x`,
      `random-${random}`,
      `guest-${random}`,
      `test-${random}`,
      `alpha-${random}`,
      `bravo-${random}`,
      `charlie-${random}`,
    ];
  }

  const handleOpenFile = () => fileInputRef.current?.click();

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

    setUploading(true);
    setErrorMsg("");
    CloudinaryServices.uploadPerfilImage(file)
      .then((url) => {
        onSelect(url); // guardamos la URL de Cloudinary
        forceCloseModalById(id);
      })
      .catch(() => {
        setErrorMsg("Error uploading image. Try again later.");
      })
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  };

  const randomize = () => setSeeds(generateSeeds(userName));

  return (
    <div id={id} className="modal fade" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className={`colorModals modal-content ${styles.modalMinimal}`}>
          <div className="modal-header">
            <h5 className="modal-title">Choose your avatar</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => forceCloseModalById(id)}
            />
          </div>
          <div className="modal-body text-center text-light">
            {errorMsg && (
              <div className="alert alert-danger py-2" role="alert">
                {errorMsg}
              </div>
            )}
            <div className={`d-flex justify-content-center mb-3 ${styles.controlBar}`}>
              <select
                className={`form-select form-select-sm ${styles.select}`}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {DICEBEAR_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s === "initials" ? "Classic (Initials)" : s}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className={`btn btn-outline-light btn-sm ${styles.randomBtn}`}
                onClick={randomize}
              >
                <i className="bi bi-shuffle" /> Random
              </button>
              <div className="col-4 col-sm-4 d-flex justify-content-center ">
                <button
                  type="button"
                  className={`${styles.uploadBtn} ${uploading ? styles.uploading : ""}`}
                  onClick={handleOpenFile}
                  aria-label="Upload a custom avatar"
                >
                  {uploading ? (
                    <>
                      <div className="spinner-border" role="status" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up" />
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

            <div className="row g-3 justify-content-center">
              {/* Avatares generados DeceBear */}
              {seeds.map((seed) => {
                const url = getDicebearUrl(style, seed);
                const selected = current === url;
                return (
                  <div key={seed} className="col-4 col-sm-4 d-flex justify-content-center">
                    <button
                      type="button"
                      className={`btn p-1 w-100 ${selected ? "border border-2 border-primary" : "border-0"
                        }`}
                      style={{ borderRadius: "999px" }}
                      onClick={() => {
                        onSelect(url);
                        forceCloseModalById(id);
                      }}
                    >
                      <img
                        src={url}
                        alt={`Avatar ${seed}`}
                        className="rounded-circle w-100"
                        style={{ borderRadius: "999px" }}
                      />
                    </button>
                  </div>
                );
              })}
    
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
