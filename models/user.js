const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const ErrUnauthorized = require('../errors/err-unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value, {
        require_tld: true,
      }),
      message: 'Некорректный формат',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function f(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrUnauthorized('Неправильные e-mail или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrUnauthorized('Неправильные e-mail или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
