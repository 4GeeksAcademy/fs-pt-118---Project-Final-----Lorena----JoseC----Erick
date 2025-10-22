import React, { useState } from "react";
import userServices from "../Services/userServices";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { forceCloseModalById } from "../utils/modalUtils"; 

const LoginModal = () => {

  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",   // <- el backend pide email o user_name
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Envío del formulario (solo lógica de autenticación + store)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    userServices.loginUser(formData)
      .then((data) => {
        if (!data?.token) {
          setErrorMsg("Invalid credentials");
          setTimeout(() => setErrorMsg(""), 3000);
          return;
        }
        // Guardar sesión y actualizar store
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        dispatch({ type: "auth", payload: { user: data.data } });
        // Cerrar modal y luego navegar a Home
        forceCloseModalById("loginModal", () => navigate("/"));
      })
      .catch((err) => {
        console.error("Error login:", err);
        setErrorMsg("Error trying to log in");
        setTimeout(() => setErrorMsg(""), 3000);
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


  return (
    <>
      <div
        className="modal "
        id="loginModal"
        aria-labelledby="loginModalLabel"
       tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content colorModals">
            <p className="modal-title text-center fs-2 fw-semibold" id="loginModalLabel">Sign in</p>

            <div className="modal-body">
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="identifier">Username or email</label>
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
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                  data-bs-dismiss="modal"
                  data-modal-chain="#forgotModal"
                >
                  Forgot password?
                </button>

                <button
                  type="button"
                  className="btn btn-link link-dark link-underline-primary p-0 text-start"
                  data-bs-dismiss="modal"
                  data-modal-chain="#registerModal"
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
