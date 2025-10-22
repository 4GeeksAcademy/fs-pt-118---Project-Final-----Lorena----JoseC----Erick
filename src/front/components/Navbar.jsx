import React, { useMemo, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Avatar from "./Avatar";
import logo from "../assets/img/sportBar.svg";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { store, dispatch } = useGlobalReducer();

  // --- usuario memoizado ---
  const user = useMemo(() => {
    if (store?.user) return store.user;
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, [store?.user]);

  const isAuth = !!store?.isAuth || !!localStorage.getItem("token");
  const role = user?.role || user?.role_name || "user";
  const avatarUrl = user?.avatar || user?.photo_url || null;
  const displayName = user?.user_name || user?.username || user?.email || "User";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/");
  };

  // --- detectar ruta y scroll ---
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      // en otras rutas, el navbar es sólido
      setScrolled(true);
      return;
    }

    // en Home, solo cambia a sólido al hacer scroll > 100px
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // --- clase dinámica ---
  const navbarClass = (isHome && !scrolled)
    ? "navbar navbar-expand-lg navbar-transparent"
    : "navbar navbar-expand-lg navbar-solid";

  return (
    <nav className={navbarClass}>
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img className='w-50 h-auto' src={logo} alt="SportBar League logo"  />
          <span className="fw-bold brand-text">SportBar League</span>
        </Link>

        {/* Center links */}
        <ul className="nav gap-4 mx-auto d-none d-md-flex">
          <li className="nav-item">
            <Link
              to="/teams"
              className={`nav-link nav-modern ${location.pathname === "/teams" ? "active" : ""}`}
            >
              Teams
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/events"
              className={`nav-link nav-modern ${location.pathname === "/events" ? "active" : ""}`}
            >
              Events
            </Link>
          </li>
        </ul>

        {/* Right side: auth */}
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
            <button
              className="btn d-flex align-items-center gap-2"
              type="button"
              id="userMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Avatar src={avatarUrl} name={displayName} />
              <span className="fw-semibold">{displayName}</span>
              <span className="badge bg-secondary text-uppercase" style={{ letterSpacing: ".5px" }}>
                {role}
              </span>
              <i className="bi bi-caret-down-fill" aria-hidden="true" />
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userMenuButton">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><Link className="dropdown-item" to="/my-teams">My Teams</Link></li>
              <li><Link className="dropdown-item" to="/my-events">My Events</Link></li>
              {role === "admin" && (
                <>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
                </>
              )}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout} type="button">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
