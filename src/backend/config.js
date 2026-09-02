const path = require('node:path');

function getConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';
  const jwtSecret = env.JWT_SECRET || (nodeEnv === 'production' ? '' : 'development-only-change-me');

  if (nodeEnv === 'production' && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  return {
    nodeEnv,
    port: Number.parseInt(env.PORT || '3000', 10),
    jwtSecret,
    databasePath: env.DATABASE_PATH
      ? path.resolve(env.DATABASE_PATH)
      : path.resolve(__dirname, '../../data/todos.sqlite'),
    clientOrigin: env.CLIENT_ORIGIN || 'http://localhost:5173'
  };
}

module.exports = { getConfig };
