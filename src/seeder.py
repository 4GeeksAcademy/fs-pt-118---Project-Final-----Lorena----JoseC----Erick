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
        imagen="https://imgs.search.brave.com/i25jVm3f8IIQn-yWURb-ublI4oCCDVTU_zxmvcvaaP8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9hdGxldGFzLWNv/cnJpZW5kby1hZ3Vh/LXBpc3RhLW5vY2hl/XzY5NTI0Mi0xNjAx/NS5qcGc_c2VtdD1h/aXNfaW5jb21pbmcm/dz03NDAmcT04MA"
    )
    e2 = Events(
        name="Noche de Juegos",
        description="Evento social con juegos de mesa.",
        start_time=now + timedelta(days=10),
        end_time=now + timedelta(days=10, hours=4),
        status=EventsStatus.PENDING,
        creator_id=u2.id,
        imagen="https://imgs.search.brave.com/Xe7hWiCPhgZB1n565tjxW6EiYiymU_AJ7nqnyt2isqU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM5/NzEwODg0NC9lcy9m/b3RvL3NlbmlvcnMt/cGxheWluZy1jYXJk/cy1pbi10aGVpci1y/ZXRpcmVtZW50LWhv/bWUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPThDbmtsMUJt/bTByRTNYNG5WS29V/MVBIMUVhb3lnNHA3/YU1rNnVaX0g2NG89"
    )
    e3 = Events(
        name="Torneo de Invierno",
        description="Evento competitivo por equipos.",
        start_time=now + timedelta(days=20),
        end_time=now + timedelta(days=21),
        status=EventsStatus.PAUSED,
        creator_id=u1.id,
        imagen="https://imgs.search.brave.com/ITkDKbZUTKvitI0e9lSZl1Vv7gF6-TgFNpKgxWRznrw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE2LzE0Lzk4Lzkz/LzM2MF9GXzE2MTQ5/ODkzNTZfdE1DWGhi/WlROdko0OEpRVGxM/TW9maHk2MWVuczZo/dnYuanBn"
    )

    db.session.add_all([e1, e2, e3])
    db.session.commit()

    # --- Groups ---
    g1 = Groups(name="Team Alpha", user_id=u2.id,avatar="https://imgs.search.brave.com/Sta4PBjgjYo5XzxkjsRThW8Abxnk8vMXs6dEcgh5fqI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2JkL2E0/LzcwL2JkYTQ3MDFk/ZTRhYjA2MTI4YjE0/NmY5Zjk5MDI3OTlh/LmpwZw", description="descripcion 1")
    g2 = Groups(name="Team Bravo", user_id=u3.id,avatar="https://imgs.search.brave.com/UEm0g-Q2WCJlmzUKYEchwFv2PM7HkllR7j9lKV_fRxM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2IyL2Y1/LzYyL2IyZjU2MjJk/Y2JkYjljNjMzY2Yw/ZDM5OWFlZTFlM2Y2/LmpwZw", description="descripcion 1")
    g3 = Groups(name="Team Omega", user_id=u4.id,avatar="https://imgs.search.brave.com/zWq-xOTePgXzBelZ-Blemc6Ul1K7NerR626KcqI7EdM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taWxp/dGFyeWxhbmQubmV0/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI1/LzA0L2lfb21lZ2F0/ZWFtLTEud2VicA", description="descripcion 1")

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
