const userRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { isEmail } = require('validator');
const auth = require('../middlewares/auth');

const {
  createUser, login, getProfile, updateProfile,
} = require('../controllers/users');

// роут регистрации. создаёт пользователя с переданными в теле email, password и name
userRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().lowercase().trim()
      .custom((value, helpers) => {
        if (isEmail(value, {
          require_tld: true,
        })) return value;
        return helpers.message('Некорректный формат');
      }),
    password: Joi.string().required(),
  }),
}), createUser);

// роут авторизации. проверяет переданные в теле почту и пароль и возвращает JWT
userRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().lowercase().trim()
      .custom((value, helpers) => {
        if (isEmail(value, {
          require_tld: true,
        })) return value;
        return helpers.message('Некорректный формат');
      }),
    password: Joi.string().required().min(8),
  }),
}), login);

userRouter.use(auth);

// возвращает информацию о пользователе (email и имя)
userRouter.get('/users/me', getProfile);

// обновляет информацию о пользователе (email и имя)
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().lowercase().trim()
      .custom((value, helpers) => {
        if (isEmail(value, {
          require_tld: true,
        })) return value;
        return helpers.message('Некорректный формат');
      }),
  }),
}), updateProfile);

module.exports = userRouter;
