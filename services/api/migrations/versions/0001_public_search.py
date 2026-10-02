"""Initial public catalogue, pharmacy and stock tables."""

import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "products",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("strength", sa.String(40), nullable=False),
        sa.Column("form", sa.String(80), nullable=False),
        sa.Column("brand", sa.String(120)),
        sa.Column("active", sa.Boolean(), nullable=False),
    )
    op.create_table(
        "pharmacies",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(160), nullable=False),
        sa.Column("town", sa.String(80), nullable=False),
        sa.Column("address", sa.String(240), nullable=False),
        sa.Column("phone", sa.String(24)),
        sa.Column("verified", sa.Boolean(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
    )
    op.create_index("ix_pharmacies_town", "pharmacies", ["town"])
    op.create_table(
        "stock_reports",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("pharmacy_id", sa.Uuid(), sa.ForeignKey("pharmacies.id"), nullable=False),
        sa.Column("product_id", sa.Uuid(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column("confirmed_at", sa.DateTime(timezone=True)),
        sa.Column("unresolved_discrepancy", sa.Boolean(), nullable=False),
        sa.UniqueConstraint("pharmacy_id", "product_id", name="uq_stock_pair"),
        sa.CheckConstraint("status IN ('IN_STOCK','LOW','OUT','UNKNOWN')", name="ck_stock_status"),
    )


def downgrade():
    op.drop_table("stock_reports")
    op.drop_index("ix_pharmacies_town", table_name="pharmacies")
    op.drop_table("pharmacies")
    op.drop_table("products")
