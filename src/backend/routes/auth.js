const express = require('express');

function createAuthRouter({ controller, authenticate }) {
  const router = express.Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/me', authenticate, controller.me);
  return router;
}

module.exports = { createAuthRouter };
