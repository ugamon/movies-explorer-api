const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { dataFormatter } = require('../utils/dataFormatter');
const AuthError = require('../errors/auth-err');
const DuplicateError = require('../errors/duplicate-error');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV = 'test', JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email }).select('+password')
    .then((userData) => {
      if (!userData) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        throw new AuthError();
      }
      return bcrypt.compare(password, userData.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new Error('Неправильные почта или пароль'));
            throw new AuthError();
          }
          const token = jwt.sign(
            { _id: userData._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' }, // токен будет просрочен через 7дней после создания
          );
          res.send({ token });
        });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then(({
      name, email,
    }) => dataFormatter(res, {
      email, name,
    }))
    .catch(() => {
      next(new DuplicateError());
    });
};

module.exports.currentUser = (req, res, next) => {
  User
    .findOne({ _id: req.user._id })
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then(({ name, email }) => dataFormatter(res, { email, name }))
    .catch(next);
};

module.exports.changeProfile = (req, res, next) => {
  const { name, email } = req.body;
  User
    .findOne({ email })
    .then(() => {
      throw new DuplicateError();
    })
    .catch(next);
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true, upsert: false },
    )
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then((userdata) => dataFormatter(res, { name: userdata.name, email: userdata.email }))
    .catch(next);
};
