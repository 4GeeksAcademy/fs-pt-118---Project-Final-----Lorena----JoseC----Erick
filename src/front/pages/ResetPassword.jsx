import { useSearchParams, Link } from 'react-router-dom';
import { useState } from 'react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError('');

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password: newPassword })
        });

        const data = await res.json();
        setMsg(data.msg || 'Password updated');
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