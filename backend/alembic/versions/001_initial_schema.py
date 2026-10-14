"""Initial schema migration for MedFind

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-14 21:05:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('email', sa.String(255), unique=True, index=True, nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('phone_number', sa.String(50), nullable=True),
        sa.Column('role', sa.String(50), nullable=False, server_default='patient'),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Pharmacies table
    op.create_table(
        'pharmacies',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('owner_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('name', sa.String(255), index=True, nullable=False),
        sa.Column('license_number', sa.String(100), unique=True, nullable=False),
        sa.Column('address', sa.String(500), nullable=False),
        sa.Column('city', sa.String(100), index=True, nullable=False),
        sa.Column('postal_code', sa.String(20), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('phone', sa.String(50), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('opening_hours', sa.String(255), server_default='08:00 - 20:00'),
        sa.Column('is_verified', sa.Boolean(), server_default='false'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Medicines table
    op.create_table(
        'medicines',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('brand_name', sa.String(255), index=True, nullable=False),
        sa.Column('generic_name', sa.String(255), index=True, nullable=False),
        sa.Column('dosage_form', sa.String(100), server_default='Tablet'),
        sa.Column('strength', sa.String(100), nullable=True),
        sa.Column('manufacturer', sa.String(255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('requires_prescription', sa.Boolean(), server_default='true'),
        sa.Column('is_controlled', sa.Boolean(), server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Stocks table
    op.create_table(
        'stocks',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('pharmacy_id', sa.Integer(), sa.ForeignKey('pharmacies.id'), nullable=False),
        sa.Column('medicine_id', sa.Integer(), sa.ForeignKey('medicines.id'), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='0', nullable=False),
        sa.Column('unit_price', sa.Float(), nullable=True),
        sa.Column('status', sa.String(50), server_default='OUT_OF_STOCK', nullable=False),
        sa.Column('last_updated', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('pharmacy_id', 'medicine_id', name='uq_pharmacy_medicine'),
    )

    # Enquiries table
    op.create_table(
        'enquiries',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('pharmacy_id', sa.Integer(), sa.ForeignKey('pharmacies.id'), nullable=False),
        sa.Column('medicine_query', sa.String(255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('response_message', sa.Text(), nullable=True),
        sa.Column('status', sa.String(50), server_default='PENDING', nullable=False),
        sa.Column('contact_phone', sa.String(50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('responded_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Holds table
    op.create_table(
        'holds',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('reservation_code', sa.String(50), unique=True, index=True, nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('pharmacy_id', sa.Integer(), sa.ForeignKey('pharmacies.id'), nullable=False),
        sa.Column('medicine_id', sa.Integer(), sa.ForeignKey('medicines.id'), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('status', sa.String(50), server_default='ACTIVE', nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('holds')
    op.drop_table('enquiries')
    op.drop_table('stocks')
    op.drop_table('medicines')
    op.drop_table('pharmacies')
    op.drop_table('users')
