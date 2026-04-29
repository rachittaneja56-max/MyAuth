import { BadRequestError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const errorMessages = error.errors.map((e) => e.message).join(', ');
    next(new BadRequestError(errorMessages));
  }
};