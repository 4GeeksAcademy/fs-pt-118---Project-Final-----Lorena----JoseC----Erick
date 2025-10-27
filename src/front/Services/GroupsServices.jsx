const GroupsServices = {}
const url = import.meta.env.VITE_BACKEND_URL

const getAuthHeaders = (extraHeaders = {}) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + localStorage.getItem("token"),
  ...extraHeaders,
});


GroupsServices.getAll = async () => {
  try {
    const resp = await fetch(`${url}/api/groups`)
    if (!resp.ok) {
      throw new Error("Error getting Groups");
    }
    const { success, data } = await resp.json();
    if (!success || !Array.isArray(data)) {
      throw new Error("Respuesta inesperada del servidor");
    }
    return data;
  }
  catch (error) {
    return { success: false, error: error.message };
  }
}


GroupsServices.newGroup = async (groupData, token) => {
  try {
    const res = await fetch(`${url}/api/groups`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(groupData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Error creating group" };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error creating group:", err);
    return { success: false, error: err.message };
  }
};

GroupsServices.updateGroup = async (groupId, groupData, token) => {
  try {
    const res = await fetch(`${url}/api/groups/${groupId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(groupData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Error updating group" };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error updating group:", err);
    return { success: false, error: err.message };
  }
};

GroupsServices.joinGroup = async (groupId, token) => {
  const resp = await fetch(`${url}/api/groups/${groupId}/join`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await resp.json();

  if (resp.ok) {
    return { success: true, data };
  } else {
    return {
      success: false,
      error: data?.message || "Error joining group",
    };
  }
};

GroupsServices.leaveGroup = async (groupId, token) => {
  const resp = await fetch(`${url}/api/groups/${groupId}/leave`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await resp.json();

  if (resp.ok) {
    return { success: true, data };
  } else {
    return {
      success: false,
      error: data?.message || "Error leaving group",
    };
  }
};


GroupsServices.deleteGroup = async (groupId, token) => {
  const resp = await fetch(`${url}/api/groups/${groupId}`, {
    method: "DELETE",
    headers: getAuthHeaders({}),
  });

  const data = await resp.json();

  if (resp.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data?.message || "Error deleting group" };
  }
};
export default GroupsServices;