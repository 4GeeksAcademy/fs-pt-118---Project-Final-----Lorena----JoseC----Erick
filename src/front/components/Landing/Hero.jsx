import React from "react";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={`${styles.hero} text-center`}>
      {/* Contenido */}
      <div className={styles.content}>
        <h1 className={styles.title}>Your league starts here</h1>
        <h2 className={styles.subtitle}>
          Create events, invite friends,
          <br />
          compete every day.
        </h2>

        <p className={styles.description}>
          Join a community of passionate athletes and sports lovers.
          Organize your own tournaments, discover new teams, and follow
          live matches — all from one platform designed to bring players together.
        </p>

        <div className={styles.actions}>
          <Link to="/events" className={`${styles.btn} ${styles.btnGhost}`}>
            Live Events
          </Link>
          <Link to="/teams" className={`${styles.btn} ${styles.btnGhost}`}>
            Explore Teams
          </Link>
        </div>
      </div>

      {/* Imagen de fondo */}
      <div className={styles.bg} role="img" aria-label="Sports gear background" />
    </section>
  );
};

export default Hero;
