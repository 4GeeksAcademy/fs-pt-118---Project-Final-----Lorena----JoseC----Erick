import React, { useState } from "react";
import userServices from "../Services/userServices";
import { useNavigate } from "react-router-dom";
import { forceCloseModalById } from "../utils/modalUtils"



const ForgotPasswordModal = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setOkMsg("");
        setErrorMsg("");
        setLoading(true);

        userServices.forgotPassword({ email })
            .then((data) => {
                if (data?.msg === "Recovery email sent" || data?.ok) {
                    setOkMsg("Recovery email sent");
                    // deja ver la alerta 1seg y cierra modal
                    setTimeout(() => {
                        forceCloseModalById("forgotModal", () => navigate("/"));
                    }, 1200);
                } else {
                    setErrorMsg("Email does not exist");
                }
            })
            .catch((err) => {
                console.error("Recovery:", err);
                setErrorMsg(err?.message || "Non-existent email");
                setTimeout(()=>setErrorMsg(), 4000)
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div
                id="forgotModal"
                className="modal"
                aria-labelledby="forgotModalLabel"
                tabIndex="-1" 
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content colorModals">
                        <p className="modal-title fs-2 py-3 fw-bold text-center" id="forgotModalLabel">Forgot Password</p>
                        <div className="modal-body">
                            {okMsg && <div className="alert alert-success">{okMsg}</div>}
                            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="resetEmail" className="form-label">Your_Email</label>
                                    <input
                                        id="resetEmail"
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="Example@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        autoFocus
                                        disabled={loading}
                                    />
                                </div>

                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? "Sending..." : "Send"}
                                </button>

                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-link link-dark link-underline-primary p-0 text-start"
                                        data-bs-dismiss="modal"
                                        data-modal-chain="#loginModal"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordModal