class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = 'При регистрации указан email, который уже существует на сервере';
  }
}

module.exports = DuplicateError;
