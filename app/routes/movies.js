const moviesRouter = require('express').Router({ strict: true });
const { celebrate, Joi } = require('celebrate');
const { getAllFilms, createFilm, deleteFilm } = require('../controllers/movies');
const { isUrl } = require('../utils/urlValidator');

moviesRouter.get('/', getAllFilms);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(isUrl),
    trailer: Joi.string().required().custom(isUrl),
    thumbnail: Joi.string().required().custom(isUrl),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    movieId: Joi.number().required().precision(0),
  }),
}), createFilm);

moviesRouter.delete('/:movieId', deleteFilm);

module.exports = moviesRouter;
