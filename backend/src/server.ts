import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Must be at the top
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
// --- FIX: Use lowercase 'm' (this is the final fix) ---
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

// --- THIS IS THE DEPLOYMENT FIX ---
// This tells your backend to accept requests from your
// Vercel frontend (which we will create in Step 2).
// We will set the 'CORS_ORIGIN' variable on Railway.
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
// ---------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API Routes (no change) ---
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// --- We NO LONGER need the "serve frontend" code ---
// (That was for the old Render plan. Vercel will do this now.)
// --------------------------------------------------

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});