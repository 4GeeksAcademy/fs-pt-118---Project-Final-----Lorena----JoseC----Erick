from datetime import datetime, timedelta, timezone
from app import app
from api.models import db, User, Events, Groups, UsersGroups, UsersEvents, EventsGroups, Comments, Reservations, Favorites
from api.models import RoleEnum, EventsStatus, ParticipantType, ReservationStatus
from werkzeug.security import generate_password_hash


def seed_data():
    db.drop_all()
    db.create_all()

    # --- Users ---
    u1 = User(email="ana@example.com", password_hash=generate_password_hash("ana123"), user_name="ana",
              avatar="https://i.pravatar.cc/240?img=2", role=RoleEnum.ADMIN)
    u2 = User(email="bob@example.com", password_hash=generate_password_hash("bob123"),
              avatar="https://i.pravatar.cc/240?img=2", user_name="bob")
    u3 = User(email="carla@example.com", password_hash=generate_password_hash("carla123"),
              avatar="https://i.pravatar.cc/240?img=2", user_name="carla")
    u4 = User(email="david@example.com", password_hash=generate_password_hash("david123"),
              avatar="https://i.pravatar.cc/240?img=2", user_name="david")

    db.session.add_all([u1, u2, u3, u4])
    db.session.commit()

    # --- Events ---
    now = datetime.now(timezone.utc)
    e1 = Events(
        name="Torneo de Verano",
        description="Competencia amistosa de verano.",
        start_time=now + timedelta(days=5),
        end_time=now + timedelta(days=6),
        status=EventsStatus.ACTIVE,
        creator_id=u1.id,
        imagen="imagen"
    )
    e2 = Events(
        name="Noche de Juegos",
        description="Evento social con juegos de mesa.",
        start_time=now + timedelta(days=10),
        end_time=now + timedelta(days=10, hours=4),
        status=EventsStatus.PENDING,
        creator_id=u2.id,
        imagen="imagen"
    )
    e3 = Events(
        name="Torneo de Invierno",
        description="Evento competitivo por equipos.",
        start_time=now + timedelta(days=20),
        end_time=now + timedelta(days=21),
        status=EventsStatus.PAUSED,
        creator_id=u1.id,
        imagen="imagen"
    )

    db.session.add_all([e1, e2, e3])
    db.session.commit()

    # --- Groups ---
    g1 = Groups(name="Team Alpha", user_id=u2.id, description="descripcion 1")
    g2 = Groups(name="Team Bravo", user_id=u3.id, description="descripcion 1")
    g3 = Groups(name="Team Omega", user_id=u4.id, description="descripcion 1")

    db.session.add_all([g1, g2, g3])
    db.session.commit()

    # --- UsersGroups (membership with roles) ---
    ug1 = UsersGroups(user_id=u2.id, group_id=g1.id, role="captain")
    ug2 = UsersGroups(user_id=u3.id, group_id=g1.id, role="player")
    ug3 = UsersGroups(user_id=u3.id, group_id=g2.id, role="captain")
    ug4 = UsersGroups(user_id=u4.id, group_id=g3.id, role="player")

    db.session.add_all([ug1, ug2, ug3, ug4])
    db.session.commit()

    # --- EventsGroups (link between events and groups) ---
    eg1 = EventsGroups(event_id=e1.id, group_id=g1.id)
    eg2 = EventsGroups(event_id=e1.id, group_id=g2.id)
    eg3 = EventsGroups(event_id=e3.id, group_id=g3.id)

    db.session.add_all([eg1, eg2, eg3])
    db.session.commit()

    # --- UsersEvents (participation) ---
    ue1 = UsersEvents(user_id=u2.id, event_id=e1.id)
    ue2 = UsersEvents(user_id=u3.id, event_id=e1.id)
    ue3 = UsersEvents(user_id=u4.id, event_id=e2.id)

    db.session.add_all([ue1, ue2, ue3])
    db.session.commit()

    # --- Reservations ---
    r1 = Reservations(user_id=u2.id, event_id=e1.id,
                      participant=ParticipantType.PLAYER, status=ReservationStatus.APPROVED)
    r2 = Reservations(user_id=u3.id, event_id=e1.id,
                      participant=ParticipantType.PLAYER, status=ReservationStatus.APPROVED)
    r3 = Reservations(user_id=u4.id, event_id=e2.id,
                      participant=ParticipantType.VIEWER, status=ReservationStatus.PENDING)

    db.session.add_all([r1, r2, r3])
    db.session.commit()

    # --- Comments ---
    c1 = Comments(user_id=u2.id, event_id=e1.id, content="¡Listo para ganar!")
    c2 = Comments(user_id=u3.id, event_id=e1.id, content="Vamos con todo.")
    c3 = Comments(user_id=u4.id, event_id=e2.id,
                  content="Espero el evento con ganas.")

    db.session.add_all([c1, c2, c3])
    db.session.commit()

    # --- Favorites ---
    f1 = Favorites(user_id=u2.id, event_id=e3.id)
    f2 = Favorites(user_id=u3.id, event_id=e1.id)
    f3 = Favorites(user_id=u4.id, event_id=e1.id)

    db.session.add_all([f1, f2, f3])
    db.session.commit()

    print("✅ Database seeded successfully!")


if __name__ == "__main__":
    with app.app_context():
        seed_data()
