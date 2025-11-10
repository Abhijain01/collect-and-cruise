// Product Interface (Existing)
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'Mainline' | 'Premium' | 'Exclusive' | 'Other';
  price: number;
  stockQuantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  // Add these if your backend model has them
  rating?: number;
  numReviews?: number;
  reviews?: Review[];
}

// UserInfo Interface (Existing)
export interface UserInfo {
  _id: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

// --- 1. ADD CartItem TYPE ---
export interface CartItem {
  product: Product; // The populated product
  qty: number;
}

// --- 2. ADD Review TYPE (for Product) ---
export interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// --- 3. ADD Order TYPES (for Checkout) ---
export interface OrderItem {
  product: string; // Just the ID
  qty: number;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
// ------------------------------------