import express, { Request, Response } from 'express';
// --- FIX: Use lowercase 'm' to match your folder ---
import { protect, AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItems = (user as any).cart;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    const totalPrice = (user as any).cart.reduce(
      (acc: number, item: any) => acc + item.qty * item.product.price, 0
    );
    const newOrder = new Order({
      user: user._id,
      orderItems: (user as any).cart.map((item: any) => ({
        product: item.product._id,
        qty: item.qty
      })),
      totalPrice: totalPrice,
      isPaid: true,
      paidAt: new Date(),
    });
    const createdOrder = await newOrder.save();
    (user as any).cart = [] as any;
    await user.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get('/has-purchased/:productId', protect, async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const userId = req.user!._id;
  try {
    const order = await Order.findOne({
      user: userId,
      isPaid: true,
      'orderItems.product': productId,
    });
    if (order) {
      res.json({ hasPurchased: true });
    } else {
      res.json({ hasPurchased: false });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;