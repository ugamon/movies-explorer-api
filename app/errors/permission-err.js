class PermissionDeniedError extends Error {
  constructor() {
    super();
    this.statusCode = 403;
    this.message = 'Невозможно удалить чужую карточку';
  }
}

module.exports = PermissionDeniedError;
