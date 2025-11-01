import { useRef, useState } from "react";
import CardGroups from './CardGroups';
import FormGroup from './FormGroup';
import GroupDetails from './GroupsDetails';
import GroupDetailsEdit from './GroupsDetailsEdit';
import useGlobalReducer from "../../hooks/useGlobalReducer";
import './Groups.css';

const Groups = () => {
  const { store, dispatch } = useGlobalReducer();
  const group = store.activeGroup;
  const isEditMode = store.editMode;
  const detailsRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);


  return (
    <>
      <div className="container py-4 d-flex flex-column align-items-center mt-5 mt-sm-0">
        <div className="card-groups w-100 border rounded-4 shadow-sm" style={{ maxWidth: "800px" }}>
          <h1 className="text-center fw-bold mb-4 my-2">Teams List</h1>

          <CardGroups scrollRef={detailsRef} />
        </div>
        <FormGroup show={showModal} onClose={() => setShowModal(false)} />
        <button
          className="btn cta position-fixed d-flex align-items-center gap-2 botonModal"
          style={{ bottom: "30px", right: "30px", zIndex: 1040 }}
          onClick={() => setShowModal(true)}
        >
          <span style={{ fontSize: "24px", lineHeight: "1" }}>+</span>
          <span className="fw-bold">Create team</span>
        </button>
        <GroupDetails
          show={store.showGroupDetails}
          onClose={() => dispatch({ type: "setShowGroupDetails", payload: false })}
        />

        <GroupDetailsEdit
          show={store.showGroupEditor}
          onClose={() => dispatch({ type: "setShowGroupEditor", payload: false })}
        />

      </div>
    </>
  );
};

export default Groups;