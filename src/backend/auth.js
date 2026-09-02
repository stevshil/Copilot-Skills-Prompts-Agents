const jwt = require('jsonwebtoken');

const TOKEN_EXPIRY = '1d';

function createToken(user, secret) {
  return jwt.sign(
    { sub: String(user.id), email: user.email },
    secret,
    { expiresIn: TOKEN_EXPIRY }
  );
}

function authenticateToken({ secret, userModel }) {
  return (request, response, next) => {
    const header = request.get('authorization');
    const [scheme, token] = header ? header.split(' ') : [];

    if (scheme !== 'Bearer' || !token) {
      return response.status(401).json({ error: 'Authentication required' });
    }

    try {
      const payload = jwt.verify(token, secret);
      const user = userModel.findById(Number(payload.sub));
      if (!user) {
        return response.status(401).json({ error: 'Invalid authentication token' });
      }
      request.user = user;
      return next();
    } catch {
      return response.status(401).json({ error: 'Invalid or expired authentication token' });
    }
  };
}

function optionalAuthenticateToken({ secret, userModel }) {
  const required = authenticateToken({ secret, userModel });
  return (request, response, next) => {
    if (!request.get('authorization')) return next();
    return required(request, response, next);
  };
}

module.exports = {
  TOKEN_EXPIRY,
  authenticateToken,
  optionalAuthenticateToken,
  createToken
};
