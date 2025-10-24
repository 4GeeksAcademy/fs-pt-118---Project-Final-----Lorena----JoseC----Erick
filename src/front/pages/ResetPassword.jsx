import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import userServices from '../Services/userServices';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError('');
        setMsg('');

        userServices.requestPasswordReset(token, newPassword)
            .then(data => {
                if (data.msg === "Password updated successfully") {
                    setMsg("Password updated successfully");
                    setTimeout(() => navigate('/'), 1500);
                } else {
                    setError(data.msg || "Error updating password");
                }
            })
            .catch(() => setError("Error connecting to server"));
    };

    return (
        <div className="authShell">
            <div className="authCard">
                <h2 className="title">New password</h2>

                {msg && <div className="alert alert-success">{msg}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="new-password" className="form-label">Enter new password</label>
                        <input
                            id="new-password"
                            type="password"
                            className="form-control"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            autoFocus
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirm-password" className="form-label">Confirm password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="form-control"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className='py-2'>
                    <button type="submit" className="btn btn-dark w-100">Save</button>
                    </div>
                </form>

                <div className="mt-2">
                    <Link to="/" className="btn btn-link link-dark link-underline-primary p-0">Home</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
