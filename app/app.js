const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { isCelebrateError } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
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

// main router
app.use(require('./routes/index'));

// error logger middleware
app.use(errorLogger);

// centrilized error handler middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  if (isCelebrateError(err)) {
    res.status(400).send({ message: 'Переданы неправильные данные в запросе' });
  } else {
    res.status(status).send({ message });
  }
  next();
});

module.exports.app = app;
module.exports.db = mongoose;
