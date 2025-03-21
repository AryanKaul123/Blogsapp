import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Check for token in cookies or Authorization header
  const token = req.cookies?.access_token || req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return next(errorHandler(401, 'Authorization token is missing. Please log in.'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Invalid or expired token.'));
    }

    req.user = user;
    next();
  });
};
