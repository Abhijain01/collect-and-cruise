// frontend/src/pages/CartPage.tsx

import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { Trash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- STYLED COMPONENT DEFINITIONS ---
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

const CartGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--color-background-secondary);
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const ItemInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemQty = styled.p`
  font-weight: 500;
  color: var(--color-text);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  &:hover { color: #b91c1c; }
`;

const Summary = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75rem;
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

const CheckoutButton = styled.button`
  display: block; 
  text-align: center;
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
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 4rem;
  border: 1px dashed var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background-secondary);
`;

// --- COMPONENT LOGIC ---
const CartPage = () => {
  const { cartItems, removeFromCart, loading } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  if (loading) {
    return <PageWrapper><Title>Loading Cart...</Title></PageWrapper>
  }
  
  const validCartItems = cartItems.filter(item => item.product);
  const subtotal = validCartItems.reduce((acc, item) => acc + item.qty * item.product.price, 0);
  const totalItems = validCartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <Helmet><title>Your Shopping Cart | Collect and Cruise</title></Helmet>
      <PageWrapper>
        <Title>Your Shopping Cart</Title>

        {validCartItems.length === 0 ? (
          <EmptyCartMessage>
            <p>Your cart is empty.</p>
            <Link to="/shop" style={{ color: 'var(--color-primary)', fontWeight: 500, marginTop: '1rem', display: 'inline-block' }}>
              Go Shopping
            </Link>
          </EmptyCartMessage>
        ) : (
          <CartGrid>
            <CartItemList>
              {validCartItems.map(item => (
                <CartItem key={item.product._id}>
                  <ItemImage src={item.product.imageUrl} alt={item.product.name} />
                  <ItemInfo>
                    <div>
                      <ItemName to={`/product/${item.product._id}`}>{item.product.name}</ItemName>
                      <ItemPrice>₹{item.product.price.toFixed(2)}</ItemPrice>
                    </div>
                    <ItemActions>
                      <ItemQty>Qty: {item.qty}</ItemQty>
                      <RemoveButton onClick={() => removeFromCart(item.product._id)}>
                        <Trash size={16} />
                      </RemoveButton>
                    </ItemActions>
                  </ItemInfo>
                </CartItem>
              ))}
            </CartItemList>

            <Summary>
              <SummaryTitle>Order Summary</SummaryTitle>
              <SummaryRow>
                <p>Items ({totalItems})</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </SummaryRow>
              <SummaryRow>
                <p>Shipping</p>
                <p>FREE</p>
              </SummaryRow>
              <SummaryTotal>
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </SummaryTotal>
              
              <CheckoutButton onClick={checkoutHandler}>
                Proceed to Checkout
              </CheckoutButton>
            </Summary>
          </CartGrid>
        )}
      </PageWrapper>
    </>
  );
};

export default CartPage;