from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.connection import get_db
from app.core.dependencies import get_current_user, allow_min_role
from app.models.model import User
from app.common.errors import NotFoundError,DatabaseErrors
from fastapi import status
from app.schemas.issue import CreateIssueRequest,UpdateIssueRequest
from app.core.enums import Role
from typing import List
from app.db.crud.issue_crud import (
    get_all_issues,
    get_issue_by_id,
    create_issue,
    update_issue,
    delete_issue
)

issue_router = APIRouter()

@issue_router.get("/")  
async def get_all_issues_api(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """
    Get all issues for the current user
    """
    issues = await get_all_issues(
        user_id = current_user.id,
        session = session
    )

    return {
        "success": True,
        "issue_count": len(issues),
        "message": "Issues fetched successfully",
        "data": issues if issues else []
    }

@issue_router.get("/{issue_id}")
async def get_issue_by_id_api(
    issue_id:int,
    session:AsyncSession = Depends(get_db),
):
    """
    Get an issue by id
    """
    issue = await get_issue_by_id(
        issue_id = issue_id,
        session = session
    )
    if not issue:
        raise NotFoundError(message="Issue not found", response_code=status.HTTP_404_NOT_FOUND)

    
    return {
        "success": True,
        "message": "Issue fetched successfully",
        "data": issue
    }

@issue_router.post("/")
async def create_issue_api(
    request:CreateIssueRequest,
    session:AsyncSession = Depends(get_db),
    current_user:User = Depends(get_current_user),
):
    """
    Create a new issue
    """
    issue_data = request.model_dump()
    created_issue = await create_issue(     
        session = session,  
        user_id = current_user.id,
        payload = issue_data
    )

    if not created_issue:
        raise DatabaseErrors(message="Failed to create issue", response_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return {
        "success": True,
        "message": "Issue created successfully",
        "data": created_issue
    }

@issue_router.put("/{issue_id}")
async def update_issue_api(
    request:UpdateIssueRequest,
    issue_id:int,
    session:AsyncSession = Depends(get_db),
    current_user: User = Depends(allow_min_role(Role.MANAGER)),
):
    """
    Update an issue by id
    """
    issue_data = request.model_dump(exclude_unset=True, exclude_none=True)
    updated_issue = await update_issue(session=session,issue_id=issue_id,payload=issue_data)

    if not updated_issue:
        raise DatabaseErrors(message="Failed to update issue", response_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return {
        "success": True,
        "message": "Issue updated successfully",
        "data": updated_issue
    }

@issue_router.delete("/{issue_id}")
async def delete_issue_api(
    issue_id:int,
    session:AsyncSession = Depends(get_db),
    current_user:User = Depends(allow_min_role(Role.MANAGER))
):
    """
    Delete an issue by id
    """

    success = await delete_issue(session = session, issue_id = issue_id)
    if not success:
        raise DatabaseErrors(message="Failed to delete issue", response_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return {
        "success": True,
        "message": "Issue deleted successfully",
    }