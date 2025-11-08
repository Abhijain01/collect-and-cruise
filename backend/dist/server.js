// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // <-- 1. ADDED .js
import productRoutes from './routes/productRoutes.js'; // <-- 2. ADDED .js
import authRoutes from './routes/authRoutes.js'; // <-- 3. ADDED .js
// Load environment variables
dotenv.config();
// Connect to database
connectDB();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// API Routes
app.get('/api', (req, res) => {
    res.send('API is running...');
});
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
