import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import servicesEvents from "../Services/servicesEvents";

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        servicesEvents.getAllEvents()
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading events...</p>;

    return (
        <div className="container mt-4">
            <div className="row">
                {events.map(event => (
                    <div className="col-md-4 mb-3" key={event.id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{event.name}</h5>
                                <p className="card-text">{event.description.substring(0, 100)}...</p>
                                <Link to={`/single/${event.id}`} className="btn btn-primary">Ver más</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventsList