class ApiError extends Error {
    constructor(message) {
      super();
      this.message = message;
    }
 
    getHttpStatusCode() {
      if (this instanceof BadRequestError) {
        return 400;
      } else if (this instanceof NotFoundError) {
        return 404;
      } else if (this instanceof UnauthorizedError) {
        return 401;
      } else if (this instanceof ForbiddenError) {
        return 403;
      } else {
        return 500;
      }
    }
  };
 
  class BadRequestError extends ApiError {};
  class NotFoundError extends ApiError {};
  class UnauthorizedError extends ApiError {};
  class ForbiddenError extends ApiError {};
 
  module.exports = {
    ApiError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
  };