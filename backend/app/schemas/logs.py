from pydantic import BaseModel, field_validator, model_validator
from typing import Optional, Any
from datetime import date

class CreateLogRequest(BaseModel):
    issue_id: int
    description: Optional[str] = None
    date: date
    hour_worked: Optional[float] = None
    
    

class UpdateLogRequest(BaseModel):
    description: Optional[str] = None
    date: Optional[str] = None
    hour_worked: Optional[float] = None    
    
