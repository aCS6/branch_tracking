# schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ToDoBase(BaseModel):
    title: str
    description: Optional[str] = None

class ToDoCreate(ToDoBase):
    pass

class ToDoUpdate(ToDoBase):
    completed: Optional[bool] = False

class ToDoInDB(ToDoBase):
    owner: str
    completed: bool
    created_at: datetime

class ToDoResponse(ToDoInDB):
    id: str
