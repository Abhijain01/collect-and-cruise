// backend/src/routes/productRoutes.ts
import express from 'express';
import multer from 'multer';
import { uploader } from '../config/cloudinary.js';
import Product from '../models/Products.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
// Multer setup for image upload
const storage = multer.diskStorage({}); // Use temp storage
const upload = multer({ storage });
// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});
// @desc    Get single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
});
// @desc    Create a new product (Admin only)
// @route   POST /api/products
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    const { name, description, category, price, stockQuantity } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
    }
    try {
        const result = await uploader.upload(req.file.path, {
            folder: 'collect-and-cruise',
        });
        const product = new Product({
            name,
            description,
            category,
            price,
            stockQuantity,
            imageUrl: result.secure_url,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});
// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
    const { name, description, category, price, stockQuantity, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) { // This is line 69
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.price = price || product.price;
        // --- THIS IS THE FIX (was "product" instead of "product.stockQuantity") ---
        product.stockQuantity = stockQuantity || product.stockQuantity; // This is line 74
        product.imageUrl = imageUrl || product.imageUrl;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
}); // <--- The '}' the parser was looking for
// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
});
export default router;
