import React, { useState } from "react";
import TeamsAdmin from "../components/Admin/TeamsAdmin";
import UsersAdmin from "../components/Admin/UsersAdmin";
import EventsAdmin from "../components/Admin/EventsAdmin";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("teams");

    return (
        <div className="mar min-heigth-80">
            <ul className="nav nav-tabs admin-nav d-flex justify-content-center gap-2">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "teams" ? "active" : ""}`}
                        onClick={() => setActiveTab("teams")}
                    >
                        Teams
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => setActiveTab("users")}
                    >
                        Users
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "Events" ? "active" : ""}`}
                        onClick={() => setActiveTab("Events")}
                    >
                        Events
                    </button>
                </li>
            </ul>

            <div className="tab-content mt-3">
                {activeTab === "teams" && (
                    <div className="tab-pane active">
                        <TeamsAdmin />
                    </div>
                )}
                {activeTab === "users" && (
                    <div className="tab-pane active">
                        <UsersAdmin />
                    </div>
                )}
                {activeTab === "Events" && (
                    <div className="tab-pane active">
                        <EventsAdmin />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;