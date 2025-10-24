const EventCard = ({ event }) => {

    return (
        <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow">
                <div className="card-body">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text text-muted">
                        <i className="fa-solid fa-calendar-days me-1"></i>
                        {new Date(event.start_time).toLocaleDateString()}
                    </p>
                    <p className="card-text">{event.description}</p>
                </div>
            </div>
        </div>
    )
}

export default EventCard