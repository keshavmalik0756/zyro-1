from fastapi import APIRouter, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.core.dependencies import get_current_user
from app.models.model import User, Logs
from app.core.dependencies import allow_min_role
from app.core.enums import Role
from fastapi import Depends
from sqlalchemy import select
from app.db.crud.logs_crud import (
    get_log_by_id,
    create_log,
    update_log,
    delete_log,
    get_logs_by_issue_id
)
from app.common.errors import NotFoundError,DatabaseErrors
from app.schemas.logs import CreateLogRequest,UpdateLogRequest
from app.common.logging.logging_config import Logger




logs_router = APIRouter()




@logs_router.get("/{log_id}")
async def get_log_by_id_api(
    log_id:int,
    current_user:User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """
    Get a log by id
    """
    log = await get_log_by_id(log_id=log_id,session=session)

    if not log:
        raise NotFoundError(message=f"Log with id {log_id} not found")
    
    return {
        "success": True,
        "message": "Log fetched successfully",
        "data": log
    }

@logs_router.post("/")
async def create_log_api(
    request:CreateLogRequest,
    current_user:User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """
    Create a new log
    """
    log_data = request.model_dump()
    Logger.info(f"Create log request - user_id: {current_user.id}, data: {log_data}")
    log = await create_log(log=log_data,session=session)
    if not log:
        raise DatabaseErrors(message="Failed to create log")
    return {
        "success": True,
        "message": "Log created successfully",
        "data": log
    }

@logs_router.patch("/{log_id}")
async def update_log_api(
    log_id:int,
    request:UpdateLogRequest,
    current_user:User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """
    Update a log
    """
    from datetime import date
    
    log = await get_log_by_id(log_id=log_id,session=session)
    if not log:
        raise NotFoundError(message=f"Log with id {log_id} not found")
    
    
    log_data = request.model_dump(exclude_unset=True)
    
    
    
    
    if 'date' in log_data and isinstance(log_data['date'], str):
        try:
            log_data['date'] = date.fromisoformat(log_data['date'].strip())
        except ValueError:
            raise ValueError(f"Invalid date format: {log_data['date']}. Expected YYYY-MM-DD")
    
    # Log the data for debugging
    Logger.info(f"Update log request - log_id: {log_id}, data: {log_data}")
    
    # Only proceed if there's data to update
    if not log_data:
        return {
            "success": True,
            "message": "No changes to update",
            "data": log
        }
    
    log = await update_log(log_id=log_id,log=log_data,session=session)
    if not log:
        raise DatabaseErrors(message="Failed to update log")
    return {
        "success": True,
        "message": "Log updated successfully",
        "data": log
    }

@logs_router.delete("/{log_id}")
async def delete_log_api(
    log_id:int,
    current_user:User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """
    Delete a log
    """
    log = await get_log_by_id(log_id=log_id,session=session)
    if not log:
        raise NotFoundError(message=f"Log with id {log_id} not found")
    success = await delete_log(log_id=log_id,session=session)
    if not success:
        raise DatabaseErrors(message="Failed to delete log")
    return {
        "success": True,
        "message": "Log deleted successfully",
    }

