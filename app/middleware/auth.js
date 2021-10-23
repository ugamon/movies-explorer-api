const jwt = require('jsonwebtoken');
const ValidationRequiredError = require('../errors/auth-val-err');

module.exports.auth = (req, res, next) => {
  const { NODE_ENV = 'test', JWT_SECRET = 'test' } = process.env;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ValidationRequiredError();
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new ValidationRequiredError();
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
