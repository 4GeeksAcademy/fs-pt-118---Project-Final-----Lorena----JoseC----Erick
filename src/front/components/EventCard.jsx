import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const EventCard = ({ event, onFavorite }) => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const isAuth = !!store?.isAuth

    const handleView = () => {
        if (!isAuth) {
            const modal = new bootstrap.Modal(document.getElementById("registerModal"));
            modal.show();
            return;
        }
        navigate(`/single/${event.id}`);
    };

    const handleFavorite = () => {
        if (!isAuth) {
            const modal = new bootstrap.Modal(document.getElementById("registerModal"));
            modal.show();
            return;
        }
        onFavorite(event.id);
    };

    return (

        <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
                <img
                    src={event.image_url || `https://picsum.photos/300/200?random=${event.id}`}
                    alt={event.name}
                    className="card-img-top object-fit-cover border"
                />

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text text-muted">
                        {event.description ? event.description.substring() + "..." : "No description available."}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <button className="btn btn-outline-secondary btn-sm" onClick={handleView}>
                            View +
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={handleFavorite}>
                            <i className="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard