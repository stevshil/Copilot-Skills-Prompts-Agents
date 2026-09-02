const express = require('express');

function createTodoRouter({ controller, authenticate, optionalAuthenticate }) {
  const router = express.Router();
  router.get('/public', controller.listPublic);
  router.get('/:id', optionalAuthenticate, controller.get);
  router.use(authenticate);
  router.get('/', controller.list);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

module.exports = { createTodoRouter };
