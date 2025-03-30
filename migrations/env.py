from flask import current_app
from alembic import context
import logging
from logging.config import fileConfig
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get('SCHEMA')

# Import the SCHEMA configuration from the Flask app context
# SCHEMA = current_app.config.get('SCHEMA', 'anigram_schema')  # Default to 'anigram_schema' if SCHEMA isn't set

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

def get_engine():
    try:
        # this works with Flask-SQLAlchemy<3 and Alchemical
        return current_app.extensions['migrate'].db.get_engine()
    except TypeError:
        # this works with Flask-SQLAlchemy>=3
        return current_app.extensions['migrate'].db.engine

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
config.set_main_option(
    'sqlalchemy.url', str(get_engine().url).replace('%', '%%'))
target_db = current_app.extensions['migrate'].db


# Add schema to the migration process, using the SCHEMA value
def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=get_metadata(), literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""

    # This callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            process_revision_directives=process_revision_directives,
            **current_app.extensions['migrate'].configure_args
        )
        if environment == "production":
            # Drop the schema if it exists
            try:
                logger.info(f"Dropping schema {SCHEMA} if it exists.")
                connection.execute(f"DROP SCHEMA IF EXISTS {SCHEMA} CASCADE")  # CASCADE will drop objects within the schema
            except Exception as e:
                logger.error(f"Error dropping schema {SCHEMA}: {str(e)}")

            # Create the schema
            logger.info(f"Creating schema {SCHEMA} if it does not exist.")
            connection.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}")
        #! uncomment this for production
        # Set the schema before running migrations
        # with connection.begin():
        #     connection.execute(f'SET search_path TO {SCHEMA};')  # Set the schema in the connection
        #     context.run_migrations()

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
