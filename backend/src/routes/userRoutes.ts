import express from 'express';
const router = express.Router();
import {
  getUsers,
  authUser // <-- 1. Import new function
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- 2. ADD NEW LOGIN ROUTE ---
// @route   POST /api/users/login
// @access  Public
router.post('/login', authUser);
// ----------------------------

// --- This route is protected ---
router.route('/').get(protect, admin, getUsers);

export default router;