"""create user tables

Revision ID: 20260329_0001
Revises:
Create Date: 2026-03-29 15:30:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from app.core.config import get_settings


# revision identifiers, used by Alembic.
revision: str = "20260329_0001"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    settings = get_settings()
    schema = settings.db_schema

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("reset_password_token_hash", sa.String(length=64), nullable=True),
        sa.Column("reset_password_token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=True),
        sa.Column("avatar_file_name", sa.String(length=255), nullable=True),
        sa.Column("avatar_mime_type", sa.String(length=50), nullable=True),
        sa.Column("avatar_updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("role", sa.String(length=30), nullable=False),
        sa.Column("del_yn", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_users_email"),
        schema=schema,
    )

    op.create_table(
        "user_withdrawal_histories",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("confirmation_email", sa.String(length=255), nullable=False),
        sa.Column("requested_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], [f"{schema}.users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        schema=schema,
    )
    op.create_index(
        "ix_user_withdrawal_histories_user_id",
        "user_withdrawal_histories",
        ["user_id"],
        unique=False,
        schema=schema,
    )


def downgrade() -> None:
    settings = get_settings()
    schema = settings.db_schema

    op.drop_index("ix_user_withdrawal_histories_user_id", table_name="user_withdrawal_histories", schema=schema)
    op.drop_table("user_withdrawal_histories", schema=schema)
    op.drop_table("users", schema=schema)
