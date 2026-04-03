from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime

from app.database.db import get_db
from app.database.models import StudySession, Child, Parent, Task
from app.services.analytics_service import get_weekly_summary_basic
from app.services.analytics_service import get_weekly_daily_breakdown
from app.core.auth import get_current_parent

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# =========================================
# EXISTING ROUTES (UNCHANGED)
# =========================================


@router.get("/child/{child_id}/weekly-summary-basic")
def weekly_summary_basic(child_id: int, db: Session = Depends(get_db)):
    summary = get_weekly_summary_basic(db, child_id)
    return {"child_id": child_id, **summary}


@router.get("/child/{child_id}/weekly-daily-breakdown")
def weekly_daily_breakdown(child_id: int, db: Session = Depends(get_db)):
    breakdown = get_weekly_daily_breakdown(db, child_id)
    return breakdown


# =========================================
# DASHBOARD SUMMARY (FIXED)
# =========================================


@router.get("/dashboard-summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    # 1️⃣ Get children of logged-in parent
    children = db.query(Child).filter(Child.parent_id == current_parent.id).all()

    children_ids = [child.id for child in children]
    total_children = len(children_ids)

    if not children_ids:
        return {
            "total_children": 0,
            "active_sessions": 0,
            "today_study_minutes": 0,
            "total_alerts": 0,
        }

    # 2️⃣ Active sessions
    active_sessions = (
        db.query(StudySession)
        .filter(
            StudySession.child_id.in_(children_ids), StudySession.status == "active"
        )
        .count()
    )

    # 3️⃣ Today's study minutes (Dynamically calculated from start/end times if available)
    today = date.today()

    today_sessions = (
        db.query(StudySession)
        .filter(
            StudySession.child_id.in_(children_ids),
            func.date(StudySession.start_time) == today,
            StudySession.status == "completed",
        )
        .all()
    )

    today_study_minutes = 0
    for session in today_sessions:
        if session.start_time and session.end_time:
            # Calculate exact duration (ceil so 1m isn't rounded to 0m)
            import math

            diff = session.end_time - session.start_time
            # If someone runs a task for just 5s, round it up to "1 min" so it registers!
            duration_minutes = math.ceil(diff.total_seconds() / 60.0)
            today_study_minutes += max(1, duration_minutes)
        else:
            # Fallback to task duration if end_time isn't reliably saved
            if session.task:
                today_study_minutes += session.task.duration_minutes

    # 4️⃣ Total alerts (Sum of alert_count)
    total_alerts = (
        db.query(func.coalesce(func.sum(StudySession.alert_count), 0))
        .filter(StudySession.child_id.in_(children_ids))
        .scalar()
    )

    return {
        "total_children": total_children,
        "active_sessions": active_sessions,
        "today_study_minutes": today_study_minutes,
        "total_alerts": total_alerts,
    }
