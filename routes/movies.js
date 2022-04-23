const movieRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { isURL } = require('validator');
const auth = require('../middlewares/auth');

const {
  getFavoritesMovies, addMovieToFavorites, deleteMovieById,
} = require('../controllers/movies');

movieRouter.use(auth);

// возвращает все сохранённые текущим  пользователем фильмы
movieRouter.get('/movies', getFavoritesMovies);

// создаёт фильм с переданными в теле данными
movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: true,
      })) return value;
      return helpers.message('Некорректный формат');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: true,
      })) return value;
      return helpers.message('Некорректный формат');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: true,
      })) return value;
      return helpers.message('Некорректный формат');
    }),
    movieId: Joi.number().required(),
  }),
}), addMovieToFavorites);

// удаляет сохранённый фильм по id
movieRouter.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteMovieById);

module.exports = movieRouter;
