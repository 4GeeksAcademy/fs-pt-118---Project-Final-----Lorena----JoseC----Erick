import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import Avatar from "../Avatar/Avatar";
import logo from "../../assets/img/sportBar-.png";
import styles from "./Navbar.module.css";
import { randomAvatarBg } from "../../utils/PaletteColors";
import { openModalById } from "../../utils/modalUtils";

export const Navbar = () => {
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

  const [avatarBg] = useState(() => randomAvatarBg());

  useEffect(() => {
    if (!isHome) { setSolid(true); return; }
    const onScroll = () => setSolid(window.scrollY > 500);
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
   /*  window.location.reload(); */
  };

  const goToLogin = (e, to) => {
    if (!isAuth) {
      e.preventDefault();
      openModalById("loginModal");
      return;
    }
  }

  return (
    <nav className={`navbar navbar-expand-lg ${styles.nav} ${navState}`}>
      <div className={`container ${styles.containerH}`}>
       
        <Link to="/" className={`navbar-brand ${styles.brand}`}>
          <img src={logo} alt="SportBar League" className={styles.logo} />
          <span className={`fw-bold ${styles.brandText}`}>SportBar League</span>
        </Link>
        
        <ul className={`nav gap-3 ${styles.navCenter}`}>
          <li className="nav-item">
            <Link
              to="/teams"
              onClick={(e) => goToLogin(e, "/teams")}
              className={`nav-link ${styles.navLink} ${location.pathname === "/teams" ? styles.navLinkActive : ""}`}
            >
              Teams
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/events"
              onClick={(e) => goToLogin(e, "/events")}
              className={`nav-link ${styles.navLink} ${location.pathname === "/events" ? styles.navLinkActive : ""}`}
            >
              Events
            </Link>
          </li>
        </ul>
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
              <Avatar src={avatarUrl} name={displayName} bgClass={avatarBg} />
              <span className={`fw-semibold text-capitalize ${styles.hideOnMobile} ${solid ? styles.textDark : styles.textLight}`}>
                {displayName}
              </span>

              {/* caret: también oculto en móvil */}
              <i className={`bi bi-caret-down-fill ${styles.hideOnMobile}`} aria-hidden="true" />
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${styles.dropdownMenu}`}>
              <li><Link className={`dropdown-item ${styles.dropdownItem}`} to="/profile">Profile</Link></li>
          
              {role === "admin" && (
                <>
                  <li><hr className={`dropdown-divider ${styles.dropdownDivider}`} /></li>
                  <li><Link className={`dropdown-item ${styles.dropdownItem}`} to="/admin">Admin Panel</Link></li>
                </>
              )}
              <li><hr className={`dropdown-divider ${styles.dropdownDivider}`} /></li>
              <li>
                <button className={`dropdown-item ${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
