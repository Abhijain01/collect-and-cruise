// frontend/src/context/CartContext.tsx

import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import type { Product, CartItem } from '../types'; 
import { useAuth } from './AuthContext';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '../services/api';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (id: string) => void;
  loading: boolean;
  refreshCart: () => void; // <-- 1. ADD NEW FUNCTION
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const GUEST_CART_KEY = 'cartItems';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();

  // --- 2. RENAME loadCart to refreshCart ---
  const refreshCart = async () => {
    if (userInfo) {
      setLoading(true);
      try {
        const guestCart: CartItem[] = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            await apiAddToCart(item.product._id, item.qty);
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
        const { data: dbCart } = await getCart();
        setCartItems(dbCart);
      } catch (error) {
        console.error("Failed to load/merge cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      setCartItems(guestCart);
    }
  };

  // This effect runs on LOGIN and LOGOUT
  useEffect(() => {
    refreshCart(); // <-- 3. Call it here
  }, [userInfo]); 

  const addToCart = async (product: Product, qty: number) => {
    if (userInfo) {
      try {
        const { data: updatedCart } = await apiAddToCart(product._id, qty);
        setCartItems(updatedCart);
      } catch (error) { console.error("Failed to add to DB cart:", error); }
    } else {
      setCartItems(prevItems => {
        const existItem = prevItems.find((x) => x.product._id === product._id);
        let newCart;
        if (existItem) {
          newCart = prevItems.map((x) =>
            x.product._id === product._id ? { ...x, qty } : x
          );
        } else {
          newCart = [...prevItems, { product, qty }];
        }
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const removeFromCart = async (id: string) => {
    if (userInfo) {
      try {
        const { data: updatedCart } = await apiRemoveFromCart(id);
        setCartItems(updatedCart);
      } catch (error) { console.error("Failed to remove from DB cart:", error); }
    } else {
      setCartItems(prevItems => {
        const newCart = prevItems.filter(x => x.product._id !== id);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
      });
    }
  };
  
  return (
    // --- 4. Pass refreshCart to the provider ---
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};