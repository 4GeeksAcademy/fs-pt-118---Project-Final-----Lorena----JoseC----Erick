import React from "react";
import Landing from "../components/Landing.jsx";
import Statistics from "../components/Statistics.jsx";
import LandingLogged from "../components/LandingLogged.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import WhoWeAre from "../components/WhoWeAre.jsx";

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <div className="container-fluid">
      {store.isAuth ? (
        <LandingLogged />
      ) : (
        <>
          <Landing />
          <Statistics />
          <WhoWeAre />
        </>
      )}
    </div>
  );
};