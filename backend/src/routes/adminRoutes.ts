import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Products.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import multer from "multer";
import cloudinary from "cloudinary";

const router = express.Router();

// 🟢 Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🟢 Multer setup for temporary file handling
const storage = multer.diskStorage({});
const upload = multer({ storage });

// =====================================================
// @route   GET /api/admin/products
// @desc    Get all products
// @access  Private/Admin
// =====================================================
router.get(
  "/products",
  protect,
  admin,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await Product.find({});
    res.json(products);
  })
);

// =====================================================
// @route   POST /api/admin/products
// @desc    Add a new product
// @access  Private/Admin
// =====================================================
router.post(
  "/products",
  protect,
  admin,
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, category, stockQuantity } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadRes = await cloudinary.v2.uploader.upload(req.file.path);
      imageUrl = uploadRes.secure_url;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stockQuantity,
      imageUrl,
    });

    res.status(201).json(product);
  })
);

// =====================================================
// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private/Admin
// =====================================================
router.put(
  "/products/:id",
  protect,
  admin,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.stockQuantity = req.body.stockQuantity || product.stockQuantity;
      product.imageUrl = req.body.imageUrl || product.imageUrl;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// =====================================================
// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private/Admin
// =====================================================
router.delete(
  "/products/:id",
  protect,
  admin,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

export default router;
