module.exports = function scanDatastore() {
  return {
    tables: {
      users: ["id", "username", "password_hash"],
      todos: ["id", "user_id", "text", "is_public", "created_at"]
    },
    redis: {
      keys: ["user_session:<id>", "public_todos_cache"]
    }
  };
};
