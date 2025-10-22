import { useState } from "react";
import EventsServices from "../Services/EventsServices";

const LandingLogged = () => {



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
        EventsServices.PostEvents(formData).then(data => console.log(data))
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
            <div className="backgroundimgLogged container-fluid">
                <div className="rounded-5 formgroup">
                    <h1 className="p-5 text-shadow">You can send us requests for all kinds of <br /> sporting events</h1>
                </div>
            </div>
            <div className="p-5 formgroup m-auto my-5 row">
                <div className="col-sm-12 col-md-8 col-lg-5 container colorform p-3 border border-black rounded-5">
                    <h1 className="text-center">New Event</h1>
                    <h4 className="text-center">Your request</h4>
                    <form method="POST" action="/create-event row col-12"
                        onSubmit={handleSubmit}
                        className="container border border-black rounded-5 p-3 form">
                        <div className="col-sm-12 col-md-12 col-lg-12">

                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control"
                                id="name" name="name"
                                placeholder="Name" required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <label htmlFor="start_time" className="form-label">Start time</label>
                        <input type="datetime-local" className="form-control"
                            id="start_time" name="start_time" required
                            value={formData.start_time}
                            onChange={handleChange}
                        />
                        <label htmlFor="end_time" className="form-label">End time</label>
                        <input type="datetime-local" className="form-control"
                            id="end_time" name="end_time" required
                            value={formData.end_time}
                            onChange={handleChange}
                        />
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description"
                            name="description" placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                        <input type="submit" value="Send" className="my-3 w-100 rounded bg-dark text-white" />
                    </form>
                </div>
            </div>
        </>
    )
}
export default LandingLogged;