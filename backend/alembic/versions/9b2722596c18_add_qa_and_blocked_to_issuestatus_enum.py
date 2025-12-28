"""add_qa_and_blocked_to_issuestatus_enum

Revision ID: 9b2722596c18
Revises: 3963f59375ee
Create Date: 2025-12-27 22:05:08.545656

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b2722596c18'
down_revision: Union[str, None] = '3963f59375ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add 'QA' and 'BLOCKED' to the existing issuestatus enum
    # Note: PostgreSQL's ALTER TYPE ADD VALUE cannot run in a transaction
    # We need to execute these commands with autocommit
    conn = op.get_bind()
    
    # Check current enum values
    result = conn.execute(sa.text("""
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'issuestatus')
    """))
    existing = {row[0] for row in result}
    
    # Add values if they don't exist (using connection that autocommits)
    if 'QA' not in existing:
        # Use execute with autocommit by getting raw connection
        raw_conn = conn.connection
        raw_conn.autocommit = True
        try:
            raw_conn.execute(sa.text("ALTER TYPE issuestatus ADD VALUE 'QA'"))
        except Exception:
            pass  # Might already exist
        finally:
            raw_conn.autocommit = False
    
    if 'BLOCKED' not in existing:
        raw_conn = conn.connection
        raw_conn.autocommit = True
        try:
            raw_conn.execute(sa.text("ALTER TYPE issuestatus ADD VALUE 'BLOCKED'"))
        except Exception:
            pass  # Might already exist
        finally:
            raw_conn.autocommit = False


def downgrade() -> None:
    # Note: PostgreSQL doesn't support removing enum values directly
    # This would require recreating the enum type, which is complex
    # For now, we'll leave a comment that manual intervention may be needed
    pass
