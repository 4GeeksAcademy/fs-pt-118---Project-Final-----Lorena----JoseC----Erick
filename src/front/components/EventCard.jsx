import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import servicesGetEvents from "../Services/servicesGetEvents";

const EventCard = ({ event }) => {

    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const isAuth = !!store?.isAuth

    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const favoriteIds = store?.favorites?.map(f => f.event_id) || [];
        setIsFavorite(favoriteIds.includes(event.id));
    }, [store?.favorites, event.id]);

    const handleView = () => {
        navigate(`/event/${event.id}`);
    };

    const handleFavorite = async () => {
        if (!isAuth) {
            const modal = new bootstrap.Modal(document.getElementById("registerModal"));
            modal.show();
            return;
        }

        try {
            const result = await servicesGetEvents.toggleFavorite(event.id, token)
            const updatedFavoriteStatus = result?.is_favorite || false
            setIsFavorite(updatedFavoriteStatus)

            let updatedFavorites;
            if (updatedFavoriteStatus) {
                updatedFavorites = [...store.favorites, { event_id: event.id }];
            } else {
                updatedFavorites = store.favorites.filter(f => f.event_id !== event.id);
            }
            dispatch({ type: 'Favorites', payload: updatedFavorites });
        } catch (error) {
            console.error("Error updating favorite:", error);
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
                        {event.description ? event.description.substring(0, 50) + "..." : "No description available."}
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