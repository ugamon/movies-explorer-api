require('dotenv').config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost',
  DB_PORT = '27017',
  DB_NAME = 'moviesdb',
} = process.env;

module.exports = {
  url: DB_USER && DB_PASSWORD
    ? `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
    : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
};
