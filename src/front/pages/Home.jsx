import React from "react";
import Landing from "../components/Landing.jsx";
import Statistics from "../components/Statistics.jsx";
import EventsList from "../components/EventsList.jsx";
import EventsCarousel from "../components/EventsCarousel.jsx";

import LandingLogged from "../components/LandingLogged.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const { store } = useGlobalReducer();

  return (
    <div>
      {store.isAuth ? (
        <LandingLogged />
      ) : (
        <>
          <Landing />
          <Statistics />
        </>
      )}
			<EventsList/>
			<EventsCarousel/>
    </div>
  );
};