const Movie = require('../models/movie');
const ErrBadRequest = require('../errors/err-bad-request');
const ErrNotFound = require('../errors/err-not-found');
const ErrForbidden = require('../errors/err-forbidden');

// получить фильмы пользователя
module.exports.getFavoritesMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner }).select('+owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

// добавить фильм в избранное
module.exports.addMovieToFavorites = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailer, thumbnail,
    movieId,
    nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удалить фильм из избранного
module.exports.deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  const { _id } = req.params;
  Movie.findById(_id)
    .select('+owner')
    .orFail(new ErrNotFound('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        return next(new ErrForbidden('Невозможно удалить'));
      }
      return Movie.findByIdAndRemove(_id)
        .select('-owner')
        .then(() => res.send({ message: 'Фильм успешно удалён' }));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrBadRequest('Невалидный ID'));
      } else {
        next(err);
      }
    });
};
