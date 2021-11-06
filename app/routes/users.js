const usersRouter = require('express').Router({ strict: true });
const { celebrate, Joi } = require('celebrate');
const { currentUser, changeProfile } = require('../controllers/users');
const { emailRegex } = require('../utils/regexDict');

usersRouter.get('/me', currentUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(emailRegex),
  }),
}), changeProfile);

module.exports = usersRouter;
