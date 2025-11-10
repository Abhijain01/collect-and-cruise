import express from 'express';
const router = express.Router();
import {
  getUsers,
  getCart,
  addCartItem,
  removeCartItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/userController.js';

// --- FIX: Use lowercase 'm' to match your folder ---
import { protect, admin } from '../middleware/authMiddleware.js';

// Admin route
router.route('/').get(protect, admin, getUsers);

// Cart routes
router.route('/cart')
  .get(protect, getCart)
  .post(protect, addCartItem);
router.route('/cart/:id')
  .delete(protect, removeCartItem);

// Wishlist Routes
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);
router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

export default router;