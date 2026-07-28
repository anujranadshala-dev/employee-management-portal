import Employee from '../models/employee.model.js';
import jwt from 'jsonwebtoken';

/**
 * @desc    Authenticate user and return a token cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Employee.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const userPayload = {
        id: user._id,
        name: user.firstName + ' ' + user.lastName,
        role: user.role,
        isAdmin: user.isAdmin,
        isDepartmentManager: user.isDepartmentManager,
      };

      // Create a short-lived access token
      const accessToken = jwt.sign({ user: userPayload }, process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret', {
        expiresIn: '15m', // 15 minutes
      });

      // Create a long-lived refresh token
      const refreshToken = jwt.sign({ user: { id: user._id } }, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret', {
        expiresIn: '7d', // 7 days
      });

      // Store refresh token in the database against the user record for added security
      user.refreshToken = refreshToken;
      await user.save();

      // Set the access token in an HttpOnly cookie
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // Set the refresh token in a separate HttpOnly cookie
      // This cookie will have a longer lifespan and a different path
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/auth/refresh' });

      // Send back user data, but not the token
      res.status(200).json(userPayload);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Logout user by clearing the cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  // Clear the cookie by setting an empty value and an immediate expiration date
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/api/auth/refresh'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get current user's data from their token
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = (req, res) => {
  res.status(200).json(req.user);
};

/**
 * @desc    Refresh access token using a refresh token
 * @route   POST /api/auth/refresh
 * @access  Public (requires refresh token cookie)
 */
export const refreshToken = async (req, res) => {
  const { refreshToken: tokenFromCookie } = req.cookies;

  if (!tokenFromCookie) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret');

    // Find user and check if refresh token matches the one in DB
    const user = await Employee.findById(decoded.user.id);
    if (!user || user.refreshToken !== tokenFromCookie) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // If valid, issue a new access token
    const userPayload = {
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
      role: user.role,
      isAdmin: user.isAdmin,
      isDepartmentManager: user.isDepartmentManager,
    };

    const newAccessToken = jwt.sign({ user: userPayload }, process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret', {
      expiresIn: '15m',
    });

    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};