import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import type { Product } from '../types';
import { useAuth } from './AuthContext';
// Import the API functions we already built
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/api';

// --- Define the types ---
interface WishlistState {
  wishlistItems: Product[]; // A wishlist just stores the full product
  loading: boolean;
  error: string | null;
}
interface WishlistContextType {
  wishlist: WishlistState;
  // A simple function to check if an ID is in the list
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  clearWishlist: () => void;
}
// ------------------------

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<WishlistState>({
    wishlistItems: [],
    loading: true,
    error: null,
  });
  
  const { userInfo } = useAuth();

  // Load the wishlist on mount or user login
  const loadWishlist = useCallback(async () => {
    setWishlist(prev => ({ ...prev, loading: true }));
    try {
      if (userInfo) {
        // --- LOGGED IN: Fetch from API ---
        const { data } = await getWishlist();
        setWishlist({ wishlistItems: data, loading: false, error: null });
      } else {
        // --- GUEST: Load from localStorage ---
        const storedWishlist = localStorage.getItem('wishlistItems');
        const wishlistItems = storedWishlist ? JSON.parse(storedWishlist) : [];
        setWishlist({ wishlistItems, loading: false, error: null });
      }
    } catch (err: any) {
      setWishlist({ 
        wishlistItems: [], 
        loading: false, 
        error: err.response?.data?.message || 'Failed to load wishlist' 
      });
    }
  }, [userInfo]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Function to check if an item is in the wishlist
  const isWishlisted = (id: string): boolean => {
    return !!wishlist.wishlistItems.find((item) => item._id === id);
  };

  // "Smart" Toggle function
  const toggleWishlist = async (product: Product) => {
    setWishlist(prev => ({ ...prev, loading: true }));
    
    const alreadyExists = isWishlisted(product._id);
    
    try {
      if (userInfo) {
        // --- LOGGED IN: Save to DB ---
        let updatedWishlist: Product[];
        if (alreadyExists) {
          const { data } = await removeFromWishlist(product._id);
          updatedWishlist = data;
        } else {
          const { data } = await addToWishlist(product._id);
          updatedWishlist = data;
        }
        setWishlist({ wishlistItems: updatedWishlist, loading: false, error: null });
      
      } else {
        // --- GUEST: Save to localStorage ---
        setWishlist((prevState) => {
          let newWishlistItems: Product[];
          if (alreadyExists) {
            newWishlistItems = prevState.wishlistItems.filter(
              (x) => x._id !== product._id
            );
          } else {
            newWishlistItems = [...prevState.wishlistItems, product];
          }
          localStorage.setItem('wishlistItems', JSON.stringify(newWishlistItems));
          return { ...prevState, wishlistItems: newWishlistItems, loading: false };
        });
      }
    } catch (err: any) {
      setWishlist(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || 'Failed to update wishlist' 
      }));
    }
  };

  // Clears wishlist on logout
  const clearWishlist = () => {
    setWishlist({ wishlistItems: [], loading: false, error: null });
    localStorage.removeItem('wishlistItems');
  };

  const value = useMemo(() => ({
    wishlist,
    isWishlisted,
    toggleWishlist,
    clearWishlist,
  }), [wishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};