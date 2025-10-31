import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import servicesGetEvents from "../Services/servicesGetEvents";


const EventCard = ({ event }) => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const isAuth = !!store?.isAuth

    const [isFavorite, setIsFavorite] = useState(false)
    const handleView = () => {
        navigate(`/event/${event.id}`)
    }

    useEffect(() => {
        const loadFavorites = async () => {
            if (!isAuth) return
            try {
                const result = await servicesGetEvents.getUserFavorites(token)
                const favorites = result.data || []
                const favIds = favorites.map(f => f.event_id)
                setIsFavorite(favIds.includes(event.id))
            } catch (error) {
                console.error("Error checking favorites:", error)
            }
        }
        loadFavorites();
    }, [event.id, isAuth])

    const handleFavorite = async () => {
        if (!isAuth) {
            return
        }

        try {
            const result = await servicesGetEvents.toggleFavorite(event.id, token)
            setIsFavorite(result.is_favorite)
            if (result.is_favorite) {
            } else {
            }
        } catch (error) {
            console.error("Error updating favorite:", error)
        }
    }


    return (

        <div className="col-sm-12 col-md-6 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm border-0">
                <img
                    src={event.imagen || event.image_url}
                    alt={event.name}
                    className="card-img-top object-fit-cover border"
                />

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text text-muted">
                        {event.description
                            ? event.description.substring() + "..."
                            : "No description available."}
                    </p>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleView}>
                            View +
                        </button>

                        <button
                            className={`btn btn-sm ${isFavorite ? "btn-btn-outline" : "btn-btn-outline"}`}
                            onClick={handleFavorite}
                        >
                            <i
                                className={`fa${isFavorite ? "s" : "r"} fa-heart text-${isFavorite ? "danger" : "secondary"}`}
                            ></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard