// --- 1. FIX: Import 'Link' from 'react-router-dom' ---
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { createMockOrder } from '../services/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useState } from 'react';

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  min-height: 60vh;

  @media (min-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const OrderItemsList = styled.div`
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

const CartItemCard = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  align-items: center;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
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

const ItemName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const ItemTotals = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
`;

const OrderSummary = styled.div`
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  height: fit-content;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  
  span:last-child {
    font-weight: 600;
    color: var(--color-text);
  }
`;

const TotalRow = styled(SummaryRow)`
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-hover);
  }
  &:disabled {
    background-color: var(--color-text-secondary);
    cursor: not-allowed;
  }
`;

// --- 2. FIX: Create a styled-component for the error message ---
// This fixes the 'style' prop error
const ErrorMessage = styled(Message)`
  margin-top: 1rem;
`;
// -----------------------------------------------------------

// --- COMPONENT ---

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { cartItems, loading: cartLoading, error: cartError } = cart;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const totalPrice = subtotal;

  const confirmOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: newOrder } = await createMockOrder();
      clearCart();
      navigate(`/order-success/${newOrder._id}`);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | Collect and Cruise</title>
      </Helmet>
      <PageWrapper>
        <Title>Checkout</Title>
        
        {cartLoading ? (
          <Loader />
        ) : cartError ? (
          <Message $error>{cartError}</Message>
        ) : cartItems.length === 0 ? (
          // --- 1. FIX: 'Link' is now imported ---
          <Message $error={false}>Your cart is empty. <Link to="/shop" style={{ textDecoration: 'underline' }}>Go Shopping</Link></Message>
        ) : (
          <CheckoutGrid>
            <OrderItemsList>
              <SectionTitle>Order Items</SectionTitle>
              {cartItems.map((item) => (
                <CartItemCard key={item.product._id}>
                  <ItemImage src={item.product.imageUrl} alt={item.product.name} />
                  <ItemInfo>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemTotals>
                      {item.qty} x ₹{item.product.price.toFixed(2)} = <b>₹{(item.qty * item.product.price).toFixed(2)}</b>
                    </ItemTotals>
                  </ItemInfo>
                </CartItemCard>
              ))}
            </OrderItemsList>

            <OrderSummary>
              {/* --- 2. FIX: Renamed SummaryTitle to SectionTitle --- */}
              <SectionTitle>Order Summary</SectionTitle>
              <SummaryRow>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Shipping</span>
                <span>FREE</span>
              </SummaryRow>
              <SummaryRow>
                <span>Tax</span>
                <span>Calculated at next step</span>
              </SummaryRow>
              <TotalRow>
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </TotalRow>
              
              {/* --- 3. FIX: Use the new ErrorMessage component --- */}
              {error && <ErrorMessage $error>{error}</ErrorMessage>}
              
              <ConfirmButton 
                disabled={cartItems.length === 0 || loading} 
                onClick={confirmOrderHandler}
              >
                {loading ? 'Placing Order...' : 'Confirm Mock Order'}
              </ConfirmButton>
            </OrderSummary>
          </CheckoutGrid>
        )}
      </PageWrapper>
    </>
  );
};

export default CheckoutPage;