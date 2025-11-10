import express from 'express';
const router = express.Router();
import {
  getCart,
  addCartItem,
  removeCartItem
} from '../controllers/userController.js'; // (This assumes cart logic is in userController)

// --- FIX: Add '.js' to all local imports ---
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Products.js';
// -------------------------------------------

// @route   GET /api/cart
router.get('/', protect, getCart);

// @route   POST /api/cart
router.post('/', protect, addCartItem);

// @route   DELETE /api/cart/:id
router.delete('/:id', protect, removeCartItem);

export default router;