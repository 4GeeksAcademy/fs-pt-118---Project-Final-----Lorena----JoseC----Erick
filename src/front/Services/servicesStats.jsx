const servicesStats = {}
const url= import.meta.env.VITE_BACKEND_URL

servicesStats.getStats = async () => {
    try {
        const resp = await fetch(`${url}/api/stats/general`)
        if (!resp.ok) {
            throw new Error("Error getting statistics");
        }
        const data = await resp.json()
        return data
    }
    catch (error) {
        console.error("Error:", error);
    }
}


export default servicesStats