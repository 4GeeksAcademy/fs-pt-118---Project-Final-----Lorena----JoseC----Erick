import { useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import GroupsServices from "../../Services/GroupsServices";
import { toast } from "react-toastify";

const GroupDetails = ({ show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const group = store.activeGroup;
  const currentUserId = store.user?.id;

  if (!show || !group) return null;

  const isOwner = group.user_id === currentUserId;
  const isMember = group.members?.some(m => m.id === currentUserId);

  const updateGroupMembers = (newMembers) => {
    const updatedGroup = { ...group, members: newMembers };
    dispatch({ type: "toggleGroup", payload: { group: updatedGroup } });

    const updatedGroups = store.groups.map(g =>
      g.id === group.id ? updatedGroup : g
    );
    dispatch({ type: "setGroups", payload: updatedGroups });
  };

  const handleJoin = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const { success, error } = await GroupsServices.joinGroup(group.id, token);

    if (success) {
      toast.success("You've joined the group 🎉");
      const updatedMembers = [...group.members, store.user];
      updateGroupMembers(updatedMembers);
    } else {
      toast.error(error || "Error joining group");
    }

    setLoading(false);
  };

  const handleLeave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const { success, error } = await GroupsServices.leaveGroup(group.id, token);

    if (success) {
      toast("You left the group 👋", { icon: "👋" });
      const updatedMembers = group.members.filter(m => m.id !== currentUserId);
      updateGroupMembers(updatedMembers);
    } else {
      toast.error(error || "Error leaving group");
    }

    setLoading(false);
  };

  const handleClose = () => {
    dispatch({ type: "toggleGroup", payload: { group: null } });
    dispatch({ type: "setEditMode", payload: false });
    onClose();
  };

  return (
    <div className="group-modal-backdrop">
      <div className="group-modal-container p-4">
        <button
          className="btn btn-sm btn-outline-danger group-modal-close"
          onClick={handleClose}
          title="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="row g-4 align-items-start mb-4">
          <div className="col-md-4 text-start">
            <h4 className="fw-bold mb-3">{group.name}</h4>
            {group.avatar && (
              <img
                src={group.avatar}
                alt="Group avatar"
                className="group-avatar"
              />
            )}
          </div>
          <div className="col-md-8">
            <h5 className="fw-semibold">Description</h5>
            <div className="group-description-scroll">
              <p className="text-muted mb-0">
                {group.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="fw-semibold">Events</h5>
          {group.events.length > 0 ? (
            <ul className="list-group list-group-flush">
              {group.events.map((e, i) => (
                <li key={i} className="list-group-item">• {e.name}</li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-danger mt-2">
              This group has no events yet.
            </div>
          )}
        </div>

        <div>
          <h5 className="fw-semibold">Members</h5>
          <ul className="list-group list-group-flush">
            {group.members.map((m, i) => (
              <li key={i} className="list-group-item">
                {m.user_name === group.owner_name ? "👑 " : "• "}
                {m.user_name}
              </li>
            ))}
          </ul>
        </div>

        {!isOwner && (
          <div className="text-center mt-4">
            {isMember ? (
              <button className="btn btn-danger px-4" onClick={handleLeave} disabled={loading}>
                <i className="fa-solid fa-right-from-bracket me-2"></i> Leave Group
              </button>
            ) : (
              <button className="btn btn-success px-4" onClick={handleJoin} disabled={loading}>
                <i className="fa-solid fa-user-plus me-2"></i> Join Group
              </button>
            )}
          </div>
        )}
      </div>
    </div>


  );
};

export default GroupDetails;