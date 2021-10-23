const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { dataFormatter } = require('../utils/dataFormatter');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataError = require('../errors/invalid-data-err');
const PermissionDeniedError = require('../errors/permission-err');

module.exports.getAllFilms = (req, res, next) => {
  Movie
    .find({ owner: req.user._id })
    .then((moviesList) => {
      const newArray = moviesList.map(({ _doc }) => {
        const { _id, ...rest } = _doc;
        return { movieId: _id, ...rest };
      });

      dataFormatter(res, newArray);
    })
    .catch(next);
};

module.exports.createFilm = (req, res, next) => {
  const data = req.body;

  Movie.create({ owner: req.user._id, ...data })
    .then(({ _doc }) => {
      const { _id, owner, ...moviedata } = _doc;
      dataFormatter(res, { movieId: _id, ...moviedata });
    })
    .catch(next);
};

module.exports.deleteFilm = (req, res, next) => {
  //  todo: in the next sprint need to check the owner id
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new InvalidDataError();
  }
  Movie
    .findById(req.params.movieId)
    .orFail(() => {
      // const error = new MangooseError('Lookup to id failed');
      // throw error;
      throw new NotFoundError();
    })
    .then(({ owner }) => {
      if (owner.toHexString() !== req.user._id) {
        // throw new Error('Permission denied');
        throw new PermissionDeniedError();
      }
      Movie
        .findByIdAndRemove({ _id: req.params.movieId })
        .then((movieData) => dataFormatter(res, movieData));
    })
    .catch(next);
};
