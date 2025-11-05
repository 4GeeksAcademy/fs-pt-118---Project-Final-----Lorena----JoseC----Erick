const servicesGetEvents = {}

const url = import.meta.env.VITE_BACKEND_URL

//----------------------------------------------Events----------------------------------------------------------
servicesGetEvents.getAllEvents = async () => {

    try {
        const resp = await fetch(`${url}/api/events`)
        if (!resp.ok) throw new Error("Failed to fetch events")
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}


servicesGetEvents.getEventById = async (eventId) => {
    try {
        const resp = await fetch(`${url}/api/events/${eventId}`);
        if (!resp.ok) throw new Error("Failed to fetch event");
        const data = await resp.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching event:", error);
        return null;
    }
}


servicesGetEvents.getEventGroups = async (eventId) => {
    try {
        const resp = await fetch(`${url}/api/events/${eventId}/groups`)
        if (!resp.ok) throw new Error("Failed to fetch groups for event")

        const data = await resp.json()
        if (data && Array.isArray(data.data)) {
            return data.data
        } else {
            console.warn("Unexpected format", data)
            return []
        }
    } catch (error) {
        console.error("Error fetching event groups:", error)
        return [];
    }
}

//------------------------------------Favorites Events---------------------------------------------------------

servicesGetEvents.toggleFavorite = async (eventId, token) => {
    if (!token) throw new Error("No token provided for toggleFavorite");

    try {
        const response = await fetch(`${url}/api/favorites/${eventId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(`Error toggling favorite: ${response.status} ${response.statusText}`);
            return null
        }

        return response.json();
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return null;
    }
}

servicesGetEvents.getUserFavorites = async (token) => {
    if (!token) {
        console.warn("No token provided for getUserFavorites");
        return [];
    }

    try {
        const response = await fetch(`${url}/api/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(`Error fetching favorites: ${response.status} ${response.statusText}`);
            return [];
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
}

//----------------------------------------------Comments Events----------------------------------------------------------

servicesGetEvents.getComments = async (eventId, token) => {
    try {
        const response = await fetch(`${url}/api/events/${eventId}/comments`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error("Failed to fetch comments")
        return response.json();
    } catch (error) {
        console.error("Error fetching comments:", error)
        throw error
    }
}

servicesGetEvents.addComment = async (eventId, content, token, user_name) => {
    try {
        const response = await fetch(`${url}/api/events/${eventId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content, user_name })
        });

        if (!response.ok) throw new Error("Failed to add comment");
        return response.json();
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

servicesGetEvents.updateComment = async (commentId, content, token) => {
    try {
        const response = await fetch(`${url}/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error("Failed to update comment")
        return response.json()
    } catch (error) {
        console.error("Error updating comment:", error)
        throw error
    }
}

servicesGetEvents.deleteComment = async (commentId, token) => {
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const response = await fetch(`${url}/api/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errMsg = await response.text();
            throw new Error(errMsg || "Failed to delete comment");
        }
        return response.json();
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

//---------------------------------------- Get User Groups -----------------------------------+----------------

servicesGetEvents.getAllUserGroups = async () => {
    try {
        const token = localStorage.getItem("token")
        if (!token) { throw new Error("No token provided") }
        const resp = await fetch(`${url}/api/user/groups`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        if (!resp.ok) { throw new Error("Failed to fetch user groups") }
        const data = await resp.json()
        if (!Array.isArray(data)) {
            throw new Error("Unexpected response")
        }
        return data
    } catch (error) {
        console.error("Error fetching user groups:", error)
        return []
    }
}

servicesGetEvents.addGroupToEvent = async (eventId, groupId) => {
    try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token provided")
        const resp = await fetch(`${url}/api/events/${eventId}/add-group/${groupId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await resp.json()
        if (!resp.ok) throw new Error(data.message || "Error adding group")
        return data
    } catch (error) {
        console.error("Error adding group to event:", error)
        return { success: false, message: error.message }
    }
}

export default servicesGetEvents