"""Add dataset metadata and interaction tracking

Revision ID: 005_dataset_meta
Revises: 004_posts_and_comments
Create Date: 2026-01-28

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '005_dataset_meta'
down_revision = '004_posts_and_comments'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create dataset_meta, dataset_stars, and dataset_contributors tables"""
    
    # Create dataset_meta table
    op.create_table(
        'dataset_meta',
        sa.Column('dataset_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('stars_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('downloads_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('views_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('size_bytes', sa.BigInteger(), nullable=False, server_default='0'),
        sa.Column('readme', sa.Text(), nullable=True, comment='Markdown README content'),
        sa.Column('description', sa.Text(), nullable=True, comment='Extended description'),
        sa.Column('license_type', sa.String(length=100), nullable=True, comment='License type (e.g., MIT, Apache-2.0)'),
        sa.Column('license_text', sa.Text(), nullable=True, comment='Full license text'),
        sa.Column('last_updated_user_id', sa.Integer(), nullable=True, comment='User who last updated the dataset'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['dataset_id'], ['datasets.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['last_updated_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('dataset_id')
    )
    op.create_index('ix_dataset_meta_dataset_id', 'dataset_meta', ['dataset_id'])
    op.create_index('ix_dataset_meta_last_updated_user_id', 'dataset_meta', ['last_updated_user_id'])
    op.create_index('ix_dataset_meta_stars_count', 'dataset_meta', ['stars_count'])
    op.create_index('ix_dataset_meta_downloads_count', 'dataset_meta', ['downloads_count'])
    
    # Create dataset_stars table
    op.create_table(
        'dataset_stars',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('dataset_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['dataset_id'], ['datasets.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('dataset_id', 'user_id', name='uq_dataset_star')
    )
    op.create_index('ix_dataset_stars_dataset_id', 'dataset_stars', ['dataset_id'])
    op.create_index('ix_dataset_stars_user_id', 'dataset_stars', ['user_id'])
    op.create_index('ix_dataset_stars_user_created', 'dataset_stars', ['user_id', 'created_at'])
    
    # Create dataset_contributors table
    op.create_table(
        'dataset_contributors',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('dataset_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('contribution_count', sa.Integer(), nullable=False, server_default='1', comment='Number of times this user has contributed'),
        sa.Column('first_contribution_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('last_contribution_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['dataset_id'], ['datasets.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('dataset_id', 'user_id', name='uq_dataset_contributor')
    )
    op.create_index('ix_dataset_contributors_dataset_id', 'dataset_contributors', ['dataset_id'])
    op.create_index('ix_dataset_contributors_user_id', 'dataset_contributors', ['user_id'])
    op.create_index('ix_dataset_contributors_last_contribution', 'dataset_contributors', ['dataset_id', 'last_contribution_at'])


def downgrade() -> None:
    """Drop dataset_meta, dataset_stars, and dataset_contributors tables"""
    
    # Drop indexes and tables in reverse order
    op.drop_index('ix_dataset_contributors_last_contribution', table_name='dataset_contributors')
    op.drop_index('ix_dataset_contributors_user_id', table_name='dataset_contributors')
    op.drop_index('ix_dataset_contributors_dataset_id', table_name='dataset_contributors')
    op.drop_table('dataset_contributors')
    
    op.drop_index('ix_dataset_stars_user_created', table_name='dataset_stars')
    op.drop_index('ix_dataset_stars_user_id', table_name='dataset_stars')
    op.drop_index('ix_dataset_stars_dataset_id', table_name='dataset_stars')
    op.drop_table('dataset_stars')
    
    op.drop_index('ix_dataset_meta_downloads_count', table_name='dataset_meta')
    op.drop_index('ix_dataset_meta_stars_count', table_name='dataset_meta')
    op.drop_index('ix_dataset_meta_last_updated_user_id', table_name='dataset_meta')
    op.drop_index('ix_dataset_meta_dataset_id', table_name='dataset_meta')
    op.drop_table('dataset_meta')
