import mongoose from 'mongoose';

// --- 1. THIS IS THE FIX ---
// Define the shape of an order item
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // Must match your 'Product' model name
  },
  qty: {
    type: Number,
    required: true,
  },
  // We can add name, price, etc. here later
});
// -------------------------

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // --- 2. USE THE NEW SCHEMA ---
  orderItems: [orderItemSchema],
  // -----------------------------
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  // (Add other fields like shippingAddress here if needed)
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;