const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieScheme = new Schema({
  country: {
    type: String,
    ref: 'movie',
    required: true,
  },
  director: {
    type: String,
    ref: 'movie',
    required: true,
  },
  duration: {
    type: Number,
    ref: 'movie',
    required: true,
  },
  year: {
    type: String,
    ref: 'movie',
    required: true,
  },
  description: {
    type: String,
    ref: 'movie',
    required: true,
  },
  image: {
    type: String,
    ref: 'movie',
    required: true,
    minlength: 2,
  },
  trailer: {
    type: String,
    ref: 'movie',
    required: true,
  },
  thumbnail: {
    type: String,
    ref: 'movie',
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'movie',
    required: true,
  },
  movieId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'movie',
  },
  nameRU: {
    type: String,
    required: true,
    ref: 'movie',
  },
  nameEN: {
    type: String,
    ref: 'movie',
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieScheme);
