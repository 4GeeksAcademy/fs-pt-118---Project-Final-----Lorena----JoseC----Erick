import { useState, useEffect } from "react";
import servicesGetEvents from "../../Services/servicesGetEvents";
import { toast } from "react-toastify";

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    servicesGetEvents
      .getAllEvents()
      .then((data) => setEvents(data || []))
      .catch(() => toast.error("Error fetching events"));
  }, []);

  const confirmDelete = (eventId) => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const { success, message } = await servicesGetEvents.deleteEvent(selectedEventId);
      if (success) {
        setEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
        toast.success(message || "Event deleted successfully.");
      } else {
        toast.error(message || "Failed to delete event.");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setShowModal(false);
      setSelectedEventId(null);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Event Administration</h3>
      <h6 className="text-muted mb-3">Total events: {events.length}</h6>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by event name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div className="overflow-auto" style={{ maxHeight: "600px" }}>
          <div className="d-flex flex-column gap-3">
            {filteredEvents.map((event, index) => (
              <div key={event.id || index} className="card shadow-sm border-0" style={{ borderRadius: "8px" }}>
                <div className="card-body d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex align-items-center flex-grow-1 gap-3" style={{ minWidth: "230px", flex: "1 1 250px" }}>
                    {event.imagen && (
                      <img
                        src={event.imagen || event.image_url}
                        alt={event.name}
                        className="rounded-circle border"
                        width="70"
                        height="70"
                        style={{ objectFit: "cover", flexShrink: 0 }}
                      />
                    )}
                    <div className="d-flex flex-column justify-content-center text-truncate" style={{ maxWidth: "200px" }}>
                      <h6 className="fw-semibold mb-1 text-capitalize text-truncate" style={{ lineHeight: "1.2" }}>
                        {event.name}
                      </h6>
                      <span className="text-muted small text-truncate">Status: {event.status}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column small text-muted" style={{ minWidth: "220px", flex: "1 1 200px", textAlign: "left" }}>
                    <span><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</span>
                    <span><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</span>
                  </div>

                  <div className="d-flex flex-column small text-muted text-nowrap" style={{ minWidth: "100px", flex: "0 0 auto" }}>
                    <span><strong>Groups:</strong> {event.groups?.length || 0}</span>
                    <span><strong>Comments:</strong> {event.comments?.length || 0}</span>
                  </div>

                  <div className="text-end">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => confirmDelete(event.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No events found.</p>
      )}

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Permanent Deletion</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="fw-bold text-dark">This will permanently remove the event from the system.</p>
                <p className="text-muted">
                  All associated data (groups, comments, etc.) will be deleted. This action cannot be undone.
                </p>
                <div className="text-center">
                  <img
                src="https://static.wikia.nocookie.net/gensin-impact/images/2/2d/Icon_Emoji_Paimon%27s_Paintings_01_Lumine_2.png/revision/latest?cb=20240303141251"
                alt="Lumine icon"
                style={{ width: 80, height: 80, objectFit: "contain", marginBottom: "1rem" }}
              />
                </div>
                <p className="text-danger fst-italic">Are you sure you want to continue?</p>
              </div>
              <div className="modal-footer d-flex justify-space-between gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  No, keep event
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Yes, delete permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAdmin;