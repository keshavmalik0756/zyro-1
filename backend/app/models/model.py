from app.db.connection import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey,Column, DateTime, func, Enum
from app.core.enums import Role, UserStatus


class TimestampMixin:
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

class User(Base, TimestampMixin):
    __tablename__ = "user"
    id  = Column(Integer , primary_key = True)
    name = Column(String, nullable = False)
    email= Column(String, nullable = False, unique = True)
    password = Column(String, nullable = False)
    role = Column(Enum(Role), nullable = False)
    story_point = Column(Integer, nullable = True, default = 0)
    status = Column(Enum(UserStatus),nullable = False, default = UserStatus.ACTIVE)