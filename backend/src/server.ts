import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Must be at the top
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors
import connectDB from './config/db.js';
// --- FIX: Use lowercase 'm' ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import all your routes
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js'; 

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

// --- THIS IS THE "1% FIX" ---
// We are telling your server to ONLY accept requests
// from your Vercel app (which is in your .env)
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
// ----------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API Routes (no change) ---
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- We have REMOVED the 'if (NODE_ENV === "production")' block ---
// This server is now a 100% pure API.
// Vercel is handling the frontend.
// ---------------------------------------------------------------

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});