
const userServices = {};

const url = import.meta.env.VITE_BACKEND_URL;


userServices.requestPasswordReset = async (token, newPassword) => {
    try {
        const resp = await fetch(`${url}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password: newPassword })
        });
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error("Error requesting password reset:", error);
        throw error;
    }
}


export default userServices;
