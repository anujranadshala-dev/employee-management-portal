import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes that require authentication.
 * It verifies the JWT from the Authorization header.
 */
export const protect = (req, res, next) => {
  let token;

  // Read the JWT from the httpOnly cookie
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret');
      // Attach the user payload from the token to the request object
      req.user = decoded.user;
      next();
    } catch (error) {
      // This will catch verification errors (e.g., expired or malformed token)
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is found in the cookies at all
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * Middleware to authorize routes only for Admins (HR).
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'User is not an Admin' });
  }
};

/**
 * Middleware to authorize routes for Admins or Managers.
 */
export const authorizeAdminOrManager = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.isDepartmentManager)) {
    next();
  } else {
    res.status(403).json({ message: 'User is not authorized for this action' });
  }
};