from logging.config import fileConfig
from src.core.config import settings
from sqlalchemy import create_engine

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from src.models.user import Base
from src.models.activity import Activity

from alembic import context

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = str(settings.DATABASE_URL)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = create_engine(str(settings.DATABASE_URL), poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
