const usersRouter = require('express').Router({ strict: true });
const { currentUser, changeProfile } = require('../controllers/users');

usersRouter.get('/me', currentUser);

usersRouter.patch('/me', changeProfile);

module.exports = usersRouter;
