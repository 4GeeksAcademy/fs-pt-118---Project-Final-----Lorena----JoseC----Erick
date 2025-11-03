import React from "react";
import styles from "./Hero.module.css";
import { openModalById } from "../../utils/modalUtils";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";


const Hero = () => {

  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  
  const handleToEvents = () => {
    if (store?.isAuth) {
      navigate("/events");
    } else {
      openModalById("loginModal");
    }
  }
  const handleToTeams = () => {
    if (store?.isAuth) {
      navigate("/teams");
    } else {
      openModalById("loginModal");
    }
  }

  return (
    <section className={`${styles.hero} text-center`}>
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
          <button onClick={handleToEvents} className={`${styles.btn} ${styles.btnGhost}`}>
            Live Events
          </button>
          <button onClick={handleToTeams} className={`${styles.btn} ${styles.btnGhost}`}>
            Explore Teams
          </button>
        </div>
      </div>

      <div className={styles.bg} role="img" aria-label="Sports gear background" />
    </section>
  );
};

export default Hero;
