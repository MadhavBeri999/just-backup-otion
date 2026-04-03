from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SessionStart(BaseModel):
    child_id: int
    task_id: int


class SessionResponse(BaseModel):
    id: int
    child_id: int
    task_id: int
    start_time: datetime
    end_time: Optional[datetime]
    status: str
    alert_count: int
    max_alerts: int
    parent_notified: bool

    class Config:
        from_attributes = True
