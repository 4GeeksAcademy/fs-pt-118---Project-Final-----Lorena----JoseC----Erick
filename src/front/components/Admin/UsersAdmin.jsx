import { useState, useEffect } from "react";
import userServices from "../../Services/userServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    userServices.getUsers()
      .then(response => setUsers(response.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const confirmDelete = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
    console.log("Deleting user with ID:", userId);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const { success, error } = await userServices.deleteUser(selectedUserId, token);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== selectedUserId));
        toast.success("User deleted successfully");
      } else {
        toast.error(error || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">User Administration</h3>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length > 0 ? (
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          <ul className="list-group">
            {filteredUsers.map((user, index) => (
              <li key={user.id || index} className="list-group-item p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-start gap-3">
                    <div className="text-center">
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt={`${user.user_name}'s avatar`}
                          className="rounded-circle mb-2"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      )}
                      <h6 className="mb-0">{user.user_name}</h6>
                    </div>

                    <div className="flex-grow-1">
                      <div className="row text-start small">
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Email:</strong> {user.email}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Role:</strong> {user.role}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Events created:</strong> {user.events_created?.length || 0}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Events joined:</strong> {user.events_joined?.length || 0}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Favorite events:</strong> {user.favorite_events?.length || 0}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Groups created:</strong> {user.groups_created?.length || 0}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Groups joined:</strong> {user.groups_joined?.length || 0}</div>
                        <div className="col-12 col-sm-6 col-md-4 mb-2"><strong>Comments:</strong> {user.comments?.length || 0}</div>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-outline-danger btn-sm" onClick={() => confirmDelete(user.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No users found.</p>
      )}

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Permanent Deletion</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="fw-bold text-dark">
                  This action will permanently remove the user from the system.
                </p>
                <p className="text-muted">
                  All associated data, events, and group memberships will be lost. There is no undo.
                </p>
                <p className="text-danger fst-italic">
                  Are you absolutely sure you want to proceed?
                </p>
                <div className="text-center mb-3">
                  <img
                    src="https://media.tenor.com/AacpQ1qfopcAAAAj/chilumi-genshin.gif"
                    alt="Tartaglia nervous reading"
                    style={{ maxWidth: "40%", borderRadius: "8px" }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  No, keep the user
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Yes, delete permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UsersAdmin;