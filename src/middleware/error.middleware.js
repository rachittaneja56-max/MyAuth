import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  } else {
    console.error("UNEXPECTED BUG:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: code,
      message: message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // to get the error locally on my system
    }
  });
};