from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.database.models import Task, Child, Parent
from app.schemas.task_schema import TaskCreate, TaskResponse
from app.core.auth import get_current_parent

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# CREATE TASK
@router.post("", response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    # Verify child belongs to parent
    child = (
        db.query(Child)
        .filter(Child.id == task.child_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    new_task = Task(
        child_id=task.child_id,
        title=task.title,
        subject=task.subject,
        duration_minutes=task.duration_minutes,
        priority=task.priority,
        is_completed=0
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# GET TASKS BY CHILD
@router.get("/{child_id}", response_model=List[TaskResponse])
def get_tasks(
    child_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    tasks = (
        db.query(Task)
        .join(Child)
        .filter(Task.child_id == child_id, Child.parent_id == current_parent.id)
        .all()
    )

    return tasks

# COMPLETE TASK
@router.patch("/{task_id}/complete")
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    task = (
        db.query(Task)
        .join(Child)
        .filter(Task.id == task_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.is_completed = 1
    db.commit()
    db.refresh(task)

    return task


# DELETE TASK
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_parent: Parent = Depends(get_current_parent),
):
    task = (
        db.query(Task)
        .join(Child)
        .filter(Task.id == task_id, Child.parent_id == current_parent.id)
        .first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}
