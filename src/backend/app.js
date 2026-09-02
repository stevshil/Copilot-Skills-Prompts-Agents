const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { getConfig } = require('./config');
const { createDatabase } = require('./db');
const { authenticateToken, optionalAuthenticateToken } = require('./auth');
const { UserModel } = require('./models/user');
const { TodoModel } = require('./models/todo');
const { createAuthController } = require('./controllers/authController');
const { createTodoController } = require('./controllers/todoController');
const { createAuthRouter } = require('./routes/auth');
const { createTodoRouter } = require('./routes/todos');

function createApp(options = {}) {
  const config = { ...getConfig(), ...options };
  const database = options.database || createDatabase(config.databasePath);
  const userModel = new UserModel(database);
  const todoModel = new TodoModel(database);
  const authenticate = authenticateToken({ secret: config.jwtSecret, userModel });
  const optionalAuthenticate = optionalAuthenticateToken({ secret: config.jwtSecret, userModel });
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (request, response) => response.json({ status: 'ok' }));
  app.use('/api/auth', createAuthRouter({
    controller: createAuthController({ userModel, jwtSecret: config.jwtSecret }),
    authenticate
  }));
  app.use('/api/todos', createTodoRouter({
    controller: createTodoController({ todoModel }),
    authenticate,
    optionalAuthenticate
  }));

  app.use((request, response) => response.status(404).json({ error: 'Route not found' }));
  app.use((error, request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return response.status(400).json({ error: 'Request body must be valid JSON' });
    }
    console.error(error);
    return response.status(500).json({ error: 'Internal server error' });
  });

  return { app, database, models: { userModel, todoModel } };
}

module.exports = { createApp };
