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

    useEffect (()=>{
        servicesStats.getStats().then(data=> setStats(data))
    },[])



    return (

        <div className="container mt-5">
            <div className="card shadow" style={cardStyle}>

                <div style={overlayStyle}>
                    <div className="card-header text-center bg-transparent border-0">
                        <h2 className="text-white display-5"> STATISTICS</h2>
                        <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <div className="card-body fs-3">
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-lg-3 "><span className="list-group-item bg-transparent text-white ">
                                <i className="fa-solid fa-users"></i><p className="fw-bold text-white"> Users</p> {stats.usersRegistered}
                            </span>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <span className="list-group-item bg-transparent text-white">
                                    <i className="fa-solid fa-calendar-days"></i> <p className="fw-bold text-white"> Events:</p> {stats.eventsCount}
                                </span>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <span className="list-group-item bg-transparent text-white">
                                    <i className="fa-solid fa-user-group"></i> <p className="fw-bold text-white"> Groups:</p> {stats.groupsCount}
                                </span>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <span className="list-group-item bg-transparent text-white">
                                    <i className="fa-solid fa-calendar-check"></i> <p className="fw-bold text-white"> Reservations:</p> {stats.reservationsCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics