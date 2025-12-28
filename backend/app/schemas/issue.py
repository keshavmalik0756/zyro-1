from pydantic import BaseModel
from typing import Optional
from app.core.enums import IssueStatus,IssueType,Priority

class CreateIssueRequest(BaseModel):
    name:str
    description:Optional[str] = None
    story_point:int
    status:IssueStatus
    type:IssueType
    priority:Priority
    assigned_to:Optional[int] = None
    sprint_id:Optional[int] = None
    project_id:Optional[int] = None

class UpdateIssueRequest(BaseModel):
    name:Optional[str] = None
    description:Optional[str] = None
    story_point:Optional[int] = None
    status:Optional[IssueStatus] = None
    type:Optional[IssueType] = None
    priority:Optional[Priority] = None
    assigned_to:Optional[int] = None
    sprint_id:Optional[int] = None      