import { useEffect, useState } from "react";
import GroupsServices from "../../Services/GroupsServices";
import Teams from "./Teams";

const CardGroups = ({ scrollRef }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GroupsServices.getAll().then(res => {
      if (Array.isArray(res)) {
        setGroups(res);
      } else {
        setGroups([]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div
      className="container py-4 d-flex flex-column align-items-center shadow"
      style={{ maxWidth: "800px" }}
    >
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
        <div className="w-100 d-flex flex-column gap-4">
          {groups.map(group => (
            <Teams key={group.id} group={group} scrollRef={scrollRef}/>
          ))}
        </div>
      )}
    </div>

  );
};

export default CardGroups;

