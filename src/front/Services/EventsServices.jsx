const EventsServices = {}
const url = import.meta.env.VITE_BACKEND_URL


const getAuthHeaders = (extraHeaders = {}) => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    ...extraHeaders,
});

EventsServices.createEvent = async (eventData) => {
    try {
        const res = await fetch(`${url}/api/create-event`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(eventData),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.message || "Error creating event" };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Error creating event:", err);
        return { success: false, error: err.message };
    }
};




export default EventsServices;