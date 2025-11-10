import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
// We'll use these components (which you have) for messages
import Loader from '../components/Loader';
import Message from '../components/Message';

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItemCard = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const ItemInfo = styled.div`
  flex-grow: 1;
`;

const ItemName = styled(Link)`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  &:hover {
    color: var(--color-primary);
  }
`;

const ItemPrice = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
`;

const ItemQty = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  margin-right: 1rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 99px;
  &:hover {
    color: var(--color-primary);
    background-color: var(--color-border);
  }
`;

const CartSummary = styled.div`
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  height: fit-content; // Makes it stick nicely
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  
  span:last-child {
    font-weight: 600;
    color: var(--color-text);
  }
`;

const CheckoutButton = styled.button`
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

// --- COMPONENT ---

const CartPage = () => {
  const navigate = useNavigate();
  // Get all cart functions and state from our "smart" context
  const { cart, removeFromCart } = useCart();
  const { cartItems, loading, error } = cart;

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const checkoutHandler = () => {
    navigate('/checkout'); // We'll build this page next
  };

  if (loading) {
    return <PageWrapper><Loader /></PageWrapper>;
  }
  
  if (error) {
    return <PageWrapper><Message $error>{error}</Message></PageWrapper>;
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart | Collect and Cruise</title>
      </Helmet>
      <PageWrapper>
        <Title>Shopping Cart</Title>
        <CartGrid>
          <CartItemsList>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty. <Link to="/shop" style={{ textDecoration: 'underline' }}>Go Shopping</Link>
              </Message>
            ) : (
              cartItems.map((item) => (
                <CartItemCard key={item.product._id}>
                  <ItemImage src={item.product.imageUrl} alt={item.product.name} />
                  <ItemInfo>
                    <ItemName to={`/product/${item.product._id}`}>
                      {item.product.name}
                    </ItemName>
                    <ItemPrice>₹{item.product.price.toFixed(2)}</ItemPrice>
                  </ItemInfo>
                  <ItemQty>Qty: {item.qty}</ItemQty>
                  <RemoveButton onClick={() => handleRemove(item.product._id)}>
                    <Trash2 size={20} />
                  </RemoveButton>
                </CartItemCard>
              ))
            )}
          </CartItemsList>

          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            <SummaryRow>
              <span>Items ({totalItems})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </SummaryRow>
            {/* We'll add tax/shipping later */}
            <SummaryRow style={{ 
              borderTop: '1px solid var(--color-border)', 
              paddingTop: '1rem',
              fontSize: '1.25rem'
            }}>
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </SummaryRow>
            <CheckoutButton 
              disabled={cartItems.length === 0} 
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </CheckoutButton>
          </CartSummary>
        </CartGrid>
      </PageWrapper>
    </>
  );
};

export default CartPage;