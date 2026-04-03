from pydantic import BaseModel, EmailStr


class ParentRegister(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    password: str


class ParentResponse(BaseModel):
    id: int
    name: str
    email: str
    mobile: str

    class Config:
        form_attributes = True


class ParentLogin(BaseModel):
    email: EmailStr
    password: str
