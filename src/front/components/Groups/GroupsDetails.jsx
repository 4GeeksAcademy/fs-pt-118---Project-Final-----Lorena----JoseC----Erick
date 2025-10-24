import { useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import GroupsServices from "../../Services/GroupsServices";
import { toast } from "react-toastify";

const GroupDetails = () => {
  const { store, dispatch } = useGlobalReducer();
  const group = store.activeGroup;
  const currentUserId = store.user?.id;

  if (!group) return null;

  const isOwner = group.user_id === currentUserId;
  const isMember = group.members?.some(m => m.id === currentUserId);

  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const { success, error } = await GroupsServices.joinGroup(group.id, token);

    if (success) {
      toast.success("You've joined the group 🎉");
      setTimeout(() => window.location.reload(), 2800);
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
      setTimeout(() => window.location.reload(), 2800);
    } else {
      toast.error(error || "Error leaving group");
    }
    setLoading(false);
  };

  const handleClose = () => {
    dispatch({ type: "toggleGroup", payload: { group: null } });
    dispatch({ type: "setEditMode", payload: false });
  };


  return (
    <div className="d-flex justify-content-center col-sm-12 col-md-12 col-lg-12">

      <div className="card border rounded-4 p-5 my-3 mx-2 w-75 shadow">
        <button
          className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-3"
          onClick={handleClose}
          title="Close details"
          aria-label="Close details"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {group.avatar && (
          <div className="d-flex justify-content-center my-3">
            <img
              src={group.avatar}
              alt={`${group.name} avatar`}
              className="img-fluid border border-primary shadow transition rounded rounded-4"
              style={{
                width: "clamp(140px, 18vw, 240px)",
                height: "clamp(140px, 18vw, 240px)",
                objectFit: "cover"
              }}
            />
          </div>
        )}

        <h3 className="text-center">{group.name}</h3>
        <p className="text-muted text-center">{group.description || "No description available."}</p>

        <div className="row mt-4">
          <div className="col-md-6">
            <h5>Members</h5>
            <ul className="list-group list-group-flush">
              {group.members.map((m, i) => (
                <li key={`member-${i}`} className="list-group-item">
                  {m.user_name === group.owner_name ? "👑 " : "• "}
                  {m.user_name}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6">
            <h5>Events</h5>
            <ul className="list-group list-group-flush">
              {group.events.map((e, i) => (
                <li key={`event-${i}`} className="list-group-item">• {e.name}</li>
              ))}
            </ul>
          </div>
        </div>

        {!isOwner && (
          <div className="text-center mt-4">
            {isMember ? (
              <button
                className="btn btn-danger"
                onClick={handleLeave}
                disabled={loading}
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i> Leave Group
              </button>
            ) : (
              <button
                className="btn btn-outline-success"
                onClick={handleJoin}
                disabled={loading}
              >
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
