const userServices = {};
const url = import.meta.env.VITE_BACKEND_URL;

async function handleResponse(resp) {
  let data = {};
  try {
    data = await resp.json();
  } catch (_) {}
  if (!resp.ok) {
    const err = new Error(data?.error || `HTTP ${resp.status}`);
    err.status = resp.status;
    err.data = data;
    throw err;
  }
  return data;
}

userServices.requestPasswordReset = async (token, newPassword) => {
  const resp = await fetch(`${url}/api/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  return handleResponse(resp);
};

userServices.registerUser = async (formData) => {
  const resp = await fetch(`${url}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return handleResponse(resp);
};

userServices.loginUser = async ({ identifier, password }) => {
  const resp = await fetch(`${url}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return handleResponse(resp);
};

userServices.forgotPassword = async (email) => {
  const resp = await fetch(`${url}/api/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });
  return handleResponse(resp);
};

export default userServices;
