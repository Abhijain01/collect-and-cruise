import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    console.log("🟢 Login Attempt");
    console.log("Email:", email);
    console.log("Password entered:", password);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("bcrypt.compare result:", match);

    if (!match) {
      console.log("❌ Password mismatch");
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    console.log("✅ Login success for:", user.email);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(String(user._id)),
    });
  })
);

export default router;
