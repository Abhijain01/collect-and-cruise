import axios from 'axios';
import type { UserInfo, Product, CartItem, Order } from '../types';

// --- THIS IS THE "PROPER" FIX ---
//
// 1. DELETE the old API_URL = '/api'.
// 2. PASTE the new Railway URL you just copied.
// 3. Make sure to add '/api' at the end of it.
//
const API_URL = 'https://my-backend-prod.up.railway.app/api'; 
// (Replace with your real Railway URL!)
// -----------------------------------------

const api = axios.create({
  baseURL: API_URL,
});

// (The rest of this file is 100% correct)
api.interceptors.request.use((config) => {
  const userInfoFromStorage = localStorage.getItem('userInfo');
  if (userInfoFromStorage) {
    const userInfo: UserInfo = JSON.parse(userInfoFromStorage);
    if (userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return config;
});

// === Product API calls (Existing) ===
export const getProducts = (keyword: string = '') => 
  api.get<Product[]>(`/products?keyword=${keyword}`);
export const getProductById = (id: string) => api.get<Product>(`/products/${id}`);

// === Auth API calls (Existing) ===
export const login = (email: string, password: string) => api.post('/auth/login', { email, password });
export const register = (email: string, password: string) => api.post('/auth/register', { email, password });

// === Cart API functions (Existing) ===
export const getCart = () => api.get<CartItem[]>('/users/cart');
export const addCartItem = (productId: string, qty: number) => 
  api.post<CartItem[]>('/users/cart', { productId, qty });
export const removeCartItem = (productId: string) => 
  api.delete<CartItem[]>(`/users/cart/${productId}`);

// === Wishlist API functions (Existing) ===
export const getWishlist = () => 
  api.get<Product[]>('/users/wishlist');
export const addToWishlist = (productId: string) =>
  api.post<Product[]>('/users/wishlist', { productId });
export const removeFromWishlist = (productId: string) =>
  api.delete<Product[]>(`/users/wishlist/${productId}`);

// === Order API functions (Existing) ===
export const createMockOrder = () => 
  api.post<Order>('/orders');
export const hasPurchased = (productId: string) =>
  api.get<{ hasPurchased: boolean }>(`/orders/has-purchased/${productId}`);
  
// === Admin API (From your structure.txt) ===
export const uploadProduct = (formData: FormData) => {
  return api.post<Product>('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;