import React from "react";
import { useNavigate } from "react-router-dom";
import GroupsServices from "../Services/GroupsServices";


const EventTeamsList = ({ groups, currentUser, onUpdateGroups, eventId }) => {
  const navigate = useNavigate();

  const handleJoinLeaveGroup = async (group) => {
    const isMember = group.members?.some(member => member.id === currentUser?.id);
    const token = localStorage.getItem("token");

    try {
      let result;
      if (isMember) {
        result = await GroupsServices.leaveGroup(group.id, token);

        if (result.success) {
          onUpdateGroups((previousGroups) => {
            return previousGroups.map((g) => {
              if (g.id === group.id) {
                return {
                  ...g,
                  members: g.members.filter((m) => m.id !== currentUser.id),
                };
              }
              return g;
            });
          });
        } else {
          error(result.error || "Error leaving group");
        }

      } else {
        result = await GroupsServices.joinGroup(group.id, token);

        if (result.success) {
          onUpdateGroups((previousGroups) => {
            return previousGroups.map((g) => {
              if (g.id === group.id) {
                return {
                  ...g,
                  members: [...g.members, currentUser],
                };
              }
              return g;
            });
          });
        } else {
          error(result.error || "Error joining group");
        }
      }
    } catch (error) {
      console.error("Membership error:", error);
      error("Something went wrong");
    }
  }


  return (

    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="mb-2 mb-md-0">Participating Teams</h4>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate(`/teams?eventId=${eventId}`)}
        >
          Create group
        </button>
      </div>

      {!Array.isArray(groups) || groups.length === 0 ? (
        <p className="text-center text-muted">No teams are linked to this event yet.</p>
      ) : (
        <div className="list-group">
          {groups.map((group) => {
            const isMember = group.members?.some(m => m.id === currentUser?.id);

            return (
              <div key={group.id} className="list-group-item">
                <div className="row align-items-center text-center text-md-start">
                  <div className="col-12 col-sm-2 col-md-1 mb-2 mb-sm-0">
                    <img
                      src={group.avatar || `https://picsum.photos/40/40?random=${group.id}`}
                      alt={group.name}
                      className="rounded-circle border"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  </div>


                  <div className="col-12 col-sm-7 col-md-8">
                    <strong>{group.name}</strong>
                    <div className="text-muted small">
                      {group.members?.length || 0}/{group.max_members || 20} members
                    </div>
                  </div>

                  <div className="col-12 col-sm-3 col-md-3 text-sm-end mt-2 mt-sm-0">
                    <button
                      className={`btn btn-sm ${isMember ? "btn-danger" : "btn-outline-success"}`}
                      onClick={() => handleJoinLeaveGroup(group)}
                    >
                      {isMember ? (
                        <>
                          <i className="fa-solid fa-right-from-bracket me-1"></i> Leave
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-user-plus me-1"></i> Join
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EventTeamsList