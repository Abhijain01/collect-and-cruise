// backend/src/routes/cartRoutes.ts

import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware";
import User from "../models/User";
import Product from "../models/Products";

const router = express.Router();

// 🛒 Add to cart
router.post("/", protect, async (req: any, res) => {
  const { productId, qty } = req.body;
  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!user || !product) return res.status(404).json({ message: "Not found" });

  const existing = user.cart.find(
    (i: any) => i.product.toString() === productId
  );

  if (existing) {
    existing.qty += qty;
  } else {
    // ✅ Fix applied here
    user.cart.push({
      product: product._id as mongoose.Types.ObjectId,
      qty,
    });
  }

  await user.save();
  await user.populate("cart.product");
  res.json(user.cart);
});

export default router;
