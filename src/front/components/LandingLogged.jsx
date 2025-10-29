import Hero from "./Hero";
import EventForm from "./EventForm";
import TeamsAdmin from "./admin-teams/TeamsAdmin";

const LandingLogged = () => {
    return (
        <>
            <Hero />
            <div id="hero" className="backgroundimgLogged container-fluid">
                <div className="rounded-5 formgroup">
                    <h1 className="p-5 text-shadow">
                        You can send us requests for all kinds of <br /> sporting events
                    </h1>
                </div>
            </div>
            <div className="row mx-2">
                <EventForm/>
            </div>
            <TeamsAdmin/>
        </>
    );
};

export default LandingLogged;