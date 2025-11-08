import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Products.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "user1@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Jane Smith",
    email: "user2@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

const products = [
  {
    name: "HotWheels '87 Ford Sierra Cosworth",
    description: "Classic rally car from HotWheels Mainline series.",
    category: "Mainline",
    price: 249,
    stockQuantity: 10,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  },
  {
    name: "HotWheels Lamborghini Countach",
    description: "Iconic 80s supercar from HotWheels Premium lineup.",
    category: "Premium",
    price: 499,
    stockQuantity: 5,
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    await User.insertMany(users);
    await Product.insertMany(products);

    console.log("✅ Sample Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

importData();
