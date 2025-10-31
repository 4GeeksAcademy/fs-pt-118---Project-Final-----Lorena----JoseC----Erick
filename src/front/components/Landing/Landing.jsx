import React from "react";
import Hero from "./Hero";
import "./Landing.css"; // 👈 nuevo archivo de estilos

const Landing = () => {
  const offers = [
    { icon: <i className="fa-solid fa-map-location-dot" />, text: "Reservation of sports spaces" },
    { icon: "🗓️", text: "Calendar of sporting events" },
    { icon: "📝", text: "Registration for tournaments, matches and games" },
    { icon: <i className="fa-solid fa-users" />, text: "Connection between players and spectators" },
  ];

  return (
    <>
      <Hero />

      <section className="offer-section py-5 px-3 px-md-5 text-center">
        <h1 className="fw-bold display-5 mb-5 gradient-text">What we offer</h1>

        <div className="row gy-4 justify-content-center">
          {offers.map((item, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-5">
              <div className="offer-card p-4 rounded-4 shadow-sm bg-white h-100 d-flex align-items-center">
                <span className="offer-icon me-3">{item.icon}</span>
                <p className="mb-0 fs-5 text-start flex-grow-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="club-subscription text-center py-5 px-3 px-md-5 mt-5">
          <div className="d-flex flex-column align-items-center subscription-card p-4 rounded-4 shadow-lg">
            <span className="emoji fs-1 mb-3 bounce">💳</span>
            <h2 className="fw-bold mb-3 gradient-text">Subscribe to Our Club</h2>
            <p className="fs-5 text-muted">
              Get offers and discounts on events,<br />
              create your own, invite friends,<br />
              and be the star ⭐
            </p>
            <button className="btn btn-gradient mt-3 px-4 py-2 fw-semibold">
              Join Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;

