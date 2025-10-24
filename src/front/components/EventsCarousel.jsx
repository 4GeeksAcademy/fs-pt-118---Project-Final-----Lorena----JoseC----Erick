import React, { useEffect, useState } from "react";
import servicesEvents from "../Services/servicesEvents";

const EventsCarousel = () => {

  const [events, setEvents] = useState([])

  useEffect(() => {

    servicesEvents.getAllEvents().then(setEvents)
  }, [])

  return (

      <div id="eventsCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {events.map((event, index) => (
            <div key={event.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img src="https://picsum.photos/200/300" className="d-block w-100 img-fluid" alt={event.name} />
              <div className="carousel-caption d-none d-md-block">
                <h5>{event.name}</h5>
                <p>{event.description.substring(0, 50)}...</p>
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