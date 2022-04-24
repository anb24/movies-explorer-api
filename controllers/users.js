const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { DEV_JWT_SECRET } = require('../config/devEnvConfig');
const ErrBadRequest = require('../errors/err-bad-request');
const ErrConflict = require('../errors/err-conflict');
const ErrNotFound = require('../errors/err-not-found');

const { NODE_ENV, JWT_SECRET } = process.env;

// регистрация пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.send({ name, email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ErrConflict('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

// получение пользователя
module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrNotFound('Пользователь с таким ID не найден'))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

// обновление пользователя
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  // if (!name || !email) throw new ErrBadRequest('Переданы некорректные данные');
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new ErrNotFound('Пользователь с таким ID не найден'))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ErrConflict('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};
