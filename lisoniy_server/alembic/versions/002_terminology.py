"""Add terminology tables - categories, terms, definitions, and audit logs

Revision ID: 002_terminology
Revises: 001_initial
Create Date: 2026-01-26 12:42:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR


# revision identifiers, used by Alembic.
revision: str = '002_terminology'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create terminology tables"""
    
    # Note: AuditAction enum will be created automatically by SQLAlchemy
    # when it encounters the Enum column in term_audit_logs table
    
    # Create categories table
    op.create_table(
        'categories',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for categories
    op.create_index('ix_categories_id', 'categories', ['id'], unique=False)
    op.create_index('ix_categories_slug', 'categories', ['slug'], unique=True)
    
    # Create terms table
    op.create_table(
        'terms',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('keyword', sa.String(length=255), nullable=False),
        sa.Column('category_id', UUID(as_uuid=True), nullable=False),
        sa.Column('creator_id', sa.Integer(), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('deleted_by', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['creator_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['deleted_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for terms
    op.create_index('ix_terms_id', 'terms', ['id'], unique=False)
    op.create_index('ix_terms_keyword', 'terms', ['keyword'], unique=True)
    op.create_index('ix_terms_category_id', 'terms', ['category_id'], unique=False)
    op.create_index('ix_terms_creator_id', 'terms', ['creator_id'], unique=False)
    
    # Create definitions table
    op.create_table(
        'definitions',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('term_id', UUID(as_uuid=True), nullable=False),
        sa.Column('language', sa.String(length=2), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('example', sa.Text(), nullable=True),
        sa.Column('is_approved', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('search_vector', TSVECTOR(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['term_id'], ['terms.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for definitions
    op.create_index('ix_definitions_id', 'definitions', ['id'], unique=False)
    op.create_index('ix_definitions_term_id', 'definitions', ['term_id'], unique=False)
    op.create_index('idx_definitions_language', 'definitions', ['language'], unique=False)
    op.create_index('idx_definitions_search_vector', 'definitions', ['search_vector'], 
                    unique=False, postgresql_using='gin')
    
    # Create function to update search_vector automatically
    op.execute("""
        CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
        BEGIN
            NEW.search_vector := to_tsvector('simple', COALESCE(NEW.text, '') || ' ' || COALESCE(NEW.example, ''));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    # Create trigger to auto-update search_vector
    op.execute("""
        CREATE TRIGGER definitions_search_vector_update
        BEFORE INSERT OR UPDATE ON definitions
        FOR EACH ROW EXECUTE FUNCTION update_search_vector();
    """)
    
    # Create term_audit_logs table
    op.create_table(
        'term_audit_logs',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('term_id', UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.Enum('create', 'update', 'delete', name='auditaction'), nullable=False),
        sa.Column('changes', sa.Text(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['term_id'], ['terms.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for audit logs
    op.create_index('ix_term_audit_logs_id', 'term_audit_logs', ['id'], unique=False)
    op.create_index('ix_term_audit_logs_term_id', 'term_audit_logs', ['term_id'], unique=False)
    op.create_index('ix_term_audit_logs_user_id', 'term_audit_logs', ['user_id'], unique=False)
    op.create_index('ix_term_audit_logs_timestamp', 'term_audit_logs', ['timestamp'], unique=False)


def downgrade() -> None:
    """Drop terminology tables"""
    
    # Drop audit logs
    op.drop_index('ix_term_audit_logs_timestamp', table_name='term_audit_logs')
    op.drop_index('ix_term_audit_logs_user_id', table_name='term_audit_logs')
    op.drop_index('ix_term_audit_logs_term_id', table_name='term_audit_logs')
    op.drop_index('ix_term_audit_logs_id', table_name='term_audit_logs')
    op.drop_table('term_audit_logs')
    
    # Drop trigger and function
    op.execute("DROP TRIGGER IF EXISTS definitions_search_vector_update ON definitions")
    op.execute("DROP FUNCTION IF EXISTS update_search_vector()")
    
    # Drop definitions
    op.drop_index('idx_definitions_search_vector', table_name='definitions')
    op.drop_index('idx_definitions_language', table_name='definitions')
    op.drop_index('ix_definitions_term_id', table_name='definitions')
    op.drop_index('ix_definitions_id', table_name='definitions')
    op.drop_table('definitions')
    
    # Drop terms
    op.drop_index('ix_terms_creator_id', table_name='terms')
    op.drop_index('ix_terms_category_id', table_name='terms')
    op.drop_index('ix_terms_keyword', table_name='terms')
    op.drop_index('ix_terms_id', table_name='terms')
    op.drop_table('terms')
    
    # Drop categories
    op.drop_index('ix_categories_slug', table_name='categories')
    op.drop_index('ix_categories_id', table_name='categories')
    op.drop_table('categories')
    
    # Drop enum type
    op.execute('DROP TYPE IF EXISTS auditaction')
