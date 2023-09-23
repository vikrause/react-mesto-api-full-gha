const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
