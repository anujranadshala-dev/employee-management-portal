import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', login);

export default router;