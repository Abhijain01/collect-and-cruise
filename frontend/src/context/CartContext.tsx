import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
// --- FIX 1: Import Product and CartItem from types.ts ---
import type { Product, CartItem } from '../types'; 
// ----------------------------------------------------
import { useAuth } from './AuthContext';
import { getCart, addCartItem, removeCartItem } from '../services/api';

// --- FIX 2: Delete the local duplicate definitions ---
// export interface CartItem { ... } // <-- DELETE THIS
// interface CartState { ... }       // <-- DELETE THIS
// ------------------------------------------------------

// --- Define the types ---
interface CartState {
  cartItems: CartItem[]; // This will now use the imported type
  loading: boolean;
  error: string | null;
}
interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, qty: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => void;
}
// ------------------------

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartState>({
    cartItems: [],
    loading: true,
    error: null,
  });
  
  const { userInfo } = useAuth();

  const loadCart = useCallback(async () => {
    setCart(prev => ({ ...prev, loading: true }));
    try {
      if (userInfo) {
        // --- LOGGED IN: Fetch from API ---
        // This line will no longer have an error
        const { data } = await getCart();
        setCart({ cartItems: data, loading: false, error: null });
      } else {
        // --- GUEST: Load from localStorage ---
        const storedCart = localStorage.getItem('cartItems');
        // We must ensure the localStorage shape matches
        const items = storedCart ? JSON.parse(storedCart) : [];
        // Check if stored data is in the old (bad) format or new
        if (items.cartItems) {
           setCart({ cartItems: items.cartItems, loading: false, error: null });
        } else {
           setCart({ cartItems: items, loading: false, error: null });
        }
      }
    } catch (err: any) {
      setCart({ 
        cartItems: [], 
        loading: false, 
        error: err.response?.data?.message || 'Failed to load cart' 
      });
    }
  }, [userInfo]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product: Product, qty: number) => {
    // Note: The product object from the DB is what we need
    const newItem: CartItem = { product, qty }; 

    try {
      if (userInfo) {
        // --- LOGGED IN: Save to DB ---
        // This line will no longer have an error
        const { data: updatedCart } = await addCartItem(product._id, qty);
        setCart({ cartItems: updatedCart, loading: false, error: null });
      } else {
        // --- GUEST: Save to localStorage ---
        setCart((prevState) => {
          const existItem = prevState.cartItems.find(
            (x) => x.product._id === product._id
          );
          let newCartItems;
          if (existItem) {
            // Update quantity for the item
            newCartItems = prevState.cartItems.map((x) =>
              x.product._id === existItem.product._id ? { ...x, qty: qty } : x
            );
          } else {
            // Add new item
            newCartItems = [...prevState.cartItems, newItem];
          }
          localStorage.setItem('cartItems', JSON.stringify(newCartItems));
          return { ...prevState, cartItems: newCartItems, loading: false, error: null };
        });
      }
    } catch (err: any) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || 'Failed to add to cart' 
      }));
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      if (userInfo) {
        // --- LOGGED IN: Remove from DB ---
        // This line will no longer have an error
        const { data: updatedCart } = await removeCartItem(id);
        setCart({ cartItems: updatedCart, loading: false, error: null });
      } else {
        // --- GUEST: Remove from localStorage ---
        setCart((prevState) => {
          const newCartItems = prevState.cartItems.filter(
            (x) => x.product._id !== id
          );
          localStorage.setItem('cartItems', JSON.stringify(newCartItems));
          return { ...prevState, cartItems: newCartItems, loading: false, error: null };
        });
      }
    } catch (err: any) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || 'Failed to remove from cart' 
      }));
    }
  };

  // Clears cart for both guest and user (on logout)
  const clearCart = () => {
    setCart({ cartItems: [], loading: false, error: null });
    localStorage.removeItem('cartItems');
  };

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  }), [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};