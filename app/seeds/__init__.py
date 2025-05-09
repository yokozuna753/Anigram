from flask.cli import AppGroup
from .users import seed_users, undo_users
from .follows import seed_follows, undo_follows
from .watchlist import seed_watchlists, undo_watchlists
from .anime import seed_anime, undo_anime
from .user_anime import seed_user_anime, undo_user_anime

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_follows()
        undo_watchlists()
        undo_anime()
        undo_user_anime()
    seed_users()
    seed_follows()
    seed_watchlists()
    seed_anime()
    seed_user_anime()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_follows()
    undo_watchlists()
    undo_anime()
    undo_user_anime()
    # Add other undo functions here
