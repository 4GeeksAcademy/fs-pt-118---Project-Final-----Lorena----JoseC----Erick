const Landing = () => {
  




  return (
    <>
      <div className="backgroundimg">
        <div className="row">
          <h1 className="text-white col-12 text-center fw-bolder text-shadow">Your league starts here</h1>
          <h2 className="text-white col-12 text-center fw-bolder my-3 text-shadow">Create events, invite friends,<br />
            compete every day.</h2>
        </div>
        <div className="row">
          <button className="col-sm-12 col-lg-5 mx-2 btn-transparente text-nowrap"> Live events</button>
          <button className="col-sm-12 col-lg-4 mx-2 btn-transparente">Teams</button>
        </div>
      </div>
      <div className="container-fluid row mt-5 text-center">
        <h1 className="col-12 mb-4 title"> What we offer?</h1>
        <div className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3 ">
          <div className="row align-items-center mb-3 ">
            <div className="col-sm-12 col-lg-6">
              <span className="fa-solid fa-map-location-dot emoji me-3"></span>
            </div>
            <div className="col-sm-12 col-lg-6">
              <p className="fs-3 mb-0 text-shadow ">Reservation of sports spaces.</p>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3 ">
          <div className="row align-items-center mb-3 ">
            <div className="col-sm-12 col-lg-6">
              <span className="emoji me-3 ">🗓️</span>
            </div>
            <div className="col-sm-12 col-lg-6">
              <p className="fs-3 mb-0 text-shadow ">Calendar of sporting events.</p>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3 ">
          <div className="row align-items-center mb-3 ">
            <div className="col-sm-12 col-lg-6">
              <span className="emoji me-3 ">📝</span>
            </div>
            <div className="col-sm-12 col-lg-6">
              <p className="fs-3 mb-0 text-shadow ">Registration for tournaments, matches and games.</p>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-6 col-lg-6 d-flex align-items-center mb-3 ">
          <div className="row align-items-center mb-3 ">
            <div className="col-sm-12 col-lg-6">
              <span className="emoji me-3 fa-solid fa-users"></span>
            </div>
            <div className="col-sm-12 col-lg-6">
              <p className="fs-3 mb-0 text-shadow ">Connection between players and spectators.</p>
            </div>
          </div>
        </div>

        <div className="col-12 text-center mt-4">
          <span className="emoji d-block mb-2">💳</span>
          <p className="fs-3 text-shadow ">
            Subscribe to Our Club. <br />
            Get offers and discounts on events, create your own, invite friends, and be the star.
          </p>
        </div>
      </div>

    </>);

};

export default Landing;
