class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = 'Передан неверный логин или пароль';
  }
}

module.exports = AuthError;
