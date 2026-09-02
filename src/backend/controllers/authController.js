const bcrypt = require('bcryptjs');
const { createToken } = require('../auth');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliseEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validateCredentials(body) {
  const email = normaliseEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: 'A valid email address is required' };
  }
  if (password.length < 8 || password.length > 128) {
    return { error: 'Password must be between 8 and 128 characters' };
  }
  return { email, password };
}

function createAuthController({ userModel, jwtSecret }) {
  return {
    async register(request, response, next) {
      try {
        const credentials = validateCredentials(request.body || {});
        if (credentials.error) return response.status(400).json({ error: credentials.error });
        if (userModel.findByEmail(credentials.email)) {
          return response.status(409).json({ error: 'An account with that email already exists' });
        }

        const passwordHash = await bcrypt.hash(credentials.password, 12);
        const user = userModel.create({ email: credentials.email, passwordHash });
        return response.status(201).json({
          user: { id: user.id, email: user.email, createdAt: user.createdAt },
          token: createToken(user, jwtSecret)
        });
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return response.status(409).json({ error: 'An account with that email already exists' });
        }
        return next(error);
      }
    },

    async login(request, response, next) {
      try {
        const credentials = validateCredentials(request.body || {});
        if (credentials.error) return response.status(400).json({ error: credentials.error });

        const user = userModel.findByEmail(credentials.email);
        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          return response.status(401).json({ error: 'Invalid email or password' });
        }

        return response.json({
          user: { id: user.id, email: user.email, createdAt: user.createdAt },
          token: createToken(user, jwtSecret)
        });
      } catch (error) {
        return next(error);
      }
    },

    me(request, response) {
      return response.json({ user: request.user });
    }
  };
}

module.exports = { createAuthController };
