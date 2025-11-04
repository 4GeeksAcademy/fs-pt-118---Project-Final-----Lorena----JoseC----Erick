import React from "react";
import Landing from "../components/Landing/Landing.jsx";
import Statistics from "../components/Landing/Statistics.jsx";


import LandingLogged from "../components/Landing/LandingLogged.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import WhoWeAre from "../components/Landing/WhoWeAre.jsx";

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <>
      {store.isAuth ? (
        <LandingLogged />
      ) : (
        <>
          <Landing />
          <Statistics />
          <WhoWeAre />
        </>
      )}

    </>
  );
};