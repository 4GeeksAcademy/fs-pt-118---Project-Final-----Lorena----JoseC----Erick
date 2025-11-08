import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="page-footer" className={`${styles.footer} mt-auto`}>
      <div className="container py-4">

        <div className="row align-items-center gy-3">

          <div className="col-12 col-md-4 order-2 order-md-1 text-center text-md-start">
             <small className={styles.copy}>
              © {year} SportBar League. All rights reserved.
            </small>
          </div>

          <div className="col-12 col-md-4 order-1 order-md-2 text-center">
            <h6 className={`mb-1 ${styles.title}`}>Who we are</h6>
            <p className={`mb-0 ${styles.about}`}>
              SportBar League — community, teams and local events.
            </p>
          </div>

          <div className="col-12 col-md-4 order-3 text-center text-md-end">
            <div className={styles.social}>
              <a href="https://instagram.com" aria-label="Instagram" className={styles.ig}>
                <i className="bi bi-instagram" aria-hidden="true" />
              </a>
              <a href="https://x.com" aria-label="Twitter / X" className={styles.tw}>
                <i className="bi bi-twitter-x" aria-hidden="true" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className={styles.fb}>
                <i className="bi bi-facebook" aria-hidden="true" />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className={styles.yt}>
                <i className="bi bi-youtube" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className={styles.li}>
                <i className="bi bi-linkedin" aria-hidden="true" />
              </a>
              <a href="https://github.com" aria-label="GitHub" className={styles.gh}>
                <i className="bi bi-github" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <hr className={styles.hr} />

        <div className="row">
          <div className="col-12 text-center">
           
          </div>
        </div>
      </div>
    </footer>
  );
};
