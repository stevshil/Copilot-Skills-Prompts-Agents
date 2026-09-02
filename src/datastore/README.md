# Todo datastore

The backend uses SQLite. `schema.sql` is applied automatically when the API
starts and creates the `users` and `todos` tables plus indexes for owner and
public-todo queries.

Set `DATABASE_PATH` to choose a persistent database location. Tests use an
in-memory database.
