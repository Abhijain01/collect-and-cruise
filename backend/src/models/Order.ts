// backend/src/models/Order.ts

import mongoose, { Document, Model, Schema } from 'mongoose';
// We will re-use the ICartItem interface from your Products model
import type { ICartItem } from './Products.js';

// This is the main Order interface
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: ICartItem[]; // Re-using the ICartItem interface
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      qty: { type: Number, required: true },
    }
  ],
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
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);
export default Order;