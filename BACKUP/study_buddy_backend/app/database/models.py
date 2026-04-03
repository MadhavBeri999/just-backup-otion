from sqlalchemy import Column, DateTime, Integer, String, Boolean
from app.database.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Boolean


class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_email_verified = Column(Boolean, default=False)
    is_mobile_verified = Column(Boolean, default=False)


class Child(Base):
    __tablename__ = "children"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parents.id"))

    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    grade = Column(String, nullable=False)
    school_name = Column(String, nullable=True)
    device_type = Column(String, nullable=False)

    parent = relationship("Parent", backref="children")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))

    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)  # in minutes
    priority = Column(String, nullable=False)  # Low / Medium / High
    is_completed = Column(Integer, default=0)  # 0 = false, 1 = true

    child = relationship("Child", backref="tasks")


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    task_id = Column(Integer, ForeignKey("tasks.id"))

    start_time = Column(DateTime)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="active")  # active / completed / terminated

    alert_count = Column(Integer, default=0)
    max_alerts = Column(Integer, default=3)
    task = relationship("Task")
    parent_notified = Column(Boolean, default=False)


from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database.db import Base


class AIPrompt(Base):
    __tablename__ = "ai_prompts"

    id = Column(Integer, primary_key=True)
    child_id = Column(Integer, ForeignKey("children.id"))
    prompt = Column(Text)
    response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
