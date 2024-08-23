from fastapi import APIRouter,  HTTPException, Depends
from pydantic import EmailStr
from bson import ObjectId
from typing import List
from datetime import datetime
from app.user.schemas import UserInDB
from app.todos.schemas import ToDoCreate, ToDoUpdate, ToDoResponse

from utils import  get_current_user
from models import  todo_collection

todo_router = APIRouter()


@todo_router.post("/", response_model=ToDoResponse)
async def create_todo(todo: ToDoCreate, current_user: UserInDB = Depends(get_current_user)):
    todo_data = todo.model_dump()
    todo_data["owner"] = current_user.username
    todo_data["completed"] = False
    todo_data["created_at"] = datetime.now()
    result = todo_collection.insert_one(todo_data)
    todo_data["id"] = str(result.inserted_id)
    return todo_data

@todo_router.get("/", response_model=List[ToDoResponse])
async def get_todos(current_user: UserInDB = Depends(get_current_user)):
    todos = todo_collection.find({"owner": current_user.username}).sort("created_at", -1)
    return [ToDoResponse(**todo, id=str(todo["_id"])) for todo in todos]

@todo_router.get("/{todo_id}", response_model=ToDoResponse)
async def get_todo(todo_id: str, current_user: UserInDB = Depends(get_current_user)):
    todo = todo_collection.find_one({"_id": ObjectId(todo_id), "owner": current_user.username})
    if not todo:
        raise HTTPException(status_code=404, detail="To-Do not found")
    return ToDoResponse(**todo, id=str(todo["_id"]))

@todo_router.put("/{todo_id}", response_model=ToDoResponse)
async def update_todo(todo_id: str, todo_update: ToDoUpdate, current_user: UserInDB = Depends(get_current_user)):
    update_data = todo_update.model_dump(exclude_unset=True)
    result = todo_collection.update_one({"_id": ObjectId(todo_id), "owner": current_user.username}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="To-Do not found")
    updated_todo = todo_collection.find_one({"_id": ObjectId(todo_id)})
    return ToDoResponse(**updated_todo, id=str(updated_todo["_id"]))

@todo_router.delete("/{todo_id}", response_model=dict)
async def delete_todo(todo_id: str, current_user: UserInDB = Depends(get_current_user)):
    result = todo_collection.delete_one({"_id": ObjectId(todo_id), "owner": current_user.username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="To-Do not found")
    return {"msg": "To-Do deleted"}
