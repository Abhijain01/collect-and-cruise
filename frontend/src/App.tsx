import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import styled from 'styled-components';

import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminUpload from './pages/AdminUpload';

// --- THIS IS THE FIX ---
// We have removed all the unused admin imports:
// - AdminRoute
// - AdminDashboard
// - UserListScreen
// - UserEditScreen
// -----------------------

import Chatbot from './components/Chatbot';
import RouteChangeTracker from './components/RouteChangeTracker'; 

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <RouteChangeTracker /> {/* For Google Analytics */}
      <MainContent>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          
          {/* Admin Route (We will protect this inside the component) */}
          <Route path="/admin/upload" element={<AdminUpload />} />
        </Routes>
      </MainContent>
      <Chatbot />
      <Footer />
    </AppContainer>
  );
}

export default App;