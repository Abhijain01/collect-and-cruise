// backend/src/routes/orderRoutes.ts

import express from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Create a new "mock" order from the user's cart
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user!._id).populate('cart.product');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItems = user.cart;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Calculate the total price from the (populated) cart items
    // We must cast 'item.product' to 'any' to access 'price'
    const totalPrice = user.cart.reduce(
      (acc, item: any) => acc + item.qty * item.product.price, 0
    );

    // Create the new order
    const newOrder = new Order({
      user: user._id,
      orderItems: user.cart.map((item: any) => ({
        product: item.product._id,
        qty: item.qty
      })),
      totalPrice: totalPrice,
      isPaid: true, // This is the "mock" part - we set it to paid
      paidAt: new Date(),
    });

    // Save the order to the database
    const createdOrder = await newOrder.save();

    // Clear the user's cart
    user.cart = [];
    await user.save();
    
    // Send the new order back to the frontend
    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Check if a user has purchased a specific product
// @route   GET /api/orders/has-purchased/:productId
// @access  Private
//
// This is the "pro-level" route that will enable your
// "Verified Purchaser" review feature.
router.get('/has-purchased/:productId', protect, async (req: AuthRequest, res) => {
  const { productId } = req.params;
  const userId = req.user!._id;

  try {
    // Find any order by this user that is paid and contains the product
    const order = await Order.findOne({
      user: userId,
      isPaid: true,
      'orderItems.product': productId,
    });

    if (order) {
      // Yes, they bought it
      res.json({ hasPurchased: true });
    } else {
      // No, they have not bought it
      res.json({ hasPurchased: false });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});


export default router;