const jwt = require('jsonwebtoken');
const ErrUnauthorized = require('../errors/err-unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrUnauthorized('Требуется авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new ErrUnauthorized('Требуется авторизация');
  }

  req.user = payload;
  next();
};
