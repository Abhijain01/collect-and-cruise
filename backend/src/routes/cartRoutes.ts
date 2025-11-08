// backend/src/routes/cartRoutes.ts

import express from 'express';
// --- 1. IMPORT THE 'AuthRequest' TYPE ---
import { protect, AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Products.js';

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
// --- 2. USE 'AuthRequest' INSTEAD OF 'Request' ---
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    // 3. 'req.user' will now be recognized
    const user = await User.findById(req.user!._id).populate('cart.product');
    
    if (user) {
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Add/Update item in cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req: AuthRequest, res) => {
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existItem) {
      existItem.qty = qty;
    } else {
      // 4. We push the 'product' object itself (or its _id), not 'product._id'
      user.cart.push({ product: product._id, qty });
    }

    await user.save();
    
    // 5. ADD A NULL CHECK
    const updatedUser = await User.findById(req.user!._id).populate('cart.product');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }
    res.status(200).json(updatedUser.cart);

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req: AuthRequest, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    
    // 6. ADD A NULL CHECK
    const updatedUser = await User.findById(req.user!._id).populate('cart.product');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after delete' });
    }
    res.status(200).json(updatedUser.cart);

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;