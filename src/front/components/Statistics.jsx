import React, { useEffect, useState } from "react";
import servicesStats from "../Services/servicesStats";

const Statistics = () => {

    const [stats, setStats] = useState({
        usersRegistered: 0,
        groupsCount: 0,
        eventsCount: 0,
        reservationsCount: 0,
    })

    const cardStyle = {
        backgroundImage: "url('https://www.shutterstock.com/image-photo/footballer-prepares-kick-soccer-ball-600nw-2624252413.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        position: "relative",
    };

    const overlayStyle = {
        backgroundColor: "rgba(180, 177, 177, 0.35)",
        padding: "1.5rem",
        position: "relative",
    };

    useEffect(() => {
        servicesStats.getStats().then(data => setStats(data))
    }, [])



    return (

        <div className="container-fluid">
            <div className="card shadow" style={cardStyle}>
                <div style={overlayStyle}>
                    <div className="card-header text-center bg-transparent border-0">
                        <h2 className="text-white display-5 mb-1">STATISTICS</h2>
                        <i className="fa-solid fa-chart-line text-white"></i>
                    </div>

                    <div className="card-body text-white">
                        <div className="row row-cols-2 row-cols-md-2 row-cols-lg-4 g-3 g-lg-4">

                            <div className="col">
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center p-3 rounded-3  bg-transparent text-center">
                                    <i className="fa-solid fa-users fa-2x mb-2"></i>
                                    <span className="fw-semibold">Users</span>
                                    <span className="fs-3 fw-bold">{stats?.usersRegistered ?? 0}</span>
                                </div>
                            </div>

                            <div className="col">
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center p-3 rounded-3  bg-transparent text-center">
                                    <i className="fa-solid fa-calendar-days fa-2x mb-2"></i>
                                    <span className="fw-semibold">Events</span>
                                    <span className="fs-3 fw-bold">{stats?.eventsCount ?? 0}</span>
                                </div>
                            </div>

                            <div className="col">
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center p-3 rounded-3  bg-transparent text-center">
                                    <i className="fa-solid fa-user-group fa-2x mb-2"></i>
                                    <span className="fw-semibold">Groups</span>
                                    <span className="fs-3 fw-bold">{stats?.groupsCount ?? 0}</span>
                                </div>
                            </div>

                            <div className="col">
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center p-3 rounded-3  bg-transparent text-center">
                                    <i className="fa-solid fa-calendar-check fa-2x mb-2"></i>
                                    <span className="fw-semibold">Reservations</span>
                                    <span className="fs-3 fw-bold">{stats?.reservationsCount ?? 0}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Statistics