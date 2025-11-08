import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import servicesGetEvents from "../Services/servicesGetEvents";
import useGlobalReducer from "../hooks/useGlobalReducer";
import EventTeamsList from "../components/EventTeamsList";
import EventComments from "../components/EventComments";

const EventDetails = () => {

  const { id } = useParams()
  const { store, dispatch } = useGlobalReducer()
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(null)
  const [groups, setGroups] = useState([])
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        let eventData = store.userEvents?.find(e => e?.id === parseInt(id));
        if (!eventData) {
          const response = await servicesGetEvents.getEventById(id);
          eventData = response;
          dispatch({
            type: "setUserEvents",
            payload: [...(store.userEvents || []), eventData],
          })
        }

        setEvent(eventData)
        let eventGroups = store.groupsEvents?.[id]
        if (!eventGroups) {
          const responseGroups = await servicesGetEvents.getEventGroups(id)
          eventGroups = responseGroups
          
          dispatch({
            type: "setEventGroups",
            payload: { eventId: id, groupsEvents: eventGroups },
          })
          
        }


        setGroups(Array.isArray(eventGroups) ? eventGroups : [])
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, dispatch])
  if (loading) return <p className="text-center mt-5">Loading event details...</p>
  if (!event) return <p className="text-center mt-5">Event not found.</p>

  return (

    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={event.imagen || event.image_url}
            alt={event.name}
            className="card-img-top object-fit-cover border m-0 w-100"
          />
        </div>

        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-start me-3 mb-2">
            <h2 className="m-0">{event.name}</h2>
            <span
              className={`badge ${event.status === "active" ? "border border-success text-success" : event.status === "pending"
                ? "bg-secondary" : event.status === "paused" ? "bg-warning text-dark" : "bg-danger"
                }`}
            >
              <i
                className={`fa ${event.status === "active" ? "fa-check-circle" : event.status === "pending"
                  ? "fa-clock" : event.status === "paused" ? "fa-pause-circle" : "fa-times-circle"
                  } me-1`}
              ></i>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <p className="text-wrap text-break">{event.description}</p>
          <p className="text-wrap text-break"><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
          <p className="text-wrap text-break"><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</p>
        </div>
      </div>

      <hr />

      <EventTeamsList
        groups={groups}
        currentUser={store.user}
        onUpdateGroups={setGroups}
        eventId={id}
      />
      <div id="hero" className="backgroundimgLogged container-fluid my-5">
        <div className="rounded-5 formgroup">
          <h1 className="p-3 fs-3 text-shadow">
            Share your thoughts about the event! Tell us about your experience, highlights and what made this competition special for you. <br /> sporting events
          </h1>
        </div>
      </div>

      <EventComments eventId={id} />

    </div>
  )
}

export default EventDetails