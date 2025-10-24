import React from "react";
import Statistics from "../components/Statistics.jsx";
import EventsList from "../components/EventsList.jsx";
import EventsCarousel from "../components/EventsCarousel.jsx";


export const Home = () => {


	return (
		<div className="contiainer mt-5 text-center">
			<Statistics/>
			<EventsList/>
			<EventsCarousel/>
		</div>
	);
}; 