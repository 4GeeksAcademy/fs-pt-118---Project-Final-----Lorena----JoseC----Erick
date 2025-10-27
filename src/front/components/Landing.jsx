import Hero from "./Hero";
const Landing = () => {
  return (
    <>
    <Hero/>
      <section className="offer-section py-5 px-3 px-md-5 text-center">
        <h1 className="fw-bold display-5 mb-4 text-shadow">What we offer</h1>

        <div className="row gy-4 justify-content-center">
          {[
            { icon: <i className="fa-solid fa-map-location-dot" />, text: "Reservation of sports spaces" },
            { icon: "🗓️", text: "Calendar of sporting events" },
            { icon: "📝", text: "Registration for tournaments, matches and games" },
            { icon: <i className="fa-solid fa-users" />, text: "Connection between players and spectators" },
          ].map((item, index) => (
            <div key={index} className="col-12 col-md-6">
              <div className="d-flex align-items-center p-4 rounded-4 shadow-sm bg-white h-100">
                <span className="emoji fs-3 me-3">{item.icon}</span>
                <p className="mb-0 fs-5 text-start text-shadow flex-grow-1">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="club-subscription text-center py-5 px-3 px-md-5">
          <div className="d-flex flex-column align-items-center">
            <span className="emoji fs-1 mb-3">💳</span>
            <h2 className="fw-bold mb-3 text-shadow">Subscribe to Our Club</h2>
            <p className="fs-5 text-shadow">
              Get offers and discounts on events,<br />
              create your own, invite friends,<br />
              and be the star.
            </p>
          </div>
        </div>
      </section>
    </>);

};

export default Landing;
