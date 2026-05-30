const { buildError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";
  let details;

  if (err.name === "CastError") {
    statusCode = 400;
    message = "ID invalido";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Ya existe un registro con ese valor";
    details = Object.entries(err.keyValue || {}).map(([field, value]) => ({
      field,
      message: `${field} duplicado: ${value}`
    }));
  }

  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Error de validacion";
    details = Object.values(err.errors).map((fieldError) => ({
      field: fieldError.path,
      message: fieldError.message
    }));
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token invalido o expirado";
  }

  res.status(statusCode).json(
    buildError({
      message,
      code: statusCode,
      stack: err.stack,
      details
    })
  );
};

module.exports = errorHandler;
