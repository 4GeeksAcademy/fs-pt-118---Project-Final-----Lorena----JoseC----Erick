const Hero = () => {
    return (
        <div className="hero-section d-flex flex-column justify-content-center align-items-center text-center px-3 py-5 backgroundimg">
            <div className="mb-4">
                <h1 className="text-white fw-bold display-5 text-shadow">Your league starts here</h1>
                <h2 className="text-white fw-semibold fs-4 mt-3 text-shadow">
                    Create events, invite friends,<br />
                    compete every day.
                </h2>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                <button className="btn btn-outline-light px-4 py-2 rounded-pill shadow-sm btn-transparente">Live events</button>
                <button className="btn btn-outline-light px-4 py-2 rounded-pill shadow-sm btn-transparente">Teams</button>
            </div>
        </div>
    )
};

export default Hero;