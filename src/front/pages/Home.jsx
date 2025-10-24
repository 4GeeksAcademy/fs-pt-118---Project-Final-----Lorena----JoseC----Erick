import React from "react";
import Statistics from "../components/Statistics.jsx";
import Landing from "../components/Landing.jsx";
import WhoWeAre from "../components/WhoWeAre.jsx";
import LandingLogged from "../components/LandingLogged.jsx";


export const Home = () => {


	return (
		<div className="container-fluid">
			<Landing/>
			<Statistics/>
			<LandingLogged/>
		</div>
	);
}; 