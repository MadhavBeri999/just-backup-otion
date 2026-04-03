from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime

from app.database.db import get_db
from app.database.models import StudySession, Child, Parent, Task, AIPrompt
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import get_current_parent

router = APIRouter(prefix="/analytics", tags=["Analytics"])


from datetime import timedelta

@router.get("/child/{child_id}/details")
def get_child_analytics(
    child_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    child = db.query(Child).filter(Child.id == child_id, Child.parent_id == current_parent.id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    # 1. Sessions
    all_sessions = db.query(StudySession).filter(StudySession.child_id == child_id).all()
    
    total_study_minutes = 0
    total_alerts = 0
    
    for session in all_sessions:
        total_alerts += session.alert_count
        if session.status == "completed" and session.task:
            total_study_minutes += session.task.duration_minutes
        elif session.status == "terminated" and session.start_time and session.end_time:
            import math
            diff = session.end_time - session.start_time
            total_study_minutes += max(1, math.ceil(diff.total_seconds() / 60.0))
            
    # 2. Completed Tasks
    completed_tasks = db.query(Task).filter(Task.child_id == child_id, Task.is_completed == 1).count()
    
    # 3. AI Queries
    ai_prompts = db.query(AIPrompt).filter(AIPrompt.child_id == child_id).order_by(AIPrompt.created_at.desc()).all()
    total_ai_queries = len(ai_prompts)
    recent_topics = [{"prompt": p.prompt, "created_at": p.created_at.isoformat() if p.created_at else ""} for p in ai_prompts[:10]]
    
    # 4. Daily Data (Mon-Sun of current week)
    now = datetime.utcnow()
    monday_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    
    daily_data = {
        0: {"day": "Mon", "studyMinutes": 0, "alerts": 0, "queries": 0},
        1: {"day": "Tue", "studyMinutes": 0, "alerts": 0, "queries": 0},
        2: {"day": "Wed", "studyMinutes": 0, "alerts": 0, "queries": 0},
        3: {"day": "Thu", "studyMinutes": 0, "alerts": 0, "queries": 0},
        4: {"day": "Fri", "studyMinutes": 0, "alerts": 0, "queries": 0},
        5: {"day": "Sat", "studyMinutes": 0, "alerts": 0, "queries": 0},
        6: {"day": "Sun", "studyMinutes": 0, "alerts": 0, "queries": 0},
    }
    
    for session in all_sessions:
        if session.start_time and session.start_time >= monday_start:
            day_idx = session.start_time.weekday()
            daily_data[day_idx]["alerts"] += session.alert_count
            if session.status == "completed" and session.task:
                daily_data[day_idx]["studyMinutes"] += session.task.duration_minutes
            elif session.status == "terminated" and session.end_time:
                import math
                diff = session.end_time - session.start_time
                daily_data[day_idx]["studyMinutes"] += max(1, math.ceil(diff.total_seconds() / 60.0))
                
    for prompt in ai_prompts:
        if prompt.created_at and prompt.created_at >= monday_start:
            day_idx = prompt.created_at.weekday()
            daily_data[day_idx]["queries"] += 1
            
    weekly_daily_data = [daily_data[i] for i in range(7)]
    
    return {
        "summary": {
            "totalStudyMinutes": total_study_minutes,
            "totalAlerts": total_alerts,
            "completedTasks": completed_tasks,
            "totalQueries": total_ai_queries
        },
        "weeklyDailyData": weekly_daily_data,
        "recentTopics": recent_topics
    }

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

    # timezone-agnostic check: fetch recently completed and terminated sessions 
    recent_sessions = (
        db.query(StudySession)
        .filter(
            StudySession.child_id.in_(children_ids),
            StudySession.status.in_(["completed", "terminated"]),
        )
        .order_by(StudySession.start_time.desc())
        .limit(100)
        .all()
    )

    today_study_minutes = 0
    now_utc = datetime.utcnow()
    import math
    for session in recent_sessions:
        if session.start_time:
            # If session happened within last 24 hours, consider it "today" natively
            if (now_utc - session.start_time).total_seconds() < 86400:
                if session.status == "completed" and session.task:
                    today_study_minutes += session.task.duration_minutes
                elif session.status == "terminated" and session.end_time:
                    diff = session.end_time - session.start_time
                    duration_minutes = math.ceil(diff.total_seconds() / 60.0)
                    today_study_minutes += max(1, duration_minutes)


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
