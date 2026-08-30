// Example: scan Express routes or similar
module.exports = function scanApi() {
  // Parse backend files and extract endpoints
  return {
    endpoints: [
      {
        path: "/api/todos",
        method: "GET",
        auth: "user",
        description: "Returns todos belonging to the authenticated user plus public items."
      },
      {
        path: "/api/todos",
        method: "POST",
        auth: "user",
        description: "Creates a new todo item."
      }
    ]
  };
};
