// --- THIS IS THE FIX ---
// I have removed 'useEffect' from this import line.
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
// -----------------------

import { UserInfo } from '../types'; // Import your UserInfo type
import { login as apiLogin, register as apiRegister } from '../services/api'; // Import your API
import { toast } from 'react-toastify';

// The 'login' function was missing from your type definition.
interface AuthContextType {
  userInfo: UserInfo | null;
  login: (data: UserInfo) => void; // This function just sets state
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<UserInfo>;
  registerWithCredentials: (email: string, password: string) => Promise<UserInfo>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // This function just sets state and localStorage
  const login = (data: UserInfo) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  // Function to log out
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  // --- API Functions ---
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const { data } = await apiLogin(email, password);
      login(data);
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };
  
  const registerWithCredentials = async (email: string, password: string) => {
    try {
      const { data } = await apiRegister(email, password);
      login(data);
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const value = useMemo(() => ({
    userInfo,
    login,
    logout,
    loginWithCredentials,
    registerWithCredentials
  }), [userInfo]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};