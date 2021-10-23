const winston = require('winston');
const expressWinston = require('express-winston');

const {
  splat, combine, timestamp, printf,
} = winston.format;

const customFormat = printf(({
  // eslint-disable-next-line no-shadow
  level, message, timestamp, meta,
}) => {
  const output = `${timestamp} ${level}: ${message}: ${meta ? JSON.stringify(meta) : ''}`;
  return output;
});

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: combine(
    timestamp(),
    splat(),
    customFormat,
  ),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: combine(
    timestamp(),
    splat(),
    customFormat,
  ),
});

module.exports = {
  requestLogger,
  errorLogger,
};
