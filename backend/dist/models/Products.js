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
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);
export default Product;
