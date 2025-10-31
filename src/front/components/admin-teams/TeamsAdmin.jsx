import { useEffect, useRef, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import CardGroups from "../Groups/CardGroups";
import GroupDetails from "../Groups/GroupsDetails";
import GroupDetailsEdit from "../Groups/GroupsDetailsEdit";
import servicesStats from "../../Services/servicesStats";

const TeamsAdmin = () => {
    const { store } = useGlobalReducer();
    const group = store.activeGroup;
    const isEditMode = store.editMode;
    const detailsRef = useRef(null);

    const [stats, setStats] = useState({ groupsCount: 0 });

    useEffect(() => {
        servicesStats.getStats().then(data => setStats(data));
    }, []);

    return (
        <div className="container py-4">
            <div className="text-center border-bottom pb-3 mb-4">
                <h1>Welcome to the equipment section</h1>
                <p className="fs-5 text-muted m-0">Currently registered teams in the system:
                    <span className="fs-4 fw-bold text-secondary mx-2">{stats.groupsCount}</span></p>

            </div>

            <CardGroups scrollRef={detailsRef} />
            {group && (
                <div className="d-flex justify-content-center w-100">
                    <div
                        className="group-details w-100 mt-4"
                        style={{ maxWidth: "800px" }}
                        ref={detailsRef}
                    >
                        {isEditMode ? <GroupDetailsEdit /> : <GroupDetails />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsAdmin;