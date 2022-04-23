const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const ErrNotFound = require('../errors/err-not-found');

router.use(usersRouter);
router.use(moviesRouter);
router.all('*', () => {
  throw new ErrNotFound('Запрашиваемый ресурс не найден 404');
});

module.exports = router;
