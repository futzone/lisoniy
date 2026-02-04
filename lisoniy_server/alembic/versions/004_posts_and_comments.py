"""posts and comments

Revision ID: 004_posts_and_comments
Revises: 003_dataset_management
Create Date: 2026-01-27 16:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '004_posts_and_comments'
down_revision: Union[str, None] = '003_dataset_management'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create posts table
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('files', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('tags', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_posts_id'), 'posts', ['id'], unique=False)
    op.create_index(op.f('ix_posts_owner_id'), 'posts', ['owner_id'], unique=False)
    op.create_index(op.f('ix_posts_type'), 'posts', ['type'], unique=False)
    op.create_index(op.f('ix_posts_created_at'), 'posts', ['created_at'], unique=False)
    op.create_index('ix_posts_tags_gin', 'posts', ['tags'], unique=False, postgresql_using='gin')

    # Create comments table
    op.create_table(
        'comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['parent_id'], ['comments.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_comments_id'), 'comments', ['id'], unique=False)
    op.create_index(op.f('ix_comments_owner_id'), 'comments', ['owner_id'], unique=False)
    op.create_index(op.f('ix_comments_post_id'), 'comments', ['post_id'], unique=False)
    op.create_index(op.f('ix_comments_parent_id'), 'comments', ['parent_id'], unique=False)
    op.create_index(op.f('ix_comments_created_at'), 'comments', ['created_at'], unique=False)


def downgrade() -> None:
    # Drop comments table first (due to foreign key dependencies)
    op.drop_index(op.f('ix_comments_created_at'), table_name='comments')
    op.drop_index(op.f('ix_comments_parent_id'), table_name='comments')
    op.drop_index(op.f('ix_comments_post_id'), table_name='comments')
    op.drop_index(op.f('ix_comments_owner_id'), table_name='comments')
    op.drop_index(op.f('ix_comments_id'), table_name='comments')
    op.drop_table('comments')

    # Drop posts table
    op.drop_index('ix_posts_tags_gin', table_name='posts', postgresql_using='gin')
    op.drop_index(op.f('ix_posts_created_at'), table_name='posts')
    op.drop_index(op.f('ix_posts_type'), table_name='posts')
    op.drop_index(op.f('ix_posts_owner_id'), table_name='posts')
    op.drop_index(op.f('ix_posts_id'), table_name='posts')
    op.drop_table('posts')
