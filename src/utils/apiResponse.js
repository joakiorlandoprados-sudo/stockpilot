const sendSuccess = (res, { statusCode = 200, message, data = null, pagination } = {}) => {
  const payload = {
    success: true,
    data
  };

  if (message) {
    payload.message = message;
  }

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

const buildError = ({ message = "Error interno del servidor", code = 500, stack, details } = {}) => {
  const error = {
    message,
    code
  };

  if (details) {
    error.details = details;
  }

  if (stack && process.env.NODE_ENV === "development") {
    error.stack = stack;
  }

  return {
    success: false,
    error
  };
};

const sendError = (res, options = {}) => {
  const { code = 500 } = options;
  return res.status(code).json(buildError(options));
};

module.exports = {
  sendSuccess,
  buildError,
  sendError
};
