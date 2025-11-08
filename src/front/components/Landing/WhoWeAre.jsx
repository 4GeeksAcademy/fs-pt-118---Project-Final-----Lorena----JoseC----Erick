import React from "react";
import "./WhoWeAre.css"; // Archivo CSS modular para estilos minimalistas

const WhoWeAre = () => {
  return (
    <section className="who-we-are container text-center my-5">
      <h1 className="who-title mb-4">Who We Are</h1>
      <p className="who-description mx-auto">
        We are a digital platform designed for sports lovers. <br />
        We facilitate the organization, management, and participation
        in sporting events of all types: soccer, basketball, tennis,
        paddle tennis, volleyball, and more. <br />
        Our goal is to connect players and spectators in one place,
        making it easy to create, find, book, and follow sporting
        events in real time.
      </p>

      <div className="row justify-content-center g-4 mt-4">
        {[
          {
            name: "Erick Estrada",
            role: "CEO · Admin",
            img: "https://res.cloudinary.com/ddvyou4tf/image/upload/v1762557725/perfil_1_720_e50vpx.jpg",
          },
          {
            name: "Jose Gonzalez",
            role: "CEO · Admin",
            img: "https://res.cloudinary.com/ddvyou4tf/image/upload/v1762557739/perfil_2_720_m7g1ev.jpg",
          },
          {
            name: "Lorena Serrano",
            role: "CEO · Admin",
            img: "https://res.cloudinary.com/ddvyou4tf/image/upload/v1762557717/perfil_girl_1_480_dpzki2.jpg",
          },
        ].map((person, index) => (
          <div key={index} className="col-sm-12 col-md-6 col-lg-3">
            <div className="who-card border rounded-4 p-4 h-100 d-flex flex-column align-items-center shadow-sm">
              <img
                src={person.img}
                alt={person.name}
                className="rounded-circle mb-3 who-avatar"
              />
              <h5 className="fw-semibold mb-1">{person.name}</h5>
              <small className="text-muted">{person.role}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoWeAre;
