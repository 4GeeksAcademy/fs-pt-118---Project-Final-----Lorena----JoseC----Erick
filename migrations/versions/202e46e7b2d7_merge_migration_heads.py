"""Merge migration heads

Revision ID: 202e46e7b2d7
Revises: 0763d677d453, b48261f9558b
Create Date: 2025-11-19 01:04:53.168071

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '202e46e7b2d7'
down_revision = ('0763d677d453', 'b48261f9558b')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
