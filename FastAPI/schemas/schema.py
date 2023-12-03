from pydantic import BaseModel


class UserSchema(BaseModel):
    id: int
    name: str
    email: str
    password: str

    class Config:
        orm_mode = True


class ShowUser(UserSchema):
    name: str
    email: str

    class Config:
        orm_mode = True
