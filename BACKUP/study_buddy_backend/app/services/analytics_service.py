from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.models import StudySession
from collections import defaultdict


def get_current_week_range():
    today = datetime.utcnow()
    start_of_week = today - timedelta(days=today.weekday())  # Monday
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

    end_of_week = start_of_week + timedelta(days=7)

    return start_of_week, end_of_week


def get_weekly_sessions(db: Session, child_id: int):
    start_of_week, end_of_week = get_current_week_range()

    sessions = (
        db.query(StudySession)
        .filter(
            StudySession.child_id == child_id,
            StudySession.start_time >= start_of_week,
            StudySession.start_time < end_of_week,
        )
        .all()
    )

    return sessions


def get_weekly_summary_basic(db: Session, child_id: int):
    sessions = get_weekly_sessions(db, child_id)

    total_sessions = len(sessions)
    completed_sessions = len([s for s in sessions if s.status == "completed"])
    terminated_sessions = len([s for s in sessions if s.status == "terminated"])

    total_alerts = sum(s.alert_count for s in sessions)

    total_study_minutes = 0
    for s in sessions:
        if s.start_time and s.end_time:
            duration = s.end_time - s.start_time
            total_study_minutes += int(duration.total_seconds() / 60)

    if total_sessions > 0:
        completion_rate = round((completed_sessions / total_sessions) * 100, 2)
    else:
        completion_rate = 0.0

    return {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "terminated_sessions": terminated_sessions,
        "total_alerts": total_alerts,
        "total_study_minutes": total_study_minutes,
        "completion_rate": completion_rate,
    }


def get_weekly_daily_breakdown(db: Session, child_id: int):
    sessions = get_weekly_sessions(db, child_id)

    daily_sessions = defaultdict(int)
    daily_alerts = defaultdict(int)

    for s in sessions:
        day_label = s.start_time.strftime("%a")  # Mon, Tue, Wed

        daily_sessions[day_label] += 1
        daily_alerts[day_label] += s.alert_count

    # Ensure full week order
    week_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    sessions_per_day = []
    alerts_per_day = []

    for day in week_days:
        sessions_per_day.append(daily_sessions.get(day, 0))
        alerts_per_day.append(daily_alerts.get(day, 0))

    return {
        "labels": week_days,
        "sessions_per_day": sessions_per_day,
        "alerts_per_day": alerts_per_day,
    }
