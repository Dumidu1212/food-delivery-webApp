import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN  = '1d';

export const generateToken = ({ _id, role }) =>
  jwt.sign({ id: _id, role }, JWT_SECRET, { expiresIn: EXPIRES_IN });

export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or invalid Authorization header');
  }
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};
