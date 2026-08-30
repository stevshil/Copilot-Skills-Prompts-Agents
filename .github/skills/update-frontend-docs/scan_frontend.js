module.exports = function scanFrontend() {
  return {
    components: ["TodoList", "TodoItem", "PublicTodoList", "LoginForm"],
    flows: ["User login", "Fetch user todos", "Fetch public todos"]
  };
};
