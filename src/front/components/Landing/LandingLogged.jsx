import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import EventCard from "../EventCard";
import servicesGetEvents from "../../Services/servicesGetEvents"
import WhoWeAre from "./WhoWeAre";
const LandingLogged = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);



    const handleFavorite = (eventId) => {
        if (!isAuth) {
            const modal = new bootstrap.Modal(document.getElementById("registerModal"));
            modal.show();
            return;
        }

        setFavorites((prev) =>
            prev.includes(eventId)
                ? prev.filter((id) => id !== eventId)
                : [...prev, eventId]
        );
    };

    useEffect(() => {
        servicesGetEvents.getAllEvents()
            .then((data) => {
                setEvents(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching events:", err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Hero />
            <div className="d-flex flex-column align-items-center my-5">
                <div className="row m-2 justify-content-center my-3">
                    {events.slice(0, 3).map((event) => (
                        <EventCard key={event.id} event={event} onFavorite={handleFavorite} />
                    ))}
                    <h3 className="w-100 text-center my-5">¡have fun discovering events!</h3>
                    {events.slice(3, 6).map((event) => (
                        <EventCard key={event.id} event={event} onFavorite={handleFavorite} />
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