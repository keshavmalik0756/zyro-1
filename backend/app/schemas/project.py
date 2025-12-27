from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import date
from app.core.enums import ProjectStatus

class ProjectRequest(BaseModel):
    name: str
    description: str
    start_date: date
    end_date: date
    status: ProjectStatus = ProjectStatus.INACTIVE
    organization_id: int

class ProjectUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[ProjectStatus] = None
    organization_id: Optional[int] = None

