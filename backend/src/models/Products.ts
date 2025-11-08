// backend/src/models/Products.ts

import mongoose, { Schema } from 'mongoose';

// --- 1. DEFINE AND EXPORT ICartItem HERE ---
// This allows User.ts and Order.ts to use the same type
export interface ICartItem {
  product: mongoose.Types.ObjectId;
  qty: number;
}
// ----------------------------------------

const reviewSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Mainline', 'Premium', 'Exclusive', 'Other'] 
  },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 1 },
  imageUrl: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

productSchema.index({ 
  name: 'text', 
  description: 'text' 
});

const Product = mongoose.model('Product', productSchema);
export default Product;