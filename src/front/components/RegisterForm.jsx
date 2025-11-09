import React, { useState, useEffect } from "react";
import userServices from "../Services/userServices";
import { forceCloseModalById, openModalById, switchModals } from "../utils/modalUtils";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  useEffect(() => {
    if (okMsg) {
      const timer = setTimeout(() => {
        forceCloseModalById("registerModal", () => openModalById("loginModal"));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [okMsg]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setOkMsg("");
    setLoading(true);
    if (!formData.user_name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg("All fields are required");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (formData.password.length <= 5) {
      setErrorMsg("The password must have more than 5 characters");
      setLoading(false);
      return;
    }
    userServices.registerUser(formData)
      .then((data) => {
        if (data?.success) {
          setOkMsg("Registration successful. You can now log in.");
        }
      })
      .catch((err) => {
        if (err.status === 409) {
          setErrorMsg(err.data?.error || "Email or username already exists");
        } else if (err.status === 400) {
          setErrorMsg(err.data?.error || "Missing required fields");
        } else {
          setErrorMsg(err.message || "Error registering user");
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setErrorMsg(""), 4000);
      });
  };
  return (
    <div className="modal" id="registerModal" aria-labelledby="registerModalLabel" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content colorModals">
          <p className="modal-title fs-2 p-2 text-center" id="registerModalLabel">Register</p>
          <div className="modal-body">
            {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}
            {okMsg && (
              <div className="alert alert-success text-center">
                {okMsg}
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={() => switchModals("registerModal", "loginModal")}
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            )}
            {!okMsg && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="user_name" className="form-label">User_name</label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    className="form-control"
                    placeholder="UserExample"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="reg_email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="reg_email"
                    name="email"
                    className="form-control"
                    placeholder="example@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="reg_password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="reg_password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={5}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <div className="form-text">Minimum 5 characters.</div>
                </div>
                <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            )}
            <div className="mt-3">
              <span className="me-1">¿You already have an account?</span>
              <button
                type="button"
                className="btn btn-link link-dark link-underline-primary p-0 text-start"
                onClick={() => switchModals("registerModal", "loginModal")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterForm;