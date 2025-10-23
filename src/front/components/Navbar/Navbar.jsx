import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import Avatar from "../Avatar";
import logo from "../../assets/img/sportBar-.png";
import styles from "./Navbar.module.css";

export const Navbar =() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { store, dispatch } = useGlobalReducer();

  const user = store?.user;
  const isAuth = !!store?.isAuth;
  const role = user?.role || user?.role_name || "user";
  const avatarUrl = user?.avatar || user?.photo_url || null;
  const displayName = user?.user_name || user?.username || user?.email || "User";

  const isHome = location.pathname === "/";
  const [solid, setSolid] = useState(!isHome);

  useEffect(() => {
    if (!isHome) { setSolid(true); return; }
    const onScroll = () => setSolid(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const navState = solid ? styles.solid : styles.transparent;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.nav} ${navState}`}>
      {/* Usa este contenedor para controlar la altura animada */}
      <div className={`container ${styles.containerH} d-flex align-items-center justify-content-between`}>
        {/* Brand */}
        <Link to="/" className={`navbar-brand ${styles.brand}`}>
          {/* IMPORTANTE: no pongas w-50/h-auto de Bootstrap aquí */}
          <img src={logo} alt="SportBar League" className={styles.logo} />
          <span className={`fw-bold ${styles.brandText}`}>SportBar League</span>
        </Link>

        {/* Links centro */}
        <ul className="nav gap-4 mx-auto d-none d-md-flex">
          <li className="nav-item">
            <Link
              to="/teams"
              className={`nav-link ${styles.navLink} ${location.pathname === "/teams" ? styles.navLinkActive : ""}`}
            >
              Teams
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/events"
              className={`nav-link ${styles.navLink} ${location.pathname === "/events" ? styles.navLinkActive : ""}`}
            >
              Events
            </Link>
          </li>
        </ul>

        {/* Auth derecha */}
        {!isAuth ? (
          <button
            className="btn btn-dark fw-bold px-3"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
            type="button"
          >
            Sign in
          </button>
        ) : (
          <div className="dropdown">
            <button className="btn d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <Avatar src={avatarUrl} name={displayName} />
              <span className="fw-semibold">{displayName}</span>
              <span className="badge bg-secondary text-uppercase" style={{ letterSpacing: ".5px" }}>
                {role}
              </span>
              <i className="bi bi-caret-down-fill" aria-hidden="true" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><Link className="dropdown-item" to="/my-teams">My Teams</Link></li>
              <li><Link className="dropdown-item" to="/my-events">My Events</Link></li>
              {role === "admin" && (<>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
              </>)}
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
