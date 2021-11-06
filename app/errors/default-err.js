class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.message = 'На сервере произошла ошибка';
  }
}

module.exports = ServerError;
