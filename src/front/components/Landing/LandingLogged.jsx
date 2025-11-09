import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import EventCard from "../EventCard";
import servicesGetEvents from "../../Services/servicesGetEvents"
import WhoWeAre from "./WhoWeAre";
import useGlobalReducer from "../../hooks/useGlobalReducer";
const LandingLogged = () => {
    const { store, dispatch } = useGlobalReducer()
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const isAuth = !!store?.isAuth


    useEffect(() => {
        servicesGetEvents.getAllEvents()
            .then((data) => {
                setEvents(data || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching events:", err)
                setLoading(false)
            })

        if (isAuth) {
            const token = localStorage.getItem("token")
            servicesGetEvents.getUserFavorites(token)
                .then((result) => {
                    const favorites = result.data || [];
                    dispatch({ type: 'Favorites', payload: favorites })
                })
                .catch(console.error)
        }
    }, [dispatch])

    return (
        <>
            <Hero />
            <div className="d-flex flex-column align-items-center my-5">
                <div className="row m-2 justify-content-center my-3">
                    {events.slice(0, 3).map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    <h3 className="w-100 text-center my-5 title">¡have fun discovering events!</h3>
                    {events.slice(3, 6).map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
            <div id="hero" className="backgroundimgLogged container-fluid">
                <div className="rounded-5 formgroup">
                    <h1 className="p-5 text-shadow">
                        You can send us requests for all kinds of <br /> sporting events
                    </h1>
                </div>
            </div>
            <WhoWeAre />
        </>
    );
};

export default LandingLogged;