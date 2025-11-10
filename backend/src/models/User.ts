import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- THIS IS THE FIX ---
// The 'ref' must match the model name from Products.ts
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // <-- MUST BE 'Product' (singular)
  },
  qty: {
    type: Number,
    required: true,
  },
});
// -----------------------

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  cart: [cartItemSchema], // This now uses the fixed cartItemSchema

  // --- ALSO FIXING WISHLIST ---
  // This needs to be fixed for our next step
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // <-- MUST BE 'Product' (singular)
  }],
  // --------------------------

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;