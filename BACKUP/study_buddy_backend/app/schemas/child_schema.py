from pydantic import BaseModel
from typing import Optional


class ChildCreate(BaseModel):
    name: str
    age: int
    grade: str
    school_name: Optional[str] = None
    device_type: str


class ChildResponse(BaseModel):
    id: int
    parent_id: int
    name: str
    age: int
    grade: str
    school_name: Optional[str]
    device_type: str

    class Config:
        from_attributes = True
