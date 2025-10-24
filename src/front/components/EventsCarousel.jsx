import React, { useEffect, useState } from "react";
import servicesEvents from "../Services/servicesGetEvents";

const EventsCarousel = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    servicesEvents.getAllEvents().then(setEvents).catch(console.error);
  }, []);

  if (!events.length) return <p className="text-center mt-4">There are no active events</p>;

  return (

    <div id="eventsCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
      <div className="carousel-inner">
        {events.map((event, index) => (
          <div key={event.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img
              src={event.image_url || `https://picsum.photos/800/300?random=${event.id}`}
              className="d-block w-100 object-fit-cover border rounded"
              alt={event.name}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
              <h5>{event.name}</h5>
              <p>{event.description?.substring(0, 80)}...</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#eventsCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#eventsCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default EventsCarousel