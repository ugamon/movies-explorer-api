const authRouter = require('express').Router({ strict: true });
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { emailRegex } = require('../utils/regexDict');

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), login);

authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = authRouter;
