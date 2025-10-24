import React from "react";
import Landing from "../components/Landing.jsx";
import Statistics from "../components/Statistics.jsx";
import LandingLogged from "../components/LandingLogged.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <div container-fluid>
      {store.isAuth ? (
        <LandingLogged />
      ) : (
        <>
          <Landing />
          <Statistics />
        </>
      )}
    </div>
  );
};