import { Request, Response } from 'express';
// --- FIX 1: Import your LOCAL file (with .js) ---
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Products.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // --- FIX 2: Use 'email' (from your model) instead of 'name' ---
    (user as any).email = req.body.email || (user as any).email;
    (user as any).isAdmin = Boolean(req.body.isAdmin);
    // -----------------------------------------------------------

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      email: (updatedUser as any).email,
      isAdmin: (updatedUser as any).isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if ((user as any).isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: (user as any)._id });
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// (Add other admin functions: getProducts, getOrders, etc.)

export {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};