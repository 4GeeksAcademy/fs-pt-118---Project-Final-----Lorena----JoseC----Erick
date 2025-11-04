import { useEffect, useState } from "react";
import GroupsServices from "../../Services/GroupsServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import Teams from "./Teams";

const CardGroups = ({ scrollRef }) => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    GroupsServices.getAll().then(res => {
      dispatch({ type: "setGroups", payload: Array.isArray(res) ? res : [] });
      setLoading(false);
    });
  }, [dispatch]);


  const groups = Array.isArray(store.groups)
    ? store.groups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div
      className="container py-4 d-flex flex-column align-items-center shadow"
      style={{ maxWidth: "800px" }}
    >
      <div className="mb-3 w-100">
        <input
          type="text"
          className="form-control"
          placeholder="Search teams by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading teams…</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-5">
          <h1 className="text-danger fw-bold mb-3">No teams available</h1>
          <p className="text-muted">Try creating one to get started!</p>
        </div>
      ) : (
        <div
          className="w-100 d-flex flex-column gap-4 overflow-auto"
          style={{ maxHeight: "70vh" }}
        >
          {groups.map((group, index) => (
            <Teams
              key={group?.id || `group-${index}`}
              group={group}
              scrollRef={scrollRef}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardGroups;