import { useState } from "react";
import CloudinaryServices from "../../Services/Cloudinary";
import GroupsServices from "../../Services/GroupsServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FormGroup = ({ show, onClose }) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    imageFile: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroupData(prev => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Limpia errores anteriores

    // Validación manual
    if (!groupData.name.trim()) {
      setErrorMsg("Team name is required.");
      return;
    }

    if (!groupData.description.trim()) {
      setErrorMsg("Description is required.");
      return;
    }

    if (!groupData.imageFile) {
      setErrorMsg("Group image is required.");
      return;
    }

    setIsUploading(true);

    try {
      let avatarUrl = "";

      if (groupData.imageFile) {
        avatarUrl = await CloudinaryServices.uploadGroupImage(groupData.imageFile);
      }

      const payload = {
        name: groupData.name,
        description: groupData.description,
        avatar: avatarUrl,
      };

      const token = localStorage.getItem("token");
      const { success, data, error } = await GroupsServices.newGroup(payload, token);

      if (success) {
        toast.success("Group created successfully 🎉");
        setGroupData({ name: "", description: "", imageFile: null });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(error || "Error creating group");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="overlay">
      <div className="modal-box mx-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">Create your team</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          {okMsg && <div className="alert alert-success">{okMsg}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="mb-3">
            <label htmlFor="groupName" className="form-label fw-bold">Team name</label>
            <input
              type="text"
              id="groupName"
              className="form-control border-primary"
              placeholder="Max 15 characters"
              value={groupData.name}
              maxLength={15}
              onChange={e => setGroupData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <small className="text-muted">{15 - groupData.name.length} characters left</small>
          </div>

          <div className="mb-3">
            <label htmlFor="groupDescription" className="form-label fw-bold">Description</label>
            <textarea
              id="groupDescription"
              className="form-control border-primary"
              rows="3"
              placeholder="What’s the purpose of this group?"
              value={groupData.description}
              onChange={e => setGroupData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="groupAvatar" className="form-label fw-bold">Group image</label>
            <input
              type="file"
              id="groupAvatar"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {groupData.imageFile && !isUploading && (
              <div className="text-center mt-3">
                <img
                  src={URL.createObjectURL(groupData.imageFile)}
                  alt="Preview"
                  className="img-fluid rounded-circle border border-2 border-primary"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            )}
          </div>

          {isUploading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
              <p className="mt-2 text-muted">Uploading image…</p>
            </div>
          )}

          <div className="d-grid mt-4">
            <input
              type="submit"
              className="cta btn w-100 py-2 fw-bold text-white"
              value="Create team"
              disabled={isUploading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormGroup;
