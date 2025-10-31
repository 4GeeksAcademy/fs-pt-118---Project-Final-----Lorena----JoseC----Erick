import React, { useEffect, useState, useRef } from "react";
import userServices from "../../Services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import styles from "./UserProfile.module.css";
import FormGroup from "../../components/Groups/FormGroup"
import Avatar, { AVATAR_MAP, inferNumberFromUrl } from "../../components/Avatar/Avatar";
import Teams from "../../components/Groups/Teams";
import GroupDetailsEdit from "../../components/Groups/GroupsDetailsEdit";
import GroupDetails from "../../components/Groups/GroupsDetails";
import EventForm from "../../components/EventForm";
import { openModalById, forceCloseModalById } from "../../utils/modalUtils";
import AvatarModal from "../../components/Avatar/AvatarModal";

const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const detailsRef = useRef(null);
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    user_name: store?.user?.user_name || "",
    email: store?.user?.email || "",
    avatar: store?.user?.avatar || "",
  });
  const [avatarNumber, setAvatarNumber] = useState("5");
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tab, setTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [okMsg, setOkMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

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

    userServices.getProfile(token).then((resp) => {
      if (!resp?.success) {
        setErrorMsg("Error loading profile");
        return;
      }
      const { user, groups, events } = resp;

      const num = inferNumberFromUrl(user?.avatar);
      const isPreset = num && AVATAR_MAP[num];

      setForm({
        user_name: user?.user_name || "",
        email: user?.email || "",
        avatar: isPreset ? AVATAR_MAP[num] : (user?.avatar || ""),
      });
      setAvatarNumber(isPreset ? String(num) : null);

      setEvents(events);
      setGroups(groups);

      dispatch({ type: "setUserEvents", payload: events });
      dispatch({ type: "setUserGroups", payload: groups });
      dispatch({ type: "auth", payload: { user } });
      localStorage.setItem("user", JSON.stringify(user));
    })
      .catch(() => setErrorMsg("Error loading profile"))
      .finally(() => setLoading(false));
  }, [dispatch, token]);

  const handleSave = () => {
    setOkMsg("");
    setErrorMsg("");

    const payload = {
      user_name: form.user_name,
      password: form.password,
      avatar: (form.avatar || null),
    };

    userServices
      .updateProfile(payload, token)
      .then((resp) => {
        console.log(resp);
        if (resp.success) {
          const user = resp.data;

          const num = inferNumberFromUrl(user?.avatar);
          const isPreset = num && AVATAR_MAP[num];

          setForm({
            user_name: user.user_name || "",
            email: user.email || "",
            avatar: isPreset ? AVATAR_MAP[num] : (user?.avatar || ""),
          });
          setAvatarNumber(isPreset ? String(num) : null);
          console.log("numerooooooo->>>>>>:", num);
          console.log("i->>>>>>:", isPreset);
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

  const looksLikeUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

  const handleOnSelect = (value) => {
    if (looksLikeUrl(value)) {
      // Selección personalizada (Cloudinary)
      setAvatarNumber(null);
      setForm((prev) => ({ ...prev, avatar: value }));
    } else {
      // select predefinida
      setAvatarNumber(String(value));
      setForm((prev) => ({ ...prev, avatar: AVATAR_MAP[value] }));
    }
  };

  const handleShowCreateGroup = () => {
    setShowCreateGroup((prev) => !prev);
    if (!showCreateGroup) {
      setShowCreateEvent(false);
      dispatch({ type: "toggleGroup", payload: { group: null } });
      dispatch({ type: "setEditMode", payload: false });
    }
  };

  const handleShowCreateEvent = () => {
    setShowCreateEvent((prev) => !prev);
    if (!showCreateEvent) {
      setShowCreateGroup(false);
      dispatch({ type: "toggleGroup", payload: { group: null } });
      dispatch({ type: "setEditMode", payload: false });
    }
  };

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
                  className={styles.avatar}
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
              </div>
            </div>
          </div>

          <div className="container mt-4">
            {tab === "events" && (
              <div className={styles.panel}>
                <h6 className="fw-bold m-2">Your Events</h6>

                {events.length ? (
                  <ul className={styles.list}>
                    {events.map((ev) => (
                      <li key={ev.id} className={styles.item}>
                        <i className="fa-solid fa-calendar-day me-2" />
                        <span className="me-auto">{ev.name}</span>
                        {ev.start_time && (
                          <span className={styles.date}>
                            {new Date(ev.start_time).toLocaleDateString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.empty}>No events yet.</p>
                )}
                <div className="fixed-bottom w-100 text-center my-3">
                  <button
                    className="btn w-75 cta"
                    onClick={handleShowCreateEvent}
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
                    onClick={handleShowCreateGroup}
                  >
                    {showCreateGroup ? "Close Form" : "Create Group"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center w-100">
        {showCreateGroup && (
          <FormGroup />
        )}
        {showCreateEvent && (
          <EventForm />
        )}
        {activeGroup && (
          <div
            className="group-details w-100 mt-4"
            style={{ maxWidth: "800px" }}
            ref={detailsRef}
          >
            {isEditMode ? <GroupDetailsEdit /> : <GroupDetails />}
          </div>
        )}
      </div>
      <AvatarModal
        id="avatarModal"
        current={avatarNumber ?? form.avatar}
        onSelect={handleOnSelect}
      />
    </>
  );
};

export default Profile;
