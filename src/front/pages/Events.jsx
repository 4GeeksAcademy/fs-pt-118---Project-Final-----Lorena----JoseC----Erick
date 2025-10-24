import React, { useEffect, useState } from "react";
import servicesEvents from "../Services/servicesEvents";
import EventCard from "../components/EventCard";

const Events = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        servicesEvents.getAllEvents().then(setEvents);
    }, []);

    return (

        <div className="container mt-5">
            <h2 className="text-center mb-4">Upcoming Events</h2>
            <div className="row">
                {events.length === 0 ? (
                    <p className="text-center">No events found.</p>
                ) : (
                    events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Events