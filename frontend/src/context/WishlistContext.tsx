// frontend/src/context/WishlistContext.tsx

import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import type { Product } from '../types';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/api';

interface WishlistContextType {
  wishlistItems: Product[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();

  // This effect loads the wishlist when a user logs in
  useEffect(() => {
    const loadWishlist = async () => {
      if (userInfo) {
        setLoading(true);
        try {
          const { data } = await getWishlist();
          setWishlistItems(data);
        } catch (error) {
          console.error("Failed to load wishlist:", error);
          setWishlistItems([]); // Clear on error
        } finally {
          setLoading(false);
        }
      } else {
        // User logged out, clear the wishlist
        setWishlistItems([]);
      }
    };

    loadWishlist();
  }, [userInfo]); // Runs on login/logout

  // Function to check if an item is in the list
  const isWishlisted = (id: string): boolean => {
    return wishlistItems.some(item => item._id === id);
  };

  // Function to add or remove an item
  const toggleWishlist = async (product: Product) => {
    if (!userInfo) return; // Guests can't have a wishlist

    const alreadyWishlisted = isWishlisted(product._id);

    try {
      if (alreadyWishlisted) {
        // Remove from wishlist
        const { data: updatedWishlist } = await apiRemoveFromWishlist(product._id);
        setWishlistItems(updatedWishlist);
      } else {
        // Add to wishlist
        const { data: updatedWishlist } = await apiAddToWishlist(product._id);
        setWishlistItems(updatedWishlist);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };
  
  return (
    <WishlistContext.Provider value={{ wishlistItems, isWishlisted, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Create a simple hook to use the context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};