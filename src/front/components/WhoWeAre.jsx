const WhoWeAre = () => {
    return (
        <div className="d-flex flex-column gap-4 text-center w-50 container mt-5">
            <h1 className="title">Who We Are?</h1>
            <p className="fs-3 text-shadow">
                We are a digital platform designed for sports lovers. <br />
                We facilitate the organization, management, and participation
                in sporting events of all types: soccer, basketball, tennis, paddle tennis,
                volleyball, and more. <br />
                Our goal is to connect players and spectators in one place,
                making it easy to create, find, book, and follow sporting events in real time.
            </p>
            <div className="d-flex justify-content-center row gap-3">
                <div className="border border-black rounded-5 p-4 col-sm-12 col-md-6 col-lg-3">
                    <span className="fa-solid fa-user text-danger title"></span>
                    <p className="fs-3 m-0 title">Erick Estrada</p>
                    <div className="form-text">Ceo Admin</div>
                </div>
                <div className="border border-black rounded-5 p-4 col-sm-12 col-md-6 col-lg-3">
                    <span className="fa-solid fa-user text-primary title"></span>
                    <p className="fs-3 m-0 title">Jose Gonzales</p>
                    <div className="form-text">Ceo Admin</div>
                </div>
                <div className="border border-black rounded-5 p-4 col-sm-12 col-md-6 col-lg-3">
                    <span className="fa-solid fa-user text-info-emphasis title"></span>
                    <p className="fs-3 m-0 title">Lorena Serrano</p>
                    <div className="form-text">Ceo Admin</div>
                </div>
            </div>
        </div>
    );
}

export default WhoWeAre;