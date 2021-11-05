/* eslint-disable global-require */
const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middleware/auth');
const NotFoundError = require('../errors/not-found-err');

const router = express.Router();

// healthcheck endpoint
router.get('/healthcheck', (req, res) => {
  res.status(200).json({ message: 'OK!' });
});

router.use(authRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);

/* eslint-disable-next-line no-unused-vars */
router.use((req, res, next) => {
  throw new NotFoundError();
});

module.exports = router;
