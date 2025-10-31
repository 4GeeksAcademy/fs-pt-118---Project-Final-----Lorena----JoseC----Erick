import { useState } from "react";
import EventsServices from "../Services/EventsServices";
import CloudinaryServices from "../Services/Cloudinary";

const EventForm = () => {

    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_time: "",
        end_time: "",
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = e => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = "";

            if (imageFile) {
                imageUrl = await CloudinaryServices.uploadEventImage(imageFile);
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                start_time: formData.start_time,
                end_time: formData.end_time,
                imagen: imageUrl,
            };

            const { success, event_id, error } = await EventsServices.createEvent(payload);

            if (success) {
                setOkMsg("Event created successfully 🎉");
                setFormData({ name: "", description: "", start_time: "", end_time: "" });
                setImageFile(null);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setErrorMsg(error || "Error creating event");
            }
        } catch (err) {
            console.error("Error al crear el evento:", err);
            setErrorMsg(err.message || "Unexpected error occurred");
        } finally {
            setIsUploading(false);
            setTimeout(() => {
                setOkMsg("");
                setErrorMsg("");
            }, 3000);
        }
    };


    return (
        <div className="container my-4 d-flex justify-content-center">

            <form
                onSubmit={handleSubmit}
                className="p-4 rounded-4 shadow-lg bg-light border border-2 border-primary w-100"
                style={{ maxWidth: "600px" }}>
                <h1 className="text-center">New Event</h1>
                {okMsg && <div className="alert alert-success">{okMsg}</div>}
                {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                <h2 className="text-center mb-4 fw-bold text-primary">Create Event</h2>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Event Name</label>
                    <input
                        type="text"
                        className="form-control border-primary shadow-sm"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Event Name"
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="start_time" className="form-label fw-semibold">Start</label>
                        <input
                            type="datetime-local"
                            className="form-control border-success shadow-sm"
                            id="start_time"
                            name="start_time"
                            required
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="end_time" className="form-label fw-semibold">End</label>
                        <input
                            type="datetime-local"
                            className="form-control border-danger shadow-sm"
                            id="end_time"
                            name="end_time"
                            required
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-semibold">Details</label>
                    <textarea
                        className="form-control border-info shadow-sm"
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What is the purpose of your event?"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="image" className="form-label fw-semibold">Event Image</label>

                    <div className="custom-file-wrapper">
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                        <label
                            htmlFor="image"
                            className="btn btn-outline-danger cta w-100"
                            style={{ cursor: "pointer" }}
                        >
                            {imageFile ? "Image selected ✅" : "Choose image"}
                        </label>
                    </div>

                    {imageFile && (
                        <div className="mt-3 text-center">
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: "200px", objectFit: "cover" }}
                            />
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn w-100 py-2 fw-bold text-white cta"
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    Submit Event
                </button>
            </form>
        </div>
    )
}

export default EventForm;