"""dataset management

Revision ID: 003_dataset_management
Revises: 002_terminology
Create Date: 2026-01-27 12:06:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB


# revision identifiers, used by Alembic.
revision: str = '003_dataset_management'
down_revision: Union[str, None] = '002_terminology'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create datasets and data_entries tables"""
    
    # Create datasets table
    op.create_table(
        'datasets',
        sa.Column('id', UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('creator_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['creator_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for datasets
    op.create_index('ix_datasets_name', 'datasets', ['name'])
    op.create_index('ix_datasets_type', 'datasets', ['type'])
    op.create_index('ix_datasets_creator_id', 'datasets', ['creator_id'])
    op.create_index('ix_datasets_type_public', 'datasets', ['type', 'is_public'])
    op.create_index('ix_datasets_creator_type', 'datasets', ['creator_id', 'type'])
    
    # Create data_entries table
    op.create_table(
        'data_entries',
        sa.Column('id', UUID(as_uuid=True), nullable=False, primary_key=True),
        sa.Column('dataset_id', UUID(as_uuid=True), nullable=False),
        sa.Column('content', JSONB(), nullable=False),
        sa.Column('metadata', JSONB(), nullable=True),
        sa.Column('hash_key', sa.String(length=64), nullable=False),
        sa.Column('creator_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['dataset_id'], ['datasets.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['creator_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('hash_key')
    )
    
    # Create indexes for data_entries
    op.create_index('ix_data_entries_dataset_id', 'data_entries', ['dataset_id'])
    op.create_index('ix_data_entries_hash_key', 'data_entries', ['hash_key'])
    op.create_index('ix_data_entries_creator_id', 'data_entries', ['creator_id'])
    op.create_index('ix_data_entries_dataset_created', 'data_entries', ['dataset_id', 'created_at'])
    
    # Create GIN index on content JSONB column for fast queries
    op.create_index(
        'ix_data_entries_content_gin',
        'data_entries',
        ['content'],
        postgresql_using='gin'
    )


def downgrade() -> None:
    """Drop datasets and data_entries tables"""
    
    # Drop data_entries table and its indexes
    op.drop_index('ix_data_entries_content_gin', table_name='data_entries')
    op.drop_index('ix_data_entries_dataset_created', table_name='data_entries')
    op.drop_index('ix_data_entries_creator_id', table_name='data_entries')
    op.drop_index('ix_data_entries_hash_key', table_name='data_entries')
    op.drop_index('ix_data_entries_dataset_id', table_name='data_entries')
    op.drop_table('data_entries')
    
    # Drop datasets table and its indexes
    op.drop_index('ix_datasets_creator_type', table_name='datasets')
    op.drop_index('ix_datasets_type_public', table_name='datasets')
    op.drop_index('ix_datasets_creator_id', table_name='datasets')
    op.drop_index('ix_datasets_type', table_name='datasets')
    op.drop_index('ix_datasets_name', table_name='datasets')
    op.drop_table('datasets')
