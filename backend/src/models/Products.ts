import mongoose from 'mongoose';

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
  // We can add reviews here later, as per your old file
  // rating: { type: Number, required: true, default: 0 },
  // numReviews: { type: Number, required: true, default: 0 },
  // reviews: [reviewSchema] // We'd need to define reviewSchema
}, { timestamps: true });

// --- THIS IS THE KEY ---
// The model is registered as 'Product' (singular)
const Product = mongoose.model('Product', productSchema);
// ---------------------

export default Product;