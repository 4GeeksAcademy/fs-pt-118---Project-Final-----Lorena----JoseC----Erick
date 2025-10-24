const servicesGetEvents = {}

const url = import.meta.env.VITE_BACKEND_URL

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

export default servicesGetEvents