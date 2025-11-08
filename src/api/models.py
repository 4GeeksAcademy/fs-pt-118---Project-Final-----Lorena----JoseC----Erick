from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, DateTime, Text, Enum as SqlEnum, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum
from datetime import datetime, date
from typing import Optional
db = SQLAlchemy()

# ----- Enums -----


class RoleEnum(Enum):
    USER = "user"
    ADMIN = "admin"


class EventsStatus(Enum):
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"


class ParticipantType(Enum):
    PLAYER = "player"
    VIEWER = "viewer"
    CAPTAIN = "captain"

# nuevo enum que nos permitirá manejar estado de la reserva


class ReservationStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

# --------------- Tables ---------------- #


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    user_name: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)
    avatar: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())

    # Definimos el campo 'role' como un Enum con valores 'user' y 'admin'
    role: Mapped[RoleEnum] = mapped_column(SqlEnum(RoleEnum, native_enum=False),
                                           default=RoleEnum.USER,
                                           nullable=False)
    # relaciones con otras tablas eventos
    # un usuario --> muchos eventos
    events_created: Mapped[list["Events"]] = relationship(
        back_populates="creator", foreign_keys='Events.creator_id')
    # muchos-a-muchos
    events_joined: Mapped[list["Events"]] = relationship(
        secondary="users_events", back_populates="participants")

    # grupos creados por el usuario
    groups_created: Mapped[list["Groups"]] = relationship(
        back_populates="owner", foreign_keys='Groups.user_id')
    # muchos-a-muchos
    users_groups_link: Mapped[list["UsersGroups"]] = relationship(
        back_populates="user", cascade="all, delete-orphan")
    groups_joined: Mapped[list["Groups"]] = relationship(
        secondary="users_groups", back_populates="members", overlaps="users_groups_link"
    )
    # relaciones con comentarios, un usuario --> muchos comentarios
    comments: Mapped[list["Comments"]] = relationship(back_populates="author")
    # relaciones con reservas, un usuario --> muchas reservas
    reservations: Mapped[list["Reservations"]
                         ] = relationship(back_populates="user")
    # relaciones con favoritos -------> vínculo directo a la tabla intermedia
    favorites_link: Mapped[list["Favorites"]] = relationship(
        "Favorites", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    # lista directa de eventos marcados como favoritos
    favorite_events: Mapped[list["Events"]] = relationship(
        "Events", secondary="favorites", viewonly=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role.value,
            "user_name": self.user_name,
            "avatar": self.avatar,
            "created_at": self.created_at.isoformat() if self.created_at else None,

            "events_created": [event.serialize() for event in self.events_created] if self.events_created else [],
            "events_joined": [e.serialize() for e in self.events_joined] if self.events_joined else [],
            "groups_created": [group.serialize() for group in self.groups_created] if self.groups_created else [],
            "groups_joined": [g.serialize() for g in self.groups_joined] if self.groups_joined else [],

            "comments": [comment.serialize() for comment in self.comments] if self.comments else [],
            "reservations": [reservation.serialize() for reservation in self.reservations] if self.reservations else [],
            "favorite_events": [event.serialize() for event in self.favorite_events] if self.favorite_events else []
        }


class Events(db.Model):
    __tablename__ = 'events'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    imagen: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now())
    status: Mapped[EventsStatus] = mapped_column(SqlEnum(EventsStatus),
                                                 default=EventsStatus.PENDING,
                                                 nullable=False)
    # relaciones con otras tablas, un evento es creado por un usuario(admin)
    creator_id: Mapped[int] = mapped_column(
        ForeignKey('user.id'), nullable=False)
    creator: Mapped["User"] = relationship(
        "User", back_populates="events_created", foreign_keys=[creator_id])
    # muchos-a-muchos
    participants: Mapped[list["User"]] = relationship(
        secondary="users_events", back_populates="events_joined")
    # muchos-a-muchos grupos(teams)
    groups: Mapped[list["Groups"]] = relationship(
        secondary="events_groups", back_populates="events")
    # un evento puede tener muchos comentarios /passive_deletes=True hace que la BD limpie y SQLAlchemy no tenga que emitir deletes por cada hijo
    comments: Mapped[list["Comments"]] = relationship(back_populates="event", cascade="all, delete-orphan",
                                                      passive_deletes=True)
    # un evento puede tener muchas reservas
    reservations: Mapped[list["Reservations"]] = relationship(back_populates="event", cascade="all, delete-orphan",
                                                              passive_deletes=True)
    # relaciones con favoritos
    favorited_by_link: Mapped[list["Favorites"]] = relationship(
        "Favorites", back_populates="event")
    fans: Mapped[list["User"]] = relationship(
        "User", secondary="favorites", viewonly=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "imagen": self.imagen,
            "description": self.description,
            "status": self.status.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "creator_id": self.creator_id,
            "participants_count": len(self.participants) if self.participants else 0,
            "groups_count": len(self.groups) if self.groups else 0,
            "groups": [{"id": g.id, "name": g.name} for g in (self.groups or [])],
            "comments": [{"id": c.id, "content": c.content} for c in (self.comments or [])]
        }

# Tabla intermedia para la relación muchos a muchos entre usuarios y eventos


class UsersEvents(db.Model):
    __tablename__ = 'users_events'

    # argumento para que un usuario solo pueda unirse una vez a un evento(evitamos duplicados)
    __table_args__ = (
        UniqueConstraint('user_id', 'event_id',
                         name='uq_users_events_user_event'),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    # ondelete="CASCADE" para si se elimina el usuario o el evento asociado, se limpia el registro
    user_id: Mapped[int] = mapped_column(ForeignKey(
        'user.id', ondelete="CASCADE"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey(
        'events.id', ondelete="CASCADE"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id if self.event_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Groups(db.Model):
    __tablename__ = 'groups'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())

    user_id: Mapped[int] = mapped_column(ForeignKey(
        'user.id', ondelete="CASCADE"),  nullable=False)  # un usuario crea el equipo

    # relaciones con otras tablas
    owner: Mapped["User"] = relationship(
        "User", back_populates="groups_created", foreign_keys=[user_id])
    # muchos-a-muchos
    members: Mapped[list["User"]] = relationship(
        secondary="users_groups", back_populates="groups_joined", overlaps="users_groups_link")
    # realaciones para leer los extremos mas facilmente
    users_groups_link: Mapped[list["UsersGroups"]] = relationship(
        back_populates="group", overlaps="members")
    # muchos-a-muchos
    events: Mapped[list["Events"]] = relationship(
        secondary="events_groups", back_populates="groups")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "avatar": self.avatar,
            "description": self.description,
            "owner_name": self.owner.user_name if self.owner else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "members_count": len(self.members or []),
            "members": [{"id": u.id, "user_name": u.user_name} for u in (self.members or [])],
            "events": [e.serialize() for e in self.events]
        }

# Tabla intermedia para la relación muchos a muchos entre usuarios y grupos


class UsersGroups(db.Model):
    __tablename__ = 'users_groups'

    # Aseguramos de que un usuario solo pueda estar en un grupo por evento
    __table_args__ = (
        UniqueConstraint("user_id", "group_id",
                         name="uq_user_groups_user_group"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey(
        'user.id', ondelete="CASCADE"), nullable=False)
    group_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    #  agrego rol del usuario dentro del grupo (por ejemplo, "player")
    role: Mapped[str] = mapped_column(
        String(30), nullable=False, default="player")
    # guardamos la fecha en que el usuario se unió al grupo
    joined_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False)

    # realaciones para leer los extremos de mi tabla(role/joined_at)
    user: Mapped["User"] = relationship(
        "User", back_populates="users_groups_link", overlaps="groups_joined,members")
    group: Mapped["Groups"] = relationship(
        "Groups", back_populates="users_groups_link", overlaps="groups_joined,members")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "group_id": self.group_id if self.group_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "role": self.role,
            "joined_at": self.joined_at.isoformat() if self.joined_at else None
        }

# Tabla intermedia para la relación muchos a muchos entre eventos y grupos


class EventsGroups(db.Model):
    __tablename__ = 'events_groups'

    __table_args__ = (
        UniqueConstraint('event_id', 'group_id', name='uq_event_group'),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())

    event_id: Mapped[int] = mapped_column(ForeignKey(
        'events.id', ondelete="CASCADE"), nullable=False)
    group_id: Mapped[int] = mapped_column(ForeignKey(
        'groups.id', ondelete="CASCADE"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "event_id": self.event_id if self.event_id else None,
            "group_id": self.group_id if self.group_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Comments(db.Model):
    __tablename__ = 'comments'
    id: Mapped[int] = mapped_column(primary_key=True)
    nick_name: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now())
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # relaciones con otras tablas
    user_id: Mapped[int] = mapped_column(ForeignKey(
        'user.id', ondelete="CASCADE"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey(
        'events.id', ondelete="CASCADE"), nullable=False)

    # relaciones
    author: Mapped["User"] = relationship("User", back_populates="comments")
    event:  Mapped["Events"] = relationship(
        "Events", back_populates="comments")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "user_name": self.author.user_name if self.author else None
        }

    # Subscriptions Tabla (comentado por ahora)
""" class Subscription(db.Model):
    __tablename__ = 'subscription'
    id: Mapped[int] = mapped_column(primary_key=True)
    creat_at:Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    price:Mapped[int] = mapped_column(Integer, nullable=False)
    status:Mapped[bool] = mapped_column(Boolean, default=True)
    user_id:Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
 
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "price": self.price,
            "status": self.status,
            "creat_at": self.creat_at.isoformat(),
        } """


class Reservations(db.Model):
    __tablename__ = 'reservations'

    # Aseguramos de que un usuario solo pueda tener una reserva por evento
    __table_args__ = (
        UniqueConstraint("user_id", "event_id",
                         name="uq_reservations_user_event"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    participant: Mapped[ParticipantType] = mapped_column(SqlEnum(ParticipantType, native_enum=False),
                                                         default=ParticipantType.VIEWER,
                                                         nullable=False)
    status: Mapped[ReservationStatus] = mapped_column(
        SqlEnum(ReservationStatus, native_enum=False), default=ReservationStatus.PENDING, nullable=False
    )
    # relaciones con otras tablas
    user_id: Mapped[int] = mapped_column(ForeignKey(
        'user.id', ondelete="CASCADE"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey(
        'events.id', ondelete="CASCADE"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="reservations")
    event: Mapped["Events"] = relationship(
        "Events", back_populates="reservations")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "notes": self.notes,
            "participant": self.participant.value,
            "status": self.status.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Favorites(db.Model):
    __tablename__ = 'favorites'

    # Aseguramos de que un usuario solo pueda marcar un evento como favorito una vez
    __table_args__ = (
        UniqueConstraint("user_id", "event_id",
                         name="uq_favorites_user_event"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now())
    # relaciones con otras tablas
    user_id: Mapped[int] = mapped_column(ForeignKey(
        'user.id', ondelete="CASCADE"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey(
        'events.id', ondelete="CASCADE"), nullable=False)

    user: Mapped["User"] = relationship(
        "User", back_populates="favorites_link")
    event: Mapped["Events"] = relationship(
        "Events", back_populates="favorited_by_link")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id if self.event_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
