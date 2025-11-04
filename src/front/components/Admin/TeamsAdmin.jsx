import { useEffect, useRef, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import CardGroups from "../Groups/CardGroups";
import GroupDetails from "../Groups/GroupsDetails";
import GroupDetailsEdit from "../Groups/GroupsDetailsEdit";

const TeamsAdmin = () => {
    const { dispatch, store } = useGlobalReducer();
    const groupsCount = Array.isArray(store.groups) ? store.groups.length : 0;

    return (
        <div className="container py-4">
            <div className="text-center border-bottom pb-3 mb-4">
                <h1>Welcome to the equipment section</h1>
                <p className="fs-5 text-muted m-0">
                    Currently registered teams in the system:
                    <span className="fs-4 fw-bold text-secondary mx-2">{groupsCount}</span>
                </p>
            </div>
            <CardGroups />
            <GroupDetails
                show={store.showGroupDetails}
                onClose={() => dispatch({ type: "setShowGroupDetails", payload: false })}
            />
            <GroupDetailsEdit
                show={store.showGroupEditor}
                onClose={() => dispatch({ type: "setShowGroupEditor", payload: false })}
            />
        </div>
    );
};

export default TeamsAdmin;