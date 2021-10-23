const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { isCelebrateError } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middleware/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { emailRegex } = require('./utils/regexDict');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-err');
const { url } = require('./config/db.config');

const app = express();

// mongodb connection string
mongoose.connect(url, {});

// cors middleware
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  allowedHeaders: ['*'],
}));

// json body format
app.use(express.json());

// all requests logger middleware
app.use(requestLogger);

// healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'OK!' });
});

// login endpoint
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), login);

// registration endpoint
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), createUser);

// protecting endpoints by the authorization
app.use(auth);

// users endpoints routing
app.use('/users', usersRouter);

// movies endpoints routing
app.use('/movies', moviesRouter);

// not-found endpoint
app.use((req, res, next) => {
  next(new NotFoundError());
});

// error logger middleware
app.use(errorLogger);

// centrilized error handler middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  if (isCelebrateError(err)) {
    res.status(400).send({ message: 'Переданы неправильные данные в запросе' });
  } else {
    res.status(status).send({ message: message || 'Произошла ошибка на сервере' });
  }
  next();
});

module.exports.app = app;
module.exports.db = mongoose;
