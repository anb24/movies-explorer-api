const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const ErrNotFound = require('../errors/err-not-found');

router.use(usersRouter);
router.use(moviesRouter);
router.use('*', () => {
  throw new ErrNotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
