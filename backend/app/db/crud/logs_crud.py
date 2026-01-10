from app.models.model import Logs
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List,Optional
from app.common.errors import NotFoundError

async def get_user_logs(user_id:int,session:AsyncSession) -> List[Logs]:
    """
    function to get all logs for the current user
    """

    stmt = select(Logs).where(Logs.user_id == user_id)
    logs = await session.execute(stmt)
    logs = list(logs.scalars().all())
    return logs

async def get_log_by_id(log_id:int,session:AsyncSession) -> Optional[Logs]:
    """
    function to get a log by id
    """
    stmt = select(Logs).where(Logs.id == log_id)
    log = await session.execute(stmt)
    log = log.scalar_one_or_none()
    if not log:
        raise NotFoundError(message=f"Log with id {log_id} not found")
    return log

async def create_log(log:dict,session:AsyncSession) -> Logs:
    """
    function to create a new log
    """
    created_log = Logs(**log)
    session.add(created_log)
    await session.commit()
    await session.refresh(created_log)
    return created_log

async def update_log(log_id:int,log:dict,session:AsyncSession) -> Logs:
    """
    function to update a log
    """
    stmt = select(Logs).where(Logs.id == log_id)
    result = await session.execute(stmt)
    log_obj = result.scalar_one_or_none()
    if not log_obj:
        raise NotFoundError(message="Log not found")

    # Update the log object with the provided data
    for key, value in log.items():
        setattr(log_obj, key, value)
    
    await session.commit()
    await session.refresh(log_obj)
    return log_obj

async def delete_log(log_id:int,session:AsyncSession) -> bool:
    """
    function to delete a log
    """
    stmt = select(Logs).where(Logs.id == log_id)
    log = await session.execute(stmt)
    log = log.scalar_one_or_none()
    if not log:
        raise NotFoundError(message="Log not found")
    await session.delete(log)
    await session.commit()
    return True

async def get_logs_by_issue_id(issue_id:int,session:AsyncSession) -> List[Logs]:
    """
    function to get all logs for an issue
    """
    stmt = select(Logs).where(Logs.issue_id == issue_id)
    logs = await session.execute(stmt)
    logs = list(logs.scalars().all())
    return logs


