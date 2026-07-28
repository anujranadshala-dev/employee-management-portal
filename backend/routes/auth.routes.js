import { Router } from 'express';
import { login, logout, getMe, refreshToken } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user and clear cookie
router.post('/logout', logout);

// @route   GET /api/auth/me
// @desc    Get the logged in user's data from the token
router.get('/me', protect, getMe);

// @route   POST /api/auth/refresh
// @desc    Refresh the access token
router.post('/refresh', refreshToken);

export default router;