import { useState } from "react";
import { toast } from "react-toastify";
import GroupsServices from "../../Services/GroupsServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { createPortal } from "react-dom";

const Teams = ({ group, scrollRef }) => {
        const [showConfirmModal, setShowConfirmModal] = useState(false);
        const token = localStorage.getItem("token");
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.user_name;
        const isOwner = group.owner_name === currentUserId;
        const scrollToDetails = () => {
                const tryScroll = () => {
                        if (scrollRef?.current) {
                                scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                        } else {
                                setTimeout(tryScroll, 50);
                        }
                };
                tryScroll();
        };


        const { store, dispatch } = useGlobalReducer();
        const isActive = store.activeGroup?.id === group.id;

        const handleToggle = () => {
                const isSameGroup = store.activeGroup?.id === group.id;
                dispatch({ type: "toggleGroup", payload: { group: null } });
                dispatch({ type: "setEditMode", payload: false });

                if (!isSameGroup || store.editMode) {
                        setTimeout(() => {
                                dispatch({ type: "toggleGroup", payload: { group } });
                                dispatch({ type: "setEditMode", payload: false });
                                scrollToDetails();
                        }, 0);

                }
        };

        const handleEdit = () => {
                const isSameGroup = store.activeGroup?.id === group.id;
                dispatch({ type: "toggleGroup", payload: { group: null } });
                dispatch({ type: "setEditMode", payload: false });

                if (!isSameGroup || !store.editMode) {
                        setTimeout(() => {
                                dispatch({ type: "toggleGroup", payload: { group } });
                                dispatch({ type: "setEditMode", payload: true });
                                scrollToDetails();
                        }, 0);
                }
        };

        const handleDelete = async () => {
                setShowConfirmModal(false);
                const { success, error } = await GroupsServices.deleteGroup(group.id, token);

                if (success) {
                        toast.success("Group deleted successfully 🗑️", { autoClose: 2500 });
                        dispatch({ type: "removeGroup", payload: group.id });
                        setTimeout(() => window.location.reload(), 2800);
                } else {
                        toast.error(error || "Error deleting group");
                }
        };

        return (
                <div className="container d-flex flex-column align-items-center my-3">
                        <div className="team-card border rounded-4 shadow-sm p-3 w-100" style={{ maxWidth: "700px" }}>
                                <div className="d-flex flex-column flex-md-row align-items-center 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    justify-content-between gap-3 text-center text-md-start">
                                        <div className="d-flex align-items-center gap-3 flex-grow-1 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            justify-content-center justify-content-md-start">
                                                {group.avatar && (
                                                        <img
                                                                src={group.avatar}
                                                                alt={`${group.name} avatar`}
                                                                className="team-avatar img-fluid rounded-circle border border-primary shadow"
                                                        />
                                                )}
                                                <div>
                                                        <h5 className="mb-1 fw-bold">{group.name}</h5>
                                                        <p className="mb-0 text-muted small">
                                                                <i className="fa-solid fa-calendar-days me-2"></i>
                                                                Active events: {group.events?.length || 0}
                                                        </p>
                                                </div>
                                        </div>

                                        <div className="flex-shrink-0 mx-5">
                                                <p className="mb-0 small">
                                                        <i className="fa-solid fa-user-group me-2"></i>
                                                        Members: {group.members_count}
                                                </p>
                                        </div>
                                        <div className="d-flex flex-column align-items-center gap-2 flex-shrink-0">
                                                <button
                                                        className="btn btn-link p-0 border-0"
                                                        onClick={handleToggle}
                                                        title={isActive ? "Hide group" : "Show group"}
                                                        aria-label={isActive ? "Hide group" : "Show group"}
                                                >
                                                        <i className={`fa-solid ${!isActive ? "fa-eye-slash" : "fa-eye"} fs-4 text-primary`} />
                                                </button>

                                                {isOwner && (
                                                        <div className="d-flex flex-wrap justify-content-center gap-2">
                                                                <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}>
                                                                        <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setShowConfirmModal(true)}>
                                                                        <i className="fa-solid fa-trash me-1"></i> Delete
                                                                </button>
                                                        </div>
                                                )}

                                        </div>
                                </div>
                        </div>
                        {showConfirmModal && createPortal(
                                <div className="modal-backdrop">
                                        <div className="modal-confirm text-center">
                                                <h5 className="mb-3">Are you sure you want to delete this group?</h5>

                                                <img
                                                        src="https://static.wikia.nocookie.net/gensin-impact/images/2/2d/Icon_Emoji_Paimon%27s_Paintings_01_Lumine_2.png/revision/latest?cb=20240303141251"
                                                        alt="Lumine icon"
                                                        style={{ width: 80, height: 80, objectFit: "contain", marginBottom: "1rem" }}
                                                />
                                                <div className="d-flex justify-content-center gap-3">
                                                        <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                                                                Cancel
                                                        </button>
                                                        <button className="btn btn-danger" onClick={handleDelete}>
                                                                Confirm Delete
                                                        </button>
                                                </div>
                                        </div>
                                </div>,
                                document.body
                        )}
                </div>
        );
};

export default Teams;
