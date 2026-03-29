"""initial core tables

Revision ID: 0001_initial_core_tables
Revises:
Create Date: 2026-03-29 00:00:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0001_initial_core_tables"
down_revision = None
branch_labels = None
depends_on = None


UUID = postgresql.UUID(as_uuid=True)
JSONB = postgresql.JSONB(astext_type=sa.Text())


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute(
        """
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
        """
    )

    op.create_table(
        "organizations",
        sa.Column("organization_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_name", sa.String(length=200), nullable=False),
        sa.Column("organization_code", sa.String(length=80), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default=sa.text("'ACTIVE'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'DELETED')", name="ck_organizations_status"),
        sa.UniqueConstraint("organization_code", name="uq_organizations_organization_code"),
    )

    op.create_table(
        "brands",
        sa.Column("brand_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_id", UUID, nullable=False),
        sa.Column("brand_name", sa.String(length=200), nullable=False),
        sa.Column("brand_code", sa.String(length=80), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default=sa.text("'ACTIVE'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'DELETED')", name="ck_brands_status"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.organization_id"], ondelete="CASCADE", name="fk_brands_organization_id"),
        sa.UniqueConstraint("organization_id", "brand_code", name="uq_brands_organization_brand_code"),
    )

    op.create_index("ix_brands_organization_status", "brands", ["organization_id", "status"])

    op.create_table(
        "users",
        sa.Column("user_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_id", UUID, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=120), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default=sa.text("'ACTIVE'")),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'DELETED')", name="ck_users_status"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.organization_id"], ondelete="CASCADE", name="fk_users_organization_id"),
        sa.UniqueConstraint("organization_id", "email", name="uq_users_organization_email"),
    )

    op.create_index("ix_users_organization_status", "users", ["organization_id", "status"])

    op.create_table(
        "channel_accounts",
        sa.Column("channel_account_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_id", UUID, nullable=False),
        sa.Column("brand_id", UUID, nullable=True),
        sa.Column("channel_type", sa.String(length=40), nullable=False),
        sa.Column("channel_name", sa.String(length=200), nullable=False),
        sa.Column("external_account_id", sa.String(length=255), nullable=False),
        sa.Column("access_token_enc", sa.Text(), nullable=False),
        sa.Column("refresh_token_enc", sa.Text(), nullable=True),
        sa.Column("token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("health_status", sa.String(length=20), nullable=False, server_default=sa.text("'HEALTHY'")),
        sa.Column("status", sa.String(length=20), nullable=False, server_default=sa.text("'ACTIVE'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("channel_type IN ('instagram', 'x', 'facebook', 'youtube', 'threads', 'etc')", name="ck_channel_accounts_channel_type"),
        sa.CheckConstraint("health_status IN ('HEALTHY', 'WARNING', 'UNHEALTHY', 'EXPIRED')", name="ck_channel_accounts_health_status"),
        sa.CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'DELETED')", name="ck_channel_accounts_status"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.organization_id"], ondelete="CASCADE", name="fk_channel_accounts_organization_id"),
        sa.ForeignKeyConstraint(["brand_id"], ["brands.brand_id"], ondelete="SET NULL", name="fk_channel_accounts_brand_id"),
        sa.UniqueConstraint("channel_type", "external_account_id", name="uq_channel_accounts_channel_external_account"),
    )

    op.create_index("ix_channel_accounts_org_brand_channel", "channel_accounts", ["organization_id", "brand_id", "channel_type"])

    op.create_table(
        "content_items",
        sa.Column("content_item_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_id", UUID, nullable=False),
        sa.Column("brand_id", UUID, nullable=False),
        sa.Column("created_by_user_id", UUID, nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body_text", sa.Text(), nullable=False),
        sa.Column("planned_publish_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("content_status", sa.String(length=30), nullable=False, server_default=sa.text("'DRAFT'")),
        sa.Column("approval_status", sa.String(length=30), nullable=False, server_default=sa.text("'NOT_REQUESTED'")),
        sa.Column("priority_cd", sa.String(length=20), nullable=False, server_default=sa.text("'NORMAL'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "content_status IN ('DRAFT', 'PENDING_APPROVAL', 'REJECTED', 'APPROVED', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED')",
            name="ck_content_items_content_status",
        ),
        sa.CheckConstraint(
            "approval_status IN ('NOT_REQUESTED', 'REQUESTED', 'APPROVED', 'REJECTED', 'CANCELLED')",
            name="ck_content_items_approval_status",
        ),
        sa.CheckConstraint("priority_cd IN ('NORMAL', 'HIGH', 'URGENT')", name="ck_content_items_priority"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.organization_id"], ondelete="CASCADE", name="fk_content_items_organization_id"),
        sa.ForeignKeyConstraint(["brand_id"], ["brands.brand_id"], ondelete="CASCADE", name="fk_content_items_brand_id"),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.user_id"], ondelete="RESTRICT", name="fk_content_items_created_by_user_id"),
    )

    op.create_index("ix_content_items_org_brand_status_publish_at", "content_items", ["organization_id", "brand_id", "content_status", "planned_publish_at"])

    op.create_table(
        "approval_requests",
        sa.Column("approval_request_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("content_item_id", UUID, nullable=False),
        sa.Column("requested_by_user_id", UUID, nullable=False),
        sa.Column("current_status", sa.String(length=20), nullable=False, server_default=sa.text("'REQUESTED'")),
        sa.Column("requested_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rejected_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("current_status IN ('REQUESTED', 'APPROVED', 'REJECTED', 'CANCELLED')", name="ck_approval_requests_current_status"),
        sa.ForeignKeyConstraint(["content_item_id"], ["content_items.content_item_id"], ondelete="CASCADE", name="fk_approval_requests_content_item_id"),
        sa.ForeignKeyConstraint(["requested_by_user_id"], ["users.user_id"], ondelete="RESTRICT", name="fk_approval_requests_requested_by_user_id"),
    )

    op.create_index("ux_approval_requests_content_item_requested", "approval_requests", ["content_item_id"], unique=True, postgresql_where=sa.text("current_status = 'REQUESTED'"))
    op.create_index("ix_approval_requests_content_status_requested_at", "approval_requests", ["content_item_id", "current_status", "requested_at"])

    op.create_table(
        "publish_jobs",
        sa.Column("publish_job_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_id", UUID, nullable=False),
        sa.Column("content_item_id", UUID, nullable=False),
        sa.Column("brand_id", UUID, nullable=False),
        sa.Column("channel_account_id", UUID, nullable=False),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("job_status", sa.String(length=20), nullable=False, server_default=sa.text("'QUEUED'")),
        sa.Column("idempotency_key", sa.String(length=120), nullable=False),
        sa.Column("last_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("succeeded_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("failed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("job_status IN ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'RETRY_SCHEDULED', 'CANCELLED')", name="ck_publish_jobs_job_status"),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.organization_id"], ondelete="CASCADE", name="fk_publish_jobs_organization_id"),
        sa.ForeignKeyConstraint(["content_item_id"], ["content_items.content_item_id"], ondelete="CASCADE", name="fk_publish_jobs_content_item_id"),
        sa.ForeignKeyConstraint(["brand_id"], ["brands.brand_id"], ondelete="CASCADE", name="fk_publish_jobs_brand_id"),
        sa.ForeignKeyConstraint(["channel_account_id"], ["channel_accounts.channel_account_id"], ondelete="RESTRICT", name="fk_publish_jobs_channel_account_id"),
        sa.UniqueConstraint("idempotency_key", name="uq_publish_jobs_idempotency_key"),
    )

    op.create_index("ix_publish_jobs_org_status_scheduled", "publish_jobs", ["organization_id", "job_status", "scheduled_at"])
    op.create_index("ix_publish_jobs_channel_status_scheduled", "publish_jobs", ["channel_account_id", "job_status", "scheduled_at"])
    op.create_index("ix_publish_jobs_content_item", "publish_jobs", ["content_item_id"])

    op.create_table(
        "audit_logs",
        sa.Column("audit_log_id", UUID, server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("organization_id", UUID, nullable=False),
        sa.Column("actor_user_id", UUID, nullable=True),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("entity_id", UUID, nullable=False),
        sa.Column("action_type", sa.String(length=80), nullable=False),
        sa.Column("before_data", JSONB, nullable=True),
        sa.Column("after_data", JSONB, nullable=True),
        sa.Column("ip_address", postgresql.INET, nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.organization_id"], ondelete="CASCADE", name="fk_audit_logs_organization_id"),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.user_id"], ondelete="SET NULL", name="fk_audit_logs_actor_user_id"),
    )

    op.create_index("ix_audit_logs_org_occurred", "audit_logs", ["organization_id", "occurred_at"])
    op.create_index("ix_audit_logs_entity", "audit_logs", ["entity_type", "entity_id"])

    for table_name in (
        "organizations",
        "brands",
        "users",
        "channel_accounts",
        "content_items",
        "approval_requests",
        "publish_jobs",
    ):
        op.execute(
            f"""
            CREATE TRIGGER trg_{table_name}_updated_at
            BEFORE UPDATE ON {table_name}
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at()
            """
        )


def downgrade() -> None:
    for table_name in (
        "publish_jobs",
        "approval_requests",
        "content_items",
        "channel_accounts",
        "users",
        "brands",
        "organizations",
    ):
        op.execute(f"DROP TRIGGER IF EXISTS trg_{table_name}_updated_at ON {table_name}")

    op.drop_index("ix_audit_logs_entity", table_name="audit_logs")
    op.drop_index("ix_audit_logs_org_occurred", table_name="audit_logs")
    op.drop_table("audit_logs")

    op.drop_index("ix_publish_jobs_content_item", table_name="publish_jobs")
    op.drop_index("ix_publish_jobs_channel_status_scheduled", table_name="publish_jobs")
    op.drop_index("ix_publish_jobs_org_status_scheduled", table_name="publish_jobs")
    op.drop_table("publish_jobs")

    op.drop_index("ix_approval_requests_content_status_requested_at", table_name="approval_requests")
    op.drop_index("ux_approval_requests_content_item_requested", table_name="approval_requests")
    op.drop_table("approval_requests")

    op.drop_index("ix_content_items_org_brand_status_publish_at", table_name="content_items")
    op.drop_table("content_items")

    op.drop_index("ix_channel_accounts_org_brand_channel", table_name="channel_accounts")
    op.drop_table("channel_accounts")

    op.drop_index("ix_users_organization_status", table_name="users")
    op.drop_table("users")

    op.drop_index("ix_brands_organization_status", table_name="brands")
    op.drop_table("brands")

    op.drop_table("organizations")

    op.execute("DROP EXTENSION IF EXISTS pgcrypto")
    op.execute("DROP FUNCTION IF EXISTS set_updated_at()")
