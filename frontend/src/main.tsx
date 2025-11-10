import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';

// Your Global Styles
import { GlobalStyle } from './globalStyles.ts'; 
import App from './App.tsx';

// --- THIS IS THE FIX ---
// We are importing YOUR Context providers from your file structure
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
// -----------------------

// Import the CSS for react-toastify
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/*
          This is the "proper" provider structure for YOUR app.
          We wrap the entire App in all your contexts.
        */}
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <GlobalStyle />
                <ToastContainer />
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);