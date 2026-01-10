
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.model import User,Invite_Tokens
from fastapi import Request,Depends,APIRouter
from app.core.enums import Role, UserStatus
from app.core.dependencies import allow_min_role
import secrets
import hashlib
from app.tasks.email_task import send_email_task
from datetime import datetime,timedelta
from sqlalchemy import select,func
from app.common.email_template import invite_email
from app.core.security import hash_password
from app.db.connection import get_db
from app.db.crud.user import get_user_by_id
from app.common.errors import NotFoundError,PermissionDeniedError
from typing import Optional
from app.db.crud.user import get_all_team_users_under_manager,get_all_managers



user_router = APIRouter()
from pydantic import BaseModel, EmailStr

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    role: Role

class UpdatePasswordRequest(BaseModel):
    raw_token: str
    new_password: str
 
class verifyTokenResponse(BaseModel):
   raw_token: str   

class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Role] = None
    status: Optional[UserStatus] = None
    organization_id: Optional[int] = None
    approving_manager_id: Optional[int] = None
    reporting_manager_id: Optional[int] = None


@user_router.post("/verify-token",response_model=None)
async def verify_token(request:verifyTokenResponse,session:AsyncSession=Depends(get_db)):
    token_hash = hashlib.sha256(request.raw_token.encode()).hexdigest()
    query = select(Invite_Tokens).where(Invite_Tokens.token_hash ==token_hash)
    result = await session.execute(query)
    invite_token = result.scalar_one_or_none()
    if not invite_token or invite_token.expires_at < datetime.now():
        return {
            
            "error": "Invalid or expired token"
        }
    return {
        "message": "Token is valid",
        "user_id": invite_token.user_id
    }
    
    
@user_router.post("/create",response_model=None)
async def create_user(request:CreateUserRequest, session:AsyncSession=Depends(get_db),current_user:User = Depends(allow_min_role(Role.ADMIN))) -> dict:
    
    user  =select(User).where(func.lower(User.email) == request.email.lower())
    result = await session.execute(user)
    existing_user = result.scalar_one_or_none()
    if existing_user:
        new_user = existing_user
        if existing_user.status != UserStatus.INVITED:
         return {
            "message": f"User with email {request.email} already exists."
        }
    else:   
        user_data = request.model_dump(exclude_unset=True)
        new_user = User(
            **user_data,
            password=None,
            status=UserStatus.INVITED
        )
        session.add(new_user)
        await session.flush() 
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

    
    invite_token = Invite_Tokens(
        user_id=new_user.id,
        token_hash=token_hash,
        expires_at=datetime.now() + timedelta(days=7)    
    )
    session.add(invite_token)
    await session.commit()
    await session.refresh(new_user)
   
    print("Sending email to:", new_user.email)
    invite_email_body = invite_email(raw_token, new_user.name,new_user.email)
    if not invite_email_body:
        return {
            "status": "error",
            "error": "Failed to send invite email"
        }

    return {
        "message": f"User {new_user.email} invited successfully", 
        "user_id": new_user.id,
        "invite_token": raw_token #remove this in production
    }

@user_router.post("/update-password",response_model=None)    
async def update_password(
    request: UpdatePasswordRequest,
    session:AsyncSession=Depends(get_db)
):
    token_hash = hashlib.sha256(request.raw_token.encode()).hexdigest()

    stmt = select(Invite_Tokens).where(
        Invite_Tokens.token_hash == token_hash
    )
    result = await session.execute(stmt)
    invite_token = result.scalar_one_or_none()
    if not invite_token or invite_token.expires_at < datetime.now():
        raise ValueError("Invalid or expired token")

   
    stmt = select(User).where(User.id == invite_token.user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        return {
            "error": "User not found"
        }
    password = request.new_password
    if not password or len(password.strip()) < 8:
        return {
            "error": "Password must be provided and at least 8 characters long"
        }
    new_password = password.strip()
    
    hashed_password = await hash_password(new_password)
    user.password = hashed_password
    user.status = UserStatus.ACTIVE

    await session.delete(invite_token)
    await session.commit()
    await session.refresh(user)

    return {
        "message": "Password updated successfully",
        "user_id": user.id
    }

@user_router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(allow_min_role(Role.ADMIN)),
):
    stmt = select(User).where(User.id == user_id)
    invite_tokens = select(Invite_Tokens).where(Invite_Tokens.user_id == user_id)
    all_tokens = await session.execute(invite_tokens)
    tokens = all_tokens.scalars().all()
    if tokens:
        for token in tokens:
            await session.delete(token)
            await session.commit()
        
    result = await session.execute(stmt)
    user = result.scalars().one_or_none()

    if not user:
        return{
            "error": "User not found"
        }

    await session.delete(user)
    await session.commit()

    return {
        "message": f"User {user.email} deleted successfully."
    }


@user_router.get("/")
async def get_all_user(session: AsyncSession=Depends(get_db)):
    stmt = select(User)
    result = await session.execute(stmt)
    users = result.scalars().all()
    users_safe = [user.to_dict() for user in users]
    return {
        "message": "Users retrieved successfully",
        "users": users_safe
    }

@user_router.get("/{user_id}")
async def get_user_by_id_api(user_id: int, session: AsyncSession=Depends(get_db)):
    getquery = select(User).where(User.id == user_id)
    result = await session.execute(getquery)
    user1 = result.scalar_one_or_none()
    user1 = user1.to_dict()
    return {
        "message": "User retrieved successfully",
        "user": user1
    }    
    
@user_router.put("/{user_id}")
async def update_user(
    user_id:int,
    request:UpdateUserRequest,
    session:AsyncSession = Depends(get_db),
    current_user:User = Depends(allow_min_role(Role.ADMIN)),
):

    """
    update a user by id
    """

    user = await get_user_by_id(user_id = user_id,session=session)
    if not user:
        raise NotFoundError(message=f"User with id {user_id} not found")

    user_data = request.model_dump(exclude_unset=True,exclude_none=True)
    for key,value in user_data.items():
        setattr(user,key,value)
    await session.commit()
    await session.refresh(user)
    return {
        "success": True,
        "message": "User updated successfully",
        "data": user
    }

@user_router.get("/{user_id}/team")
async def get_all_users_under_manager_api(
    user_id:int,
    session:AsyncSession = Depends(get_db),
    current_user:User = Depends(allow_min_role(Role.MANAGER)),
):
    """
    Get all team users under a manager
    """
    user = await get_user_by_id(user_id=current_user.id,session=session)
    
    if not user:
        raise NotFoundError(message=f"User with id {current_user.id} not found")
    
   
    team_users = await get_all_team_users_under_manager(manager_id=user.id,session=session)
    
    # Serialize each user to dict and handle role enum
    team_users_data = []
    for team_user in team_users:
        user_dict = team_user.to_dict()
        # Convert role enum to string value if it's an enum
        role_value = user_dict.get("role")
        if role_value and hasattr(role_value, "value"):
            user_dict["role"] = role_value.value
        team_users_data.append(user_dict)

    return {
        "success": True,
        "message": "Team users retrieved successfully",
        "data": team_users_data
    }

@user_router.get("/managers")
async def get_all_managers_api(
    session:AsyncSession = Depends(get_db),
    current_user:User = Depends(allow_min_role(Role.EMPLOYEE)),
):
    """
    Get all managers
    """
    managers = await get_all_managers(session=session)
    return {
        "success": True,
        "message": "Managers retrieved successfully",
        "data": managers if managers else []
    }

