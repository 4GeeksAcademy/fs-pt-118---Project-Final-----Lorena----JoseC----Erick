const userServices = {};
const url = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (resp) => {
  let data = {};
  try {
    data = await resp.json();
  } catch (_) { }
  if (!resp.ok) {
    const err = new Error(data?.msg || `HTTP ${resp.status}`);
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

userServices.getProfile = async (token) => {
  const resp = await fetch(`${url}/api/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(resp);
}

userServices.updateProfile = async (payload, token) => {
  const resp = await fetch(`${url}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(resp);
}

userServices.getUsers = async () => {
  const resp = await fetch(`${url}/api/users`, {
    method: "GET",
  });
  return handleResponse(resp);
}

userServices.deleteUser = async (id, token) => {
  const resp = await fetch(`${url}/api/remove-account/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const data = await resp.json();

  if (resp.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data?.message || "Error deleting group" };
  }
};

export default userServices;
