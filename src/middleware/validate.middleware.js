import { BadRequestError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    const errorMessages = result.error.issues.map((e) => e.message).join(', ');
    return next(new BadRequestError(errorMessages));
  }
  
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  
  if (!result.success) {
    const errorMessages = result.error.issues.map((e) => e.message).join(', ');
    return next(new BadRequestError(`Invalid query parameters: ${errorMessages}`));
  }
  Object.assign(req.query, result.data);
  next();
};