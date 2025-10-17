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
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    setError(data.msg || "Error updating password");
                }
            })
            .catch(() => {
                setError("Error connecting to server");
            });
    };


    return (
        <div className='row'>
            <div className='container newpassword col-sm-12 col-md-6 col-lg-12'>
                <h2 className='d-flex justify-content-center'>New password</h2>
                <form onSubmit={handleSubmit}>
                    <div className='py-1'>
                        <label htmlFor="new-password" className='form-label'>Enter new password</label>
                        <input className='form-control' id="new-password" type="password"
                            placeholder="Enter new password"
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className='py-2'>
                        <label htmlFor='confirm-password' className='form-label'>Confirm password</label>
                        <input className='form-control' id='confirm-password' type="password" placeholder="Confirm password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className='btn btn-dark w-100'>Save</button>
                </form>
                {error && <p className='alert alert-danger my-3'>{error}</p>}
                {msg && <p className='alert alert-success my-3'>{msg}</p>}
                <Link to="/" className='text-dark'>Home</Link>
            </div>
        </div>
    );
};

export default ResetPassword;