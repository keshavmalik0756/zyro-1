from app.models.model import Organization, OrganizationMember
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List
from app.core.enums import OrganizationStatus

async def get_all_organizations_by_user(user_id: int, session: AsyncSession) -> List[Organization]:
    """
    Get all organizations for the current user (as owner or member)
    Optimized to use a single query with OR condition
    """
    
    # Single query to get organizations where user is owner OR member
    stmt = select(Organization).outerjoin(
        OrganizationMember,
        Organization.id == OrganizationMember.organization_id
    ).where(
        or_(
            Organization.owner_id == user_id,
            OrganizationMember.user_id == user_id
        )
    ).distinct()
    
    result = await session.execute(stmt)
    organizations = list(result.scalars().all())
    
    return organizations

async def create_organization(
    session: AsyncSession,
    user_id: int,
    name: str,
    description: str = None,
    data: dict = None
) -> Organization:
    """
    Create a new organization and add creator as owner and member
    """
    if not user_id:
        raise ValueError("User ID is required")
    
    if not name or not name.strip():
        raise ValueError("Organization name is required")
    
    # Create organization
    organization = Organization(
        name=name.strip(),
        description=description.strip() if description else None,
        owner_id=user_id,
        status=OrganizationStatus.ACTIVE,
        data=data
    )
    session.add(organization)
    await session.flush()
    
    # Add creator as organization member
    org_member = OrganizationMember(
        user_id=user_id,
        organization_id=organization.id
    )
    session.add(org_member)
    
    await session.commit()
    await session.refresh(organization)
    await session.refresh(org_member)
    
    return organization