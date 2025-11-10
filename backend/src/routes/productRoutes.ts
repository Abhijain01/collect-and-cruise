import express from 'express';
const router = express.Router();
// --- FIX: Use lowercase 'm' to match your folder ---
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js';

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;