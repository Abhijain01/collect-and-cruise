// frontend/src/pages/OrderSuccessPage.tsx

import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle } from 'lucide-react';

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  background-color: var(--color-background-secondary);
  border-radius: 0.5rem;
  margin: 4rem auto;
  max-width: 600px;
  border: 1px solid var(--color-border);
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
`;

const OrderId = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  code {
    background-color: var(--color-border);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: var(--color-text);
  }
`;

const HomeButton = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  border-radius: 0.375rem;
  background-color: var(--color-primary);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--color-primary-hover);
  }
`;

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <>
      <Helmet><title>Order Successful! | Collect and Cruise</title></Helmet>
      <SuccessWrapper>
        <CheckCircle size={60} color="#16a34a" />
        <Title>Thank you for your order!</Title>
        <Subtitle>Your mock payment was successful.</Subtitle>
        {orderId && (
          <OrderId>
            Your Order ID is: <code>{orderId}</code>
          </OrderId>
        )}
        <HomeButton to="/">Continue Shopping</HomeButton>
      </SuccessWrapper>
    </>
  );
};

export default OrderSuccessPage;