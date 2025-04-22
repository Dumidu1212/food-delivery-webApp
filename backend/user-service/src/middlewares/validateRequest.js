import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(e => e.msg).join(', ');
    throw new ApiError(400, msg);
  }
  next();
};
