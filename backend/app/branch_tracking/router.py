
from bson import ObjectId
from typing import Optional, List, Dict, Any
from fastapi import APIRouter,  HTTPException, Depends, Query
from bson import ObjectId
from typing import List
from datetime import datetime
from app.user.schemas import UserInDB
from app.branch_tracking.schemas import (
    BranchInfoCreate, BranchInfoUpdate, BranchInfoInDB,
    CurrentStage, Services, WorkType
)
import json
from utils import  get_current_user
from models import  branch_tracking_collection


branch_track_router = APIRouter()


# todo: remove below function from here
# Helper functions
def str_to_objectid(id: str) -> ObjectId:
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

@branch_track_router.post("/", response_model=dict)
async def create_item(
    branch_info: BranchInfoCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    item_dict = branch_info.model_dump()
    item_dict["created_at"] = datetime.now()
    item_dict["updated_at"] = datetime.now()
    item_dict["created_by"] = current_user.username
    item_dict["updated_by"] = current_user.username
    print("create branch data ", item_dict)

    result = branch_tracking_collection.insert_one(item_dict)
    return {"id": str(result.inserted_id)}

@branch_track_router.get("/", response_model=List[BranchInfoInDB])
async def list_items(
    status: Optional[str] = Query(None, description="Filter by status: 'on_going', 'hold', or 'completed'"),
    # Todo: apply proper pagination , also in the response model and from frontend too!
    skip: int = Query(0, description="Number of items to skip"),
    limit: int = Query(100, description="Number of items to return"),
    current_user: UserInDB = Depends(get_current_user)
):
    query = {"created_by": current_user.username}
    if status == 'on_going':
        query = {"current_stage": {"$ne": "production"}, "on_hold": False}
    elif status == 'hold':
        query = {"on_hold": True}
    elif status == 'completed':
        query = {"current_stage": "production", "on_hold": False}

    db_branch_tracking_list = list(branch_tracking_collection.find(query).skip(skip).limit(limit).sort("_id", -1))

    response = [
        BranchInfoInDB(
            id = str(db_branch.get("_id")),
            branch_name = str(db_branch.get("branch_name")),
            checkout_from = db_branch.get("checkout_from"),
            current_stage = db_branch.get("current_stage"),
            services = db_branch.get("services"),
            work_type = db_branch.get("work_type"),
            agenda = db_branch.get("agenda"),
            on_hold = db_branch.get("on_hold"),
            created_at = db_branch.get("created_at"),
            updated_at = db_branch.get("updated_at"),
            created_by = db_branch.get("created_by"),
            updated_by = db_branch.get("updated_by"),
        ) for db_branch in db_branch_tracking_list
    ]
    return response

@branch_track_router.get("/{branch_tracking_id}", response_model=BranchInfoInDB)
async def read_item(
    branch_tracking_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    db_branch = branch_tracking_collection.find_one(
        {"_id": str_to_objectid(branch_tracking_id),"created_by": current_user.username}
    )
    if db_branch is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    response = BranchInfoInDB(
        id = str(db_branch.get("_id")),
        checkout_from = db_branch.get("checkout_from"),
        branch_name = str(db_branch.get("branch_name")),
        current_stage = db_branch.get("current_stage"),
        services = db_branch.get("services"),
        work_type = db_branch.get("work_type"),
        agenda = db_branch.get("agenda"),
        on_hold = db_branch.get("on_hold"),
        created_at = db_branch.get("created_at"),
        updated_at = db_branch.get("updated_at"),
        created_by = db_branch.get("created_by"),
        updated_by = db_branch.get("updated_by"),
    )
    return response

@branch_track_router.put("/{branch_id}", response_model=dict)
async def update_item(
    branch_id: str,
    branch_info: BranchInfoUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    db_branch = branch_tracking_collection.find_one(
        {"_id": str_to_objectid(branch_id),"created_by": current_user.username}
    )
    if db_branch is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = {k: v for k, v in branch_info.model_dump().items() if v is not None}
    result = branch_tracking_collection.update_one({"_id": str_to_objectid(branch_id)}, {"$set": update_data})
    
    return {"message": "Item updated"}

@branch_track_router.delete("/{branch_id}", response_model=dict)
async def delete_item(
    branch_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    db_branch = branch_tracking_collection.find_one(
        {"_id": str_to_objectid(branch_id),"created_by": current_user.username}
    )
    if db_branch is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    result = branch_tracking_collection.delete_one({"_id": str_to_objectid(branch_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}


@branch_track_router.get("/enums/", response_model=Dict[str, Any])
async def get_enum_values() -> Dict[str, Any]:
    return {
        "work_types": [work_type.value for work_type in WorkType],
        "current_stages": [stage.value for stage in CurrentStage],
        "services": [service.value for service in Services]
    }
