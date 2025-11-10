import express from "express";
import { protect } from "../middleware/authMiddleware";
import User from "../models/User";
import Product from "../models/Products";

const router = express.Router();

// ❤️ Get wishlist
router.get("/", protect, async (req: any, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.wishlist);
});

// ❤️ Add to wishlist
router.post("/", protect, async (req: any, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);

  await user.save();
  await user.populate("wishlist");
  res.json(user.wishlist);
});

// 💔 Remove from wishlist
router.delete("/:id", protect, async (req: any, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.wishlist = user.wishlist.filter((p: any) => p.toString() !== req.params.id);
  await user.save();
  await user.populate("wishlist");
  res.json(user.wishlist);
});

export default router;
