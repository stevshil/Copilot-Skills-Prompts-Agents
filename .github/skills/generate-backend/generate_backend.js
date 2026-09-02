module.exports = function generateBackend() {
  return {
    files: {
      "src/backend/server.js": "/* Express server code */",
      "src/backend/routes/todos.js": "/* CRUD routes */",
      "src/backend/auth.js": "/* JWT auth */",
      "src/backend/models/todo.js": "/* Todo model */"
    }
  };
};
