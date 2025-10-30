import { useState, useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import GroupsServices from "../../Services/GroupsServices";
import { toast } from "react-toastify";

const GroupDetailsEdit = () => {
    const { store, dispatch } = useGlobalReducer();
    const group = store.activeGroup;

    if (!group) return null;

    const [formData, setFormData] = useState({
        name: group.name,
        description: group.description,
        avatar: group.avatar
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData({
            name: group.name,
            description: group.description,
            avatar: group.avatar
        });
    }, [group]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast.error("Group name is required");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem("token");
        const { success, error, updatedGroup } = await GroupsServices.updateGroup(group.id, formData, token);

        if (success) {
            toast.success("Group updated successfully ✅");

            const newGroup = updatedGroup || { ...group, ...formData };
            dispatch({ type: "toggleGroup", payload: { group: newGroup } });

            const updatedGroups = store.groups.map(g =>
                g.id === group.id ? newGroup : g
            );
            dispatch({ type: "setGroups", payload: updatedGroups });
            dispatch({ type: "setEditMode", payload: false });
        } else {
            toast.error(error || "Error updating group");
        }

        setIsSaving(false);
    };


    const handleCancel = () => {
        dispatch({ type: "setEditMode", payload: false });
        setErrorMsg("");
        setOkMsg("");
    };


    const handleClose = () => {
        dispatch({ type: "toggleGroup", payload: { group: null } });
        dispatch({ type: "setEditMode", payload: false });
    };


    return (
        <div className="d-flex justify-content-center col-sm-12 col-md-12 col-lg-12">
            <div className="card border border-primary p-5 my-3 mx-2 w-100 bg-light shadow">
                <button
                    className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3"
                    onClick={handleClose}
                    title="Close editor"
                    aria-label="Close editor"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <h3 className="mb-4 text-center">Edit Group</h3>

                {errorMsg && <div className="alert alert-danger fade show">{errorMsg}</div>}
                {okMsg && <div className="alert alert-success fade show">{okMsg}</div>}

                <div className="mb-3">
                    <label className="form-label fw-bold">Group Name</label>
                    <input
                        type="text"
                        id="groupName"
                        className="form-control border-primary"
                        placeholder="Max 15 characters"
                        value={formData.name}
                        maxLength={15}
                        required
                        onChange={e =>
                            setFormData(prev => ({ ...prev, name: e.target.value }))
                        }
                    />
                    <small className="text-muted">{15 - formData.name.length} characters left</small>

                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="form-control"
                        placeholder="Description"
                        rows={3}
                    />
                </div>

                {formData.avatar && (
                    <div className="text-center mb-3">
                        <img
                            src={formData.avatar}
                            alt="Avatar preview"
                            className="rounded-circle border border-primary shadow"
                            style={{
                                width: "clamp(140px, 20vw, 200px)",
                                height: "clamp(140px, 20vw, 200px)",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                )}

                <div className="d-flex justify-content-end gap-3 mt-4">
                    <button
                        className="btn btn-outline-primary cta-small"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button className="btn btn-outline-secondary cta-small-cancel" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsEdit;