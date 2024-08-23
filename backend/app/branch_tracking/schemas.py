from enum import Enum
from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

class WorkType(str, Enum):
    STORY = 'story'
    BDC = 'bdc'

class CurrentStage(str, Enum):
    WORKING = 'working'
    DEVELOP = 'develop-combined'
    STAGING = 'staging'
    PRODUCTION = 'production'

class Services(str, Enum):
    AI = 'ai'
    BACKEND = 'mvp'
    SCHEDULER = 'scheduler'
    TIKTOK = 'tiktok'
    AUDIO = 'audio analysis'
    MODELS = 'models'

# Pydantic models
class BranchInfoCreate(BaseModel):
    branch_name: str
    checkout_from: str
    current_stage: CurrentStage
    services: List[Services]
    work_type: WorkType
    agenda: Optional[str] = ""
    on_hold: Optional[bool] = False

class BranchInfoUpdate(BaseModel):
    branch_name: str
    checkout_from: Optional[str] = None
    current_stage: Optional[CurrentStage] = None
    services: Optional[List[Services]] = None
    work_type: Optional[WorkType] = None
    agenda: Optional[str] = None
    on_hold: Optional[bool] = False

class BranchInfoInDB(BaseModel):
    id: str
    branch_name: str
    checkout_from: Optional[str] = None
    current_stage: Optional[CurrentStage] = None
    services: Optional[List[Services]] = None
    work_type: Optional[WorkType] = None
    agenda: Optional[str] = None
    on_hold: Optional[bool] = False
    created_at: datetime
    updated_at: datetime
    created_by: str
    updated_by: str