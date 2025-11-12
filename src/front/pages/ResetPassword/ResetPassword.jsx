import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import userServices from '../../Services/userServices';
import './ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const canvasRef = useRef(null);

    useEffect(() => {
        const c = canvasRef.current;
        const ctx = c.getContext('2d', { alpha: true });

        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        const setSize = () => {
            const { innerWidth: w, innerHeight: h } = window;
            c.style.width = w + 'px';
            c.style.height = h + 'px';
            c.width = Math.floor(w * DPR);
            c.height = Math.floor(h * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        setSize();
        window.addEventListener('resize', setSize);

        const columns = Math.ceil(window.innerWidth / 18);        // ancho aproximado de columna
        const drops = Array.from({ length: columns }, () => 0);    // posición Y por columna
        const glyphs = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const font = '14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';


        const glyphColor = 'rgba(28, 152, 215, 1)';
        const trailColor = 'rgba(255,255,255,0.04)';

        ctx.shadowColor = 'rgba(106, 17, 203, 0.5)';
        ctx.shadowBlur = 8;


        let rafId;
        const step = () => {
            const { innerWidth: w, innerHeight: h } = window;

            ctx.fillStyle = trailColor;
            ctx.fillRect(0, 0, w, h);

            ctx.font = font;
            ctx.textBaseline = 'top';
            ctx.shadowColor = 'rgba(0,0,0,0.25)';
            ctx.shadowBlur = 4;

            for (let i = 0; i < drops.length; i++) {
                const x = i * 18 + 6;
                const y = drops[i] * 18;
                const char = glyphs[Math.floor(Math.random() * glyphs.length)];

                ctx.fillStyle = glyphColor;
                ctx.fillText(char, x, y);


                if (y > h && Math.random() > 0.975) {
                    drops[i] = 0;
                } else {
                    drops[i] += 1;
                }
            }

            rafId = requestAnimationFrame(step);
        };

        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        step();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', setSize);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length <= 5) {
            setError("The password must have more than 5 characters");
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
            <canvas className="bg-code-rain" ref={canvasRef} aria-hidden="true" />

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

                    <div className="py-2">
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
