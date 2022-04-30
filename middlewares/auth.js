const jwt = require('jsonwebtoken');
const { DEV_JWT_SECRET } = require('../config/devEnvConfig');
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
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    throw new ErrUnauthorized('Требуется авторизация');
  }

  req.user = payload;
  next();
};
