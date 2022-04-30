const mongoose = require('mongoose');
const valid = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: 'Некорректный формат',
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: 'Некорректный формат',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: 'Некорректный формат',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    select: true,
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
