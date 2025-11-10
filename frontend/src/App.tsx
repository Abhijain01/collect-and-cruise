import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import styled from 'styled-components';

// --- THIS IS THE FIX ---
// We are now importing ALL pages from your correct 'pages/' folder
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import CartPage from './pages/CartPage.tsx';
import WishlistPage from './pages/WishlistPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import OrderSuccessPage from './pages/OrderSuccessPage.tsx';
import AdminUpload from './pages/AdminUpload.tsx';
// -----------------------

// We are NOT importing the other admin pages to meet your deadline
import AdminRoute from './components/AdminRoute.tsx';
// import AdminDashboard from './pages/AdminDashboard.tsx';
// import UserListScreen from './pages/admin/UserListScreen.tsx';
// import UserEditScreen from './pages/admin/UserEditScreen.tsx';

import Chatbot from './components/Chatbot.tsx';
import RouteChangeTracker from './components/RouteChangeTracker.tsx'; 

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
          
          {/* We are ignoring these routes for the deadline */}
          {/*
          <Route path="/admin" element={<AdminRoute />}>
            <Route index={true} element={<AdminDashboard />} /> 
            <Route path="userlist" element={<UserListScreen />} />
            <Route path="user/:id/edit" element={<UserEditScreen />} />
          </Route>
          */}
        </Routes>
      </MainContent>
      <Chatbot />
      <Footer />
    </AppContainer>
  );
}

export default App;