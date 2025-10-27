import React, { useEffect, useState } from "react";
import servicesGetEvents from "../Services/servicesGetEvents";
import EventCard from "../components/EventCard";
import EventsCarousel from "../components/EventsCarousel";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Events = () => {

    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { store } = useGlobalReducer();
    const isAuth = !!store?.isAuth;

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

    if (loading) return <p className="text-center mt-5">Loading Events...</p>;

    return (

        <div className="container mt-5 pt-5">
            <h2 className="text-center mb-4">Events of the week</h2>
            <EventsCarousel />

            <h3 className="text-center my-5">Explore all events</h3>
            <div className="row">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} onFavorite={handleFavorite} />
                ))}
            </div>
        </div>
    )
}

export default Events