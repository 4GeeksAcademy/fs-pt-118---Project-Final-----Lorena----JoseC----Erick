import { useRef } from "react";
import CardGroups from './CardGroups';
import FormGroup from './FormGroup';
import GroupDetails from './GroupsDetails';
import GroupDetailsEdit from './GroupsDetailsEdit';
import useGlobalReducer from "../../hooks/useGlobalReducer";
import './Groups.css';

const Groups = () => {
  const { store } = useGlobalReducer();
  const group = store.activeGroup;
  const isEditMode = store.editMode;
  const detailsRef = useRef(null);

  return (
    <>
      <div className="container py-4 d-flex flex-column align-items-center mt-5 mt-sm-0">
        <div className="card-groups w-100 border rounded-4 shadow-sm" style={{ maxWidth: "800px" }}>
          <h1 className="text-center fw-bold mb-4 my-2">Teams List</h1>

          <CardGroups scrollRef={detailsRef} />
        </div>

        {store.activeGroup && (
          <div
            className="group-details w-100 mt-4"
            style={{ maxWidth: "800px" }}
            ref={detailsRef}
          >
            {isEditMode ? <GroupDetailsEdit /> : <GroupDetails />}
          </div>
        )}

        <div className="group-form w-100 mt-5" style={{ maxWidth: "600px" }}>
          <FormGroup />
        </div>
      </div>
    </>
  );
};

export default Groups;