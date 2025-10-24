const EventsServices = {}
const url = import.meta.env.VITE_BACKEND_URL

EventsServices.PostEvents = async (formData) => {
    try {
        const resp = await fetch(`${url}/api/create-event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(formData),
        });
        if (!resp.ok) throw new Error('error registering')
        const data = await resp.json()
        return data

    } catch (error) {
        console.error("Error al crear el evento:", error);
        throw error;
    }

}


export default EventsServices;