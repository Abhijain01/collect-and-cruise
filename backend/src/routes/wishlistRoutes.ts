import express from 'express';
const router = express.Router();
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/userController.js'; // (Assuming wishlist logic is in userController)

// --- FIX: Add '.js' to all local imports ---
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Products.js';
// -------------------------------------------

// @route   GET /api/wishlist
router.get('/', protect, getWishlist);

// @route   POST /api/wishlist
router.post('/', protect, addToWishlist);

// @route   DELETE /api/wishlist/:id
router.delete('/:id', protect, removeFromWishlist);

export default router;