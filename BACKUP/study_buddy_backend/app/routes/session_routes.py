from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database.db import get_db
from app.database.models import StudySession, Child, Task, Parent
from app.schemas.session_schema import SessionStart, SessionResponse
from app.core.auth import get_current_parent
from app.services.email_service import send_parent_alert_email

router = APIRouter(prefix="/sessions", tags=["Study Sessions"])


# -----------------------------
# AUTO COMPLETION CHECK
# -----------------------------
def check_and_auto_complete(session: StudySession, db: Session):
    task_duration = session.task.duration_minutes
    expected_end = session.start_time + timedelta(minutes=task_duration)

    if session.status == "active" and datetime.utcnow() >= expected_end:
        session.status = "completed"
        session.end_time = expected_end
        db.commit()
        db.refresh(session)


# -----------------------------
# START SESSION
# -----------------------------
@router.post("/start", response_model=SessionResponse)
def start_session(
    session_data: SessionStart,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    child = (
        db.query(Child)
        .filter(Child.id == session_data.child_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    task = (
        db.query(Task)
        .filter(Task.id == session_data.task_id, Task.child_id == child.id)
        .first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_session = (
        db.query(StudySession)
        .filter(StudySession.child_id == child.id, StudySession.status == "active")
        .first()
    )

    if existing_session:
        raise HTTPException(status_code=400, detail="Active session already exists")

    new_session = StudySession(
        child_id=child.id,
        task_id=task.id,
        start_time=datetime.utcnow(),
        status="active",
        alert_count=0,
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


# -----------------------------
# END SESSION
# -----------------------------
@router.post("/{session_id}/end", response_model=SessionResponse)
def end_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    session = (
        db.query(StudySession)
        .join(Child)
        .filter(StudySession.id == session_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check auto completion before manual ending
    check_and_auto_complete(session, db)

    if session.status != "active":
        return session  # Allow re-sending done without erroring out

    session.end_time = datetime.utcnow()
    # Explicitly check if the task wasn't terminated
    if session.status != "terminated":
        session.status = "completed"

    db.commit()
    db.refresh(session)

    return session


# -----------------------------
# GET ACTIVE SESSION
# -----------------------------
@router.get("/child/{child_id}/active", response_model=SessionResponse)
def get_active_session(
    child_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    session = (
        db.query(StudySession)
        .join(Child)
        .filter(
            Child.id == child_id,
            Child.parent_id == current_parent.id,
            StudySession.status == "active",
        )
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="No active session")

    # Auto complete if time expired
    check_and_auto_complete(session, db)

    return session


# -----------------------------
# REGISTER ALERT
# -----------------------------
@router.post("/{session_id}/alert", response_model=SessionResponse)
def register_alert(
    session_id: int,
    latitude: float = 0.0,
    longitude: float = 0.0,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    session = (
        db.query(StudySession)
        .join(Child)
        .filter(StudySession.id == session_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    check_and_auto_complete(session, db)

    if session.status != "active":
        raise HTTPException(status_code=400, detail="Session is not active")

    session.alert_count += 1

    # Remove the logic that limits it to max_alerts=3.
    # The frontend is now controlling "5 lives".
    # It will trigger "endSessionAPI" when lives hit 0 on frontend.

    db.commit()
    db.refresh(session)

    return session


# -----------------------------
# REMAINING TIME ENDPOINT
# -----------------------------
@router.get("/{session_id}/remaining-time")
def get_remaining_time(
    session_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    session = (
        db.query(StudySession)
        .join(Child)
        .filter(StudySession.id == session_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status != "active":
        return {
            "remaining_seconds": 0,
            "task_title": session.task.title,
            "task_id": session.task_id,
        }

    task_duration = session.task.duration_minutes
    expected_end = session.start_time + timedelta(minutes=task_duration)
    remaining = (expected_end - datetime.utcnow()).total_seconds()

    return {
        "remaining_seconds": max(0, int(remaining)),
        "task_title": session.task.title,
        "task_id": session.task_id,
    }


@router.get("/recent")
def get_recent_sessions(
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    sessions = (
        db.query(StudySession)
        .join(Child)
        .filter(Child.parent_id == current_parent.id)
        .order_by(StudySession.start_time.desc())
        .limit(5)
        .all()
    )

    return sessions
