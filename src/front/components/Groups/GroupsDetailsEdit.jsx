import { useState, useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import GroupsServices from "../../Services/GroupsServices";
import { toast } from "react-toastify";
import CloudinaryServices from "../../Services/Cloudinary";

const GroupDetailsEdit = ({ show, onClose }) => {
  const { store, dispatch } = useGlobalReducer();
  const group = store.activeGroup;

  const [formData, setFormData] = useState({
    name: group?.name || "",
    description: group?.description || "",
    avatar: group?.avatar || ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        avatar: group.avatar
      });
    }
  }, [group]);

  if (!show || !group) return null;

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("token");

    let avatarUrl = formData.avatar;

    if (newImageFile) {
      try {
        avatarUrl = await CloudinaryServices.uploadGroupImage(newImageFile);
      } catch (err) {
        toast.error("Error uploading image");
        setIsSaving(false);
        return;
      }
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      avatar: avatarUrl
    };

    const { success, error, updatedGroup } = await GroupsServices.updateGroup(group.id, payload, token);

    if (success) {
      toast.success("Group updated successfully ✅");
      const newGroup = updatedGroup || { ...group, ...payload };

      dispatch({ type: "toggleGroup", payload: { group: newGroup } });

      const updatedGroups = store.groups.map(g =>
        g.id === group.id ? newGroup : g
      );
      dispatch({ type: "setGroups", payload: updatedGroups });
      dispatch({ type: "setEditMode", payload: false });
      dispatch({ type: "setShowGroupEditor", payload: false });
      onClose();
    } else {
      toast.error(error || "Error updating group");
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    dispatch({ type: "setEditMode", payload: false });
    dispatch({ type: "setShowGroupEditor", payload: false });
    setErrorMsg("");
    setOkMsg("");
    onClose();
  };

  return (
    <div className="group-edit-backdrop">
      <div className="group-edit-container">
        <button
          className="btn btn-sm btn-outline-danger group-edit-close"
          onClick={handleCancel}
          title="Cancel"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h4 className="fw-bold text-center mb-3">Edit Group</h4>
        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
        {okMsg && <div className="alert alert-success py-2">{okMsg}</div>}

        <div className="row g-3 align-items-start mb-3">
          <div className="col-sm-4 text-center">
            {formData.avatar && (
              <img
                src={formData.avatar}
                alt="Avatar preview"
                className="group-edit-avatar"
              />
            )}
            <div className="mb-2">
              <label className="form-label fw-semibold">change group image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewImageFile(file);
                    setFormData(prev => ({
                      ...prev,
                      avatar: URL.createObjectURL(file)
                    }));
                  }
                }}
              />
            </div>

          </div>
          <div className="col-sm-8">
            <div className="mb-2">
              <label className="form-label fw-semibold">Group Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-primary"
                value={formData.name}
                maxLength={15}
                required
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <small className="text-muted">{15 - formData.name.length} characters left</small>
            </div>

            <div>
              <label className="form-label fw-semibold">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="form-control form-control-sm"
                rows={3}
                placeholder="Description"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            className="btn btn-outline-primary btn-sm px-4"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm px-4"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>


  );
};

export default GroupDetailsEdit;
