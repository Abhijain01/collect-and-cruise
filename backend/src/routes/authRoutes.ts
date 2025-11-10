import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser
} from '../controllers/userController.js';

// @route   POST /api/auth/login
router.post('/login', authUser);

// @route   POST /api/auth/register
router.post('/register', registerUser);

export default router;