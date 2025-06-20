"""initial schema with foreign key

Revision ID: 8a6d8c53615b
Revises:
Create Date: 2025-06-17 00:18:41.384629
"""

from alembic import op
import sqlalchemy as sa
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = "8a6d8c53615b"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    schema = SCHEMA if environment == "production" else None

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=40), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
        schema=schema
    )

    op.create_table(
        "rooms",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        schema=schema
    )

    op.create_table(
        "plant",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("room_id", sa.Integer(), nullable=False),
        sa.Column("api_id", sa.Integer(), nullable=True),
        sa.Column("common_name", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("watering", sa.String(), nullable=True),
        sa.Column("sunlight", sa.String(), nullable=True),
        sa.Column("growth_rate", sa.String(), nullable=True),
        sa.Column("care_level", sa.String(), nullable=True),
        sa.Column("maintenance", sa.String(), nullable=True),
        sa.Column("soil", sa.String(), nullable=True),
        sa.Column("last_watered", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=schema
    )

    # ✅ Add foreign key from plant.room_id → rooms.id
    op.create_foreign_key(
        "fk_plant_room_id_rooms",  # constraint name
        "plant",                   # source table
        "rooms",                   # target table
        ["room_id"],               # local column
        ["id"],                    # remote column
        source_schema=schema,
        referent_schema=schema
    )


def downgrade():
    schema = SCHEMA if environment == "production" else None

    op.drop_constraint("fk_plant_room_id_rooms", "plant", schema=schema, type_="foreignkey")
    op.drop_table("plant", schema=schema)
    op.drop_table("rooms", schema=schema)
    op.drop_table("users", schema=schema)
