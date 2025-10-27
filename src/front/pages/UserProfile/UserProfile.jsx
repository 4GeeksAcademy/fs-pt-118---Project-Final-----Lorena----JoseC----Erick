import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import userServices from "../../Services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import styles from "./UserProfile.module.css";
import FormGroup from "../../components/Groups/FormGroup"
import Avatar, { AVATAR_MAP, inferNumberFromUrl } from "../../components/Avatar";
import Teams from "../../components/Groups/Teams";


const Profile = ({ scrollRef }) => {
  const { store, dispatch } = useGlobalReducer();
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
  const [showCreateGroup, setShowCreateGroup] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState("");


  useEffect(() => {
    setLoading(true);

    userServices
      .getProfile(token)
      .then((resp) => {
         console.log("Profile:", resp)
        if (!resp?.success) {
          setErrorMsg("Error loading profile");
          return;
        }
        const { user, groups , events } = resp;
        
        // slect
        const num = inferNumberFromUrl(user?.avatar);

        setForm({
          user_name: user?.user_name || "",
          email: user?.email || "",
          avatar: AVATAR_MAP[num],
        });
        setAvatarNumber(num);

        setEvents(events);
        setGroups(groups);
        console.log("USER PROFILE DATA:", groups);
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
      avatar: AVATAR_MAP[avatarNumber],
    };

    userServices
      .updateProfile(payload, token)
      .then((resp) => {
        if (resp.success) {
          const user = resp.data;

          setForm({
            user_name: user.user_name || "",
            email: user.email || "",
            avatar: user.avatar || "",
          });
          const num = inferNumberFromUrl(user.avatar);
          setAvatarNumber(num);

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

  const handleAvatarChange = (e) => {
    const value = e.target.value;
    setAvatarNumber(value);
    setForm((prev) => ({ ...prev, avatar: AVATAR_MAP[value] }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  return (
    <>
      <div className={`container ${styles.shell}`}>
        <div className={styles.card}>
          {/* HEADER */}
          <div className="row g-5 align-items-center ">
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
                <label className="form-label fw-bold">Select Profile-IMG </label>
                <select
                  className={`form-select ${styles.input}`}
                  value={avatarNumber}
                  onChange={handleAvatarChange}
                >
                  {Array.from({ length: 10 },
                    (_, i) => String(i + 1)).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-12 col-md-8">

              {okMsg && <p className="alert alert-success">{okMsg}</p>}
              {errorMsg && <p className="alert alert-danger">{errorMsg}</p>}

              <div className="d-flex justify-content-between" >
                <h2 className={styles.title}>Edit Profile</h2>
                <button className={`btn p-2 mt-2 ${styles.cta}`} onClick={handleSave}>
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

              {/* Tabs */}
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
                <h6 className="fw-bold mb-2">Your Events</h6>

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
                    className={`btn w-75 ${styles.cta}`}
                    onClick={() => setShowCreateEvent((prev) => !prev)}
                  >
                    {showCreateEvent ? "Close Event" : "Create Event"}
                  </button>
                </div>
              </div>
            )}

            {tab === "groups" && (
              <div className= {styles.panel}>
                <h6 className="fw-bold mb-2">Your Groups</h6>
                <div className="overflow-y-auto" style={{ maxHeight: '400px', paddingBottom: '60px' }}>
                {groups?.length > 0 &&
                  groups?.map((group) => (
                    <Teams key={group.id} group={group} scrollRef={scrollRef} />
                  ))
                  
                }
                {groups?.length === 0 && (
                  <p className={styles.empty}>No groups yet.</p>
                )}
                </div>


                <div className="fixed-bottom w-100 text-center my-3">
                  <button
                    className={`btn w-75  ${styles.cta}`}
                    onClick={() => setShowCreateGroup((prev) => !prev)}
                  >
                    {showCreateGroup ? "Close Form" : "Create Group"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="container">
        {showCreateGroup && (
          <FormGroup />
        )}
        {showCreateEvent && (
          <FormGroup />
        )}
      </div>

    </>
  );
};

export default Profile;
