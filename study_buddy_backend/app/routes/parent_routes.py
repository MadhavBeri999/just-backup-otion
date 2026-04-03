from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Parent
from app.schemas.parent_schema import ParentRegister, ParentResponse
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, get_current_parent

router = APIRouter(prefix="/parent", tags=["Parent"])


# =========================
# REGISTER
# =========================
@router.post("/register", response_model=ParentResponse)
def register_parent(parent: ParentRegister, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_email = db.query(Parent).filter(Parent.email == parent.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if mobile already exists
    existing_mobile = db.query(Parent).filter(Parent.mobile == parent.mobile).first()
    if existing_mobile:
        raise HTTPException(status_code=400, detail="Mobile already registered")

    # Hash password
    hashed_pw = hash_password(parent.password)

    new_parent = Parent(
        name=parent.name,
        email=parent.email,
        mobile=parent.mobile,
        password=hashed_pw,  # ✅ matches your model
    )

    db.add(new_parent)
    db.commit()
    db.refresh(new_parent)

    return new_parent


# =========================
# LOGIN (OAuth2 Proper Way)
# =========================
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    parent = db.query(Parent).filter(Parent.email == form_data.username).first()

    if not parent:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # ✅ verify using parent.password (because your model uses password)
    if not verify_password(form_data.password, parent.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": parent.email})

    return {"access_token": access_token, "token_type": "bearer"}


# =========================
# GET CURRENT PARENT
# =========================
@router.get("/me")
def get_my_profile(current_parent: Parent = Depends(get_current_parent)):
    return {
        "id": current_parent.id,
        "name": current_parent.name,
        "email": current_parent.email,
        "mobile": current_parent.mobile,
        "is_email_verified": current_parent.is_email_verified,
        "is_mobile_verified": current_parent.is_mobile_verified,
    }
