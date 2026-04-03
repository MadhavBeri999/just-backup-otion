from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.database.models import Child, Parent
from app.schemas.child_schema import ChildCreate, ChildResponse
from app.core.auth import get_current_parent

router = APIRouter(prefix="/children", tags=["Children"])


# CREATE CHILD
@router.post("/", response_model=ChildResponse)
def create_child(
    child: ChildCreate,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    new_child = Child(
        parent_id=current_parent.id,
        name=child.name,
        age=child.age,
        grade=child.grade,
        school_name=child.school_name,
        device_type=child.device_type,
    )

    db.add(new_child)
    db.commit()
    db.refresh(new_child)

    return new_child


# GET ALL CHILDREN OF LOGGED-IN PARENT
@router.get("/", response_model=List[ChildResponse])
def get_children(
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    children = db.query(Child).filter(Child.parent_id == current_parent.id).all()

    return children


# DELETE CHILD
@router.delete("/{child_id}")
def delete_child(
    child_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    child = (
        db.query(Child)
        .filter(Child.id == child_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    db.delete(child)
    db.commit()

    return {"message": "Child deleted successfully"}
