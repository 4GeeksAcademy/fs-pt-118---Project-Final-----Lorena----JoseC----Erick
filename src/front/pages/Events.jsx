import React, { useEffect, useState } from "react";
import servicesGetEvents from "../Services/servicesGetEvents";
import EventCard from "../components/EventCard";
import EventsCarousel from "../components/EventsCarousel";
import useGlobalReducer from "../hooks/useGlobalReducer";
import EventForm from "../components/EventForm";

const Events = () => {

    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const { store, dispatch } = useGlobalReducer()
    const isAuth = !!store?.isAuth
    const [showForm, setShowForm] = useState(false)

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
                    dispatch({ type: 'SET_FAVORITES', payload: favorites })
                })
                .catch(console.error)
        }
    }, [isAuth, dispatch])

    if (loading) return <p className="text-center mt-5">Loading Events...</p>

    return (

        <div className="container mt-5 pt-5">
            <h2 className="text-center mb-4">Events of the week</h2>
            <EventsCarousel events={events} />

            <h3 className="text-center my-5">Explore all events</h3>
            <div className="row">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
            <button
                className="btn cta position-fixed d-flex align-items-center gap-2 botonModal"
                style={{ bottom: "30px", right: "30px", zIndex: 1040 }}
                onClick={() => setShowForm(true)}
            >
                <span style={{ fontSize: "24px", lineHeight: "1" }}>+</span>
                <span className="fw-bold">Create Event</span>
            </button>

            <EventForm
                show={showForm}
                onClose={() => setShowForm(false)}
            />
        </div>
    )
}

export default Events