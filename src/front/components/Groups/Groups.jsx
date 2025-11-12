import { useEffect, useRef, useState } from "react";
import CardGroups from './CardGroups';
import FormGroup from './FormGroup';
import GroupDetails from './GroupsDetails';
import GroupDetailsEdit from './GroupsDetailsEdit';
import useGlobalReducer from "../../hooks/useGlobalReducer";
import './Groups.css';

const Groups = () => {
  const { store, dispatch } = useGlobalReducer();
  const detailsRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const button = document.querySelector(".botonModal");
    const checkFooter = () => {
      const footer = document.getElementById("page-footer");
      if (!footer || !button) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            button.style.opacity = "0";
            button.style.pointerEvents = "none";
          } else {
            button.style.opacity = "1";
            button.style.pointerEvents = "auto";
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(footer);
    };

    const timeout = setTimeout(checkFooter, 100);

    return () => clearTimeout(timeout);
  }, []);


  return (
    <>
      <div className="groups-scope container py-4 d-flex flex-column align-items-center mt-5 mt-sm-0">
        <div className="card-groups w-100 border rounded-4 shadow-sm py-5"  style={{ maxWidth: "100vh" }}>
          <h1 className="text-center fw-bold mb-4 my-2">Teams List</h1>

          <CardGroups scrollRef={detailsRef} />
        </div>
        <FormGroup show={showModal} onClose={() => setShowModal(false)} />
        <button
          className="btn cta position-fixed d-flex align-items-center gap-2 botonModal"
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