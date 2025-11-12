import React, { useState, useEffect } from "react";
import GroupsServices from "../Services/GroupsServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import servicesGetEvents from "../Services/servicesGetEvents";

const EventTeamsList = ({ groups, currentUser, onUpdateGroups, eventId }) => {

  const [showGroupsDropdown, setShowGroupsDropdown] = useState(false)
  const { store, dispatch } = useGlobalReducer()

  const toggleDropdown = () => setShowGroupsDropdown(!showGroupsDropdown)

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const data = await servicesGetEvents.getAllUserGroups()
        dispatch({ type: "setUserGroups", payload: data })
      } catch (error) {
        console.error("Error loading user groups:", error)
      }
    }
    if (!store.userGroups || store.userGroups.length === 0) { fetchUserGroups() }
  }, [])

  const handleAddGroup = async (group) => {
    const result = await servicesGetEvents.addGroupToEvent(eventId, group.id)
    if (result.success) {
      onUpdateGroups((prev) => [...prev, result.data])
      setShowGroupsDropdown(false)
    } else {
      alert(`${result.message}`)
    }
  }

  const handleJoinLeaveGroup = async (group) => {
    const isMember = group.members?.some(member => member.id === currentUser?.id)
    const isOwner = group.user_id === currentUser?.id
    const token = localStorage.getItem("token")

    try {
      if (isMember) {
        if (isOwner) {
          const removeResult = await servicesGetEvents.removeGroupFromEvent(eventId, group.id)
          if (removeResult.success) {
            onUpdateGroups((prevGroups) => prevGroups.filter((g) => g.id !== group.id))
          } else {
            alert("Error removing your group from event: " + removeResult.message)
          }
        } else {
          const result = await GroupsServices.leaveGroup(group.id, token)
          if (result.success) {
            onUpdateGroups((prevGroups) =>
              prevGroups.map((g) =>
                g.id === group.id
                  ? { ...g, members: g.members.filter((m) => m.id !== currentUser.id) }
                  : g
              )
            )
          }
        }
      } else {
        const result = await GroupsServices.joinGroup(group.id, token)
        if (result.success) {
          onUpdateGroups((prevGroups) =>
            prevGroups.map((g) =>
              g.id === group.id ? { ...g, members: [...g.members, currentUser] } : g
            )
          )
        }
      }
    } catch (error) {
      console.error("Error with group:", error)
    }
  }

  return (

    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="mb-2 mb-md-0">Participating Teams</h4>

        <div className="dropdown">
          <button
            className="btn btn-outline cta btn-sm dropdown-toggle"
            type="button"
            onClick={toggleDropdown}
          >
            Add Group
          </button>

          <div className={`dropdown-menu ${showGroupsDropdown ? "show" : ""}`}>
            <h6 className="dropdown-header">Your Created Groups</h6>
            {store.userGroups?.length === 0 ? (
              <p className="dropdown-item">No groups created yet</p>
            ) : (
              store.userGroups.map((group) => (
                <button
                  key={group.id}
                  className="dropdown-item"
                  onClick={() => handleAddGroup(group)}
                >
                  {group.name}
                </button>
              ))
            )}
          </div>
        </div>
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
                      {group.members?.length || 0}/{group.max_members || 10} members
                    </div>
                  </div>

                  <div className="col-12 col-sm-3 col-md-3 text-sm-end mt-2 mt-sm-0">
                    <button
                      className={`btn btn-sm ${isMember ? "btn-danger" : "btn-outline-success cta"}`}
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