from pydantic import BaseModel


class TaskCreate(BaseModel):
    child_id: int
    title: str
    subject: str
    duration_minutes: int
    priority: str


class TaskResponse(BaseModel):
    id: int
    child_id: int
    title: str
    subject: str
    duration_minutes: int
    priority: str
    is_completed: int

    class Config:
        from_attributes = True
