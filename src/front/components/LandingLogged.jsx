import { useState } from "react";
import EventsServices from "../Services/EventsServices";

const LandingLogged = () => {

    const [errorMsg, setErrorMsg] = useState("");
    const [okMsg, setOkMsg] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_time: "",
        end_time: "",
    })

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault();
        EventsServices.PostEvents(formData).then(data => {
            if (data?.success) {
                setOkMsg("event created successfully")
                setTimeout(() => {
                    setOkMsg("")
                }, 3000);
            } else {
                setErrorMsg("error event created")
                setTimeout(() => {
                    setErrorMsg("")
                }, 3000);
            }

        })
    }



    return (
        <>
        
            <div className="backgroundimg">
                <div className="row">
                    <h1 className="text-white col-12 text-center fw-bolder text-shadow">Your league starts here</h1>
                    <h2 className="text-white col-12 text-center fw-bolder my-3 text-shadow">Create events, invite friends,<br />
                        compete every day.</h2>
                </div>
                <div className="row">
                    <button className="col-sm-12 col-lg-5 mx-2 btn-transparente text-nowrap"> Live events</button>
                    <button className="col-sm-12 col-lg-4 mx-2 btn-transparente">Teams</button>
                </div>
            </div>
            <div id="hero" className="backgroundimgLogged container-fluid">
                <div className="rounded-5 formgroup">
                    <h1 className="p-5 text-shadow">You can send us requests for all kinds of <br /> sporting events</h1>
                </div>
            </div>
          
            <div className="row mx-2">
                <form
                    method="POST"
                    action="/create-event"
                    onSubmit={handleSubmit}
                    className="mx-auto my-5 p-4 rounded-4 shadow-lg bg-gradient bg-light form modal-content colorModals col-12"
                    style={{ maxWidth: "600px", background: "linear-gradient(135deg, #f8f9fa, #e9ecef)" }}
                >
                    <h1 className="text-center">New Event</h1>
                    {okMsg && <div className="alert alert-success">{okMsg}</div>}
                    {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                    <h2 className="text-center mb-4 fw-bold text-primary">
                        🗓️ Create Event
                    </h2>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">Event Name</label>
                        <input
                            type="text"
                            className="form-control border-primary shadow-sm"
                            id="name"
                            name="name"
                            placeholder="e.g. Team Sync"
                            required
                            value={formData.name}
                            onChange={handleChange}
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
                            placeholder="Add a short description..."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 py-2 fw-bold text-white"
                        style={{
                            background: "linear-gradient(90deg, #0d6efd, #6610f2)",
                            border: "none",
                            transition: "transform 0.2s ease-in-out"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        🚀 Submit Event
                    </button>
                </form>
            </div>

        </>
    )
}
export default LandingLogged;