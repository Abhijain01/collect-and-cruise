import express from 'express';
const router = express.Router();
// --- FIX: Use lowercase 'm' to match your folder ---
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadProduct } from '../controllers/productController.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/products', 
  protect, 
  admin, 
  upload.single('image'), 
  uploadProduct
);

export default router;