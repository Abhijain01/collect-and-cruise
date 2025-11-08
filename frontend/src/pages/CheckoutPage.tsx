// frontend/src/pages/CheckoutPage.tsx

import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createMockOrder } from '../services/api';
import { useState, useEffect } from 'react';

// --- STYLED COMPONENTS ---
const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
`;

const CheckoutGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const ItemInfo = styled.div`
  flex-grow: 1;
`;

const ItemName = styled(Link)`
  font-weight: 600;
  color: var(--color-text);
  &:hover { text-decoration: underline; }
`;

const ItemPrice = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const Summary = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
  height: fit-content;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  margin-top: 0.75rem;
  color: var(--color-text-secondary);
`;

const SummaryTotal = styled(SummaryRow)`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

const PlaceOrderButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: var(--color-primary-hover); }
  &:disabled { background-color: var(--color-text-secondary); cursor: not-allowed; }
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-primary);
`;

// --- COMPONENT LOGIC ---
const CheckoutPage = () => {
  const { cartItems, loading: cartLoading, refreshCart } = useCart(); 
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout', { replace: true });
    }
    if (cartItems.length === 0 && !cartLoading) {
       navigate('/shop');
    }
  }, [userInfo, navigate, cartItems, cartLoading]);

  // --- THIS IS THE FIX ---
  // Access the correct nested properties: item.product.price
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0);

  const placeOrderHandler = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: newOrder } = await createMockOrder();
      refreshCart();
      navigate(`/order/success?orderId=${newOrder._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order.');
      setLoading(false);
    }
  };
  
  if (cartLoading) return <PageWrapper><Title>Loading...</Title></PageWrapper>;

  return (
    <>
      <Helmet><title>Checkout | Collect and Cruise</title></Helmet>
      <PageWrapper>
        <Title>Checkout</Title>
        <CheckoutGrid>
          <OrderDetails>
            <Section>
              <SectionTitle>Shipping Address</SectionTitle>
              <p>{userInfo?.email}</p>
              <p>123 Test St, Test City, 12345</p>
              <p>(This is a mock address)</p>
            </Section>

            <Section>
              <SectionTitle>Review Order Items</SectionTitle>
              {cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/shop">Go Shopping</Link></p>
              ) : (
                cartItems.map(item => (
                  <CartItem key={item.product._id}>
                    <ItemImage src={item.product.imageUrl} alt={item.product.name} />
                    <ItemInfo>
                      <ItemName to={`/product/${item.product._id}`}>{item.product.name}</ItemName>
                      {/* --- THIS IS THE FIX --- */}
                      <ItemPrice>
                        {item.qty} x ₹{item.product.price.toFixed(2)} = ₹{(item.qty * item.product.price).toFixed(2)}
                      </ItemPrice>
                    </ItemInfo>
                  </CartItem>
                ))
              )}
            </Section>
          </OrderDetails>

          <Summary>
            <SectionTitle>Order Summary</SectionTitle>
            <SummaryRow>
              {/* --- THIS IS THE FIX --- */}
              <p>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </SummaryRow>
            <SummaryRow>
              <p>Shipping</p>
              <p>FREE</p>
            </SummaryRow>
            <SummaryTotal>
              <p>Total</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </SummaryTotal>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <PlaceOrderButton 
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? 'Placing Order...' : 'Place Order (Mock Payment)'}
            </PlaceOrderButton>
          </Summary>
        </CheckoutGrid>
      </PageWrapper>
    </>
  );
};

export default CheckoutPage;