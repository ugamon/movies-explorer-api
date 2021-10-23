const InvalidDataError = require('../errors/auth-val-err');

function validURL(value) {
  const pattern = /^(https:\/\/|http:\/\/|www\.)/;
  return pattern.test(value);
}

module.exports.isUrl = (value) => {
  const result = validURL(value);
  if (result) {
    return value;
  }
  throw new InvalidDataError();
};
