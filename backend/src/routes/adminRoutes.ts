import express from 'express';
const router = express.Router();

// --- FIX: Use lowercase 'm' and add '.js' ---
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadProduct } from '../controllers/productController.js';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/adminController.js'; // Import from adminController
// ----------------------------------------------

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

// === Product Admin Routes ===
router.post(
  '/products', 
  protect, 
  admin, 
  upload.single('image'), 
  uploadProduct
);
// (We will add PUT /products/:id and DELETE /products/:id here later)

// === User Admin Routes ===
router.get('/users', protect, admin, getUsers);
router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;