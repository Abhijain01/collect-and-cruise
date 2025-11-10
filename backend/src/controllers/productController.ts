import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js'; // Your lowercase 'm'
import Product from '../models/Products.js';
import { uploader } from '../config/cloudinary.js';

// @desc    Fetch all products (OR search by keyword)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  // --- THIS IS THE NEW SEARCH LOGIC ---
  const keyword = req.query.keyword ? {
    // We search the 'name' field
    name: {
      $regex: req.query.keyword, // The search term
      $options: 'i', // 'i' = case-insensitive
    },
  } : {}; // If no keyword, 'keyword' is an empty object

  // This will either find all products ({}) or filtered products
  const products = await Product.find({ ...keyword });
  // ------------------------------------
  
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a new product (Admin only)
const uploadProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, category, price, stockQuantity } = req.body;
  
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const result = await uploader.upload(dataURI, {
      folder: 'collect-and-cruise',
    });
    const product = new Product({
      name,
      description,
      category,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      imageUrl: result.secure_url,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

export {
  getProducts,
  getProductById,
  uploadProduct
};