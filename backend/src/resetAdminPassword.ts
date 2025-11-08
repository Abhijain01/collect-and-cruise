import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const resetAdmin = async () => {
  await connectDB();
  const hash = bcrypt.hashSync("123456", 10);
  const admin = await User.findOneAndUpdate(
    { email: "admin@example.com" },
    { name: "Admin User", password: hash, isAdmin: true },
    { upsert: true, new: true }
  );
  console.log("✅ Admin reset complete:", admin);
  process.exit();
};

resetAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
