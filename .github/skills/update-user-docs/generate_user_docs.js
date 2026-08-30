module.exports = function generateUserDocs() {
  return {
    build: "npm install && npm run build",
    start: "npm run start",
    admin: "Admins can manage users and view all public todos.",
    quizmaster: "Quiz Masters can create shared public todo challenges.",
    player: "Players can complete tasks and view public items."
  };
};
