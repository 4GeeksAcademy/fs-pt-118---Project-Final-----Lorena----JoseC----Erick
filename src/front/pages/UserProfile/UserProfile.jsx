import React, { useEffect, useState, useRef } from "react";
import userServices from "../../Services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import styles from "./UserProfile.module.css";
import FormGroup from "../../components/Groups/FormGroup"
import Avatar from "../../components/Avatar/Avatar";
import Teams from "../../components/Groups/Teams";
import GroupDetailsEdit from "../../components/Groups/GroupsDetailsEdit";
import GroupDetails from "../../components/Groups/GroupsDetails";
import EventForm from "../../components/EventForm";
import { openModalById, forceCloseModalById } from "../../utils/modalUtils";
import AvatarModal from "../../components/Avatar/AvatarModal";
import { useNavigate } from "react-router-dom";
import servicesGetEvents from "../../Services/servicesGetEvents";

const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const detailsRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user_name: store?.user?.user_name || "",
    email: store?.user?.email || "",
    avatar: store?.user?.avatar || "",
  });

  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [okMsg, setOkMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);


  const activeGroup = store.activeGroup;
  const isEditMode = store.editMode;



  useEffect(() => {
    if (activeGroup || isEditMode) {
      setShowCreateGroup(false);
      setShowCreateEvent(false);
    }
  }, [activeGroup, isEditMode]);


  useEffect(() => {
    setLoading(true);

    userServices.getProfile(token)
      .then((resp) => {
        if (!resp?.success) {
          setErrorMsg("Error loading profile");
          return;
        }
        const { user, groups, events } = resp;

        setForm({
          user_name: user?.user_name || "",
          email: user?.email || "",
          avatar: user?.avatar || "",
        });

        // Si el usuario no tiene avatar dicBear asignado, colocamos uno por defecto
        if (!user?.avatar && user?.user_name) {
          const fallback = `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(user.user_name)}`;
          setForm((prev) => ({ ...prev, avatar: fallback }));
        }

        setEvents(events);
        setGroups(groups);

        dispatch({ type: "setUserEvents", payload: events });
        dispatch({ type: "setUserGroups", payload: groups });
        dispatch({ type: "auth", payload: { user } });
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch(() => setErrorMsg("Error loading profile"))
      .finally(() => setLoading(false));

    servicesGetEvents.getUserFavorites(token)
      .then(favResp => {
        if (favResp?.success) {
          setFavorites(favResp.data)
          dispatch({ type: "Favorites", payload: favResp.data })
        }
      })
  }, [dispatch, token]);

  useEffect(() => {
    setGroups(store.userGroups);
    setEvents(store.userEvents);
  }, [store.userGroups, store.userEvents]);

  const handleSave = () => {
    setOkMsg("");
    setErrorMsg("");

    const payload = {
      user_name: form.user_name,
      avatar: form.avatar || null,
    };

    userServices.updateProfile(payload, token)
      .then((resp) => {
        if (resp.success) {
          const user = resp.data;
          setForm({
            user_name: user.user_name || "",
            email: user.email || "",
            avatar: user.avatar || "",
          });

          dispatch({ type: "auth", payload: { user } });
          localStorage.setItem("user", JSON.stringify(user));

          setOkMsg("Profile updated successfully ✅");
          setTimeout(() => setOkMsg(""), 3000);
        } else {
          setErrorMsg("Error updating profile");
        }
      })
      .catch(() => setErrorMsg("Error updating profile"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOnSelect = (value) => {
    setForm((prev) => ({ ...prev, avatar: value }));
  };

  const handleRemoveFavorite = async (eventId) => {
    try {
      const result = await servicesGetEvents.toggleFavorite(eventId, token)
      if (result?.is_favorite === false) {
        const updatedFavorites = favorites.filter(f => f.event_id !== eventId)
        setFavorites(updatedFavorites);
        dispatch({ type: "Favorites", payload: updatedFavorites })
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  return (
    <>
      <div className={`container py-4 py-md-5 mt-5  ${styles.shell}`}>
        <div className={styles.card}>

          <div className="row g-5 mt-1 align-items-center ">
            <div className="col-12 col-md-4 text-center">
              <div className={styles.avatarWrap}>
                <Avatar
                  src={form.avatar}
                  name={form.user_name}
                  size={180}
                />
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm cta-small"
                  onClick={() => openModalById("avatarModal")}
                >
                  Change Avatar
                </button>

              </div>
            </div>
            <div className="col-12 col-md-8">

              {okMsg && <p className="alert alert-success">{okMsg}</p>}
              {errorMsg && <p className="alert alert-danger">{errorMsg}</p>}

              <div className="d-flex justify-content-between" >
                <h2 className={styles.title}>Edit Profile</h2>
                <button className="btn p-2 mt-2 cta" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-12">
                  <label className="form-label fw-bold">User Name</label>
                  <input
                    type="text"
                    name="user_name"
                    className={`form-control ${styles.input}`}
                    value={form.user_name || store?.user_name}
                    onChange={handleChange}
                    placeholder="user name"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className={`form-control ${styles.input}`}
                    value={form.email}
                    disabled
                  />
                </div>
              </div>

              <div className={`d-flex align-items-center justify-content-center gap-2 mt-3 ${styles.tabs}`}>
                <button
                  className={`${styles.tabBtn} ${tab === "events" ? styles.active : ""}`}
                  onClick={() => setTab("events")}
                >
                  Events
                </button>
                <button
                  className={`${styles.tabBtn} ${tab === "groups" ? styles.active : ""}`}
                  onClick={() => setTab("groups")}
                >
                  Teams
                </button>
                <button
                  className={`${styles.tabBtn} ${tab === "favorites" ? styles.active : ""}`}
                  onClick={() => setTab("favorites")}
                >
                  Favorites
                </button>
              </div>
            </div>
          </div>

          <div className="container mt-4">
            {tab === "events" && (
              <div className={styles.panel}>
                <div className="d-flex justify-content-between align-items-center px-2">
                  <h6 className="fw-bold m-2">Your Events</h6>
                  <small className="mx-2"> start-events</small>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '400px', paddingBottom: '60px' }}>
                  {events.length ? (
                    <ul className={`mt-2 ${styles.list}`}>
                      {events.map((ev) => (
                        <li
                          key={ev.id}
                          className={styles.item}
                          onClick={() => navigate(`/event/${ev.id}`)}
                        >
                          <div className={styles.info}>
                            <div className="d-flex text-center ">

                            <img
                              src={ev.imagen}
                              alt={ev.name}
                              className={styles.favoriteImg}
                              />
                            <span className={`${styles.name} text-truncate truncate-sm`}>{ev.name}</span>
                              </div>
                            {ev.start_time && (
                              <span className={styles.date}>
                                {new Date(ev.start_time).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.empty}>No events yet.</p>
                  )}
                </div>
                <div className="fixed-bottom w-100 text-center my-3">
                  <button
                    className="btn w-75 cta"
                    onClick={() => setShowEventModal(true)}
                  >
                    {showCreateEvent ? "Close Event" : "Create Event"}
                  </button>
                </div>
              </div>
            )}

            {tab === "groups" && (
              <div className={styles.panel}>
                <h6 className="fw-bold m-2">Your Teams</h6>
                <div className="overflow-y-auto" style={{ maxHeight: '400px', paddingBottom: '60px' }}>
                  {groups?.length > 0 &&
                    groups?.map((group) => (
                      <Teams key={group.id} group={group} scrollRef={detailsRef} />
                    ))
                  }
                  {groups?.length === 0 && (
                    <p className={styles.empty}>No groups yet.</p>
                  )}
                </div>
                <div className="fixed-bottom w-100 text-center my-3">
                  <button
                    className="btn w-75 cta"
                    onClick={() => setShowModal(true)}
                  >
                    {showCreateGroup ? "Close Form" : "Create Group"}
                  </button>
                </div>
              </div>
            )}

            {tab === "favorites" && (
              <div className={styles.panel}>
                <div className="d-flex justify-content-between align-items-center px-2">
                  <h6 className="fw-bold m-2">Your Favorite Events</h6>
                </div>

                {store?.favorites?.length ? (
                  <ul className={styles.list}>
                    {store.favorites.map((fav) => (
                      <li
                        key={fav.event_id}
                        className={`${styles.item} d-flex align-items-center justify-content-between`}
                      >
                        <div
                          className="d-flex align-items-center"
                          onClick={() => navigate(`/event/${fav.event_id}`)}
                          role="button"
                        >
                          <img
                            src={fav.image}
                            alt={fav.name}
                            className={styles.favoriteImg}
                          />
                          <div className={styles.info}>
                            <span className={`${styles.name}`}>{fav.name}</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleRemoveFavorite(fav.event_id)}
                        >
                          <i className="fa-solid fa-xmark text-danger"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.empty}>No favorites yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center w-100">
        <FormGroup show={showModal} onClose={() => setShowModal(false)} />
        <EventForm show={showEventModal} onClose={() => setShowEventModal(false)} />

      </div>
      <AvatarModal
        id="avatarModal"
        current={form.avatar}
        userName={form.user_name}
        onSelect={handleOnSelect}
      />
      <GroupDetails
        show={store.showGroupDetails}
        onClose={() => dispatch({ type: "setShowGroupDetails", payload: false })}
      />
      <GroupDetailsEdit
        show={store.showGroupEditor}
        onClose={() => dispatch({ type: "setShowGroupEditor", payload: false })}
      />
    </>
  );
};

export default Profile;
