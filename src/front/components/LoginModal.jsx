import React, { useState } from "react";
import userServices from "../Services/userServices";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { forceCloseModalById, switchModals } from "../utils/modalUtils";

const LoginModal = () => {

  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    userServices.loginUser(formData)
      .then((data) => {
        if (!data?.token) {
          setErrorMsg("Invalid credentials");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        dispatch({ type: "auth", payload: { user: data.data } });
        forceCloseModalById("loginModal", () => {
          navigate("/");
        });
      })
      .catch((err) => {
        console.error("Error login:", err);
        setErrorMsg(err.msg || "Error trying to log in");
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setErrorMsg(""), 3000);
      });
  };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <div className="modal" id="loginModal" aria-labelledby="loginModalLabel" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content colorModals">
          <p className="modal-title text-center fs-2 fw-semibold" id="loginModalLabel">Sign in</p>
          <div className="modal-body">
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="identifier" className="form-label">Username or email</label>
                <input
                  className="form-control"
                  type="text"
                  id="identifier"
                  name="identifier"
                  placeholder="email or user_name"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button className="btn btn-dark w-100" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
            <div className="mt-3 d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-link link-dark link-underline-primary p-0 text-start"
                onClick={() => switchModals("loginModal", "forgotModal")}
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="btn btn-link link-dark link-underline-primary p-0 text-start"
                onClick={() => switchModals("loginModal", "registerModal")}
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginModal;