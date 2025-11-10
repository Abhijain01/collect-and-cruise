import { Request, Response } from 'express';
// --- FIX: Use lowercase 'm' to match your folder name ---
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Products.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token (Login)
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await (user as any).matchPassword(password))) {
    const token = generateToken((user as any)._id.toString());
    res.json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ email, password, isAdmin: false });

  if (user) {
    const token = generateToken((user as any)._id.toString());
    res.status(201).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all users (Admin only)
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Get user's cart
const getCart = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id).populate('cart.product', 'name price imageUrl stockQuantity');
  if (user) {
    res.status(200).json(user.cart);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to cart
const addCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, qty } = req.body;
  const userId = (req as any).user._id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404); throw new Error('User not found');
  }
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404); throw new Error('Product not found');
  }

  const existItem = (user as any).cart.find(
    (item: any) => item.product.toString() === productId
  );

  if (existItem) {
    existItem.qty = Number(qty);
  } else {
    (user as any).cart.push({ product: productId, qty: Number(qty) });
  }

  await user.save();
  
  const updatedUser = await User.findById(userId).populate('cart.product', 'name price imageUrl stockQuantity');
  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found after update');
  }
  res.status(201).json(updatedUser.cart);
});

// @desc    Remove item from cart
const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const productIdToRemove = req.params.id;
  const userId = (req as any).user._id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404); throw new Error('User not found');
  }

  (user as any).cart.pull({ product: productIdToRemove });
  await user.save();
  
  const updatedUser = await User.findById(userId).populate('cart.product', 'name price imageUrl stockQuantity');
  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found after update');
  }
  res.status(200).json(updatedUser.cart);
});

// @desc    Get user's wishlist
const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id).populate('wishlist');
  if (user) {
    res.status(200).json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to wishlist
const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = (req as any).user._id;
  await User.findByIdAndUpdate(userId, {
    $addToSet: { wishlist: productId },
  });
  const updatedUser = await User.findById(userId).populate('wishlist');
  if (!updatedUser) {
    res.status(404); throw new Error('User not found after update');
  }
  res.status(201).json(updatedUser.wishlist);
});

// @desc    Remove item from wishlist
const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const productIdToRemove = req.params.id;
  const userId = (req as any).user._id;
  await User.findByIdAndUpdate(userId, {
    $pull: { wishlist: productIdToRemove },
  });
  const updatedUser = await User.findById(userId).populate('wishlist');
  if (!updatedUser) {
    res.status(404); throw new Error('User not found after update');
  }
  res.status(200).json(updatedUser.wishlist);
});


export {
  authUser,
  registerUser,
  getUsers,
  getCart,
  addCartItem,
  removeCartItem,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};