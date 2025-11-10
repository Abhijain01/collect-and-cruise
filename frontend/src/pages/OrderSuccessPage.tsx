import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { CheckCircle } from 'lucide-react';

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 4rem 1rem;
  background-color: var(--color-background);
  min-height: 60vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SuccessIcon = styled(CheckCircle)`
  color: var(--color-success);
  width: 80px;
  height: 80px;
  stroke-width: 1.5;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 2rem;
`;

const Message = styled.p`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-top: 1rem;
  max-width: 500px;
`;

const OrderId = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  margin-top: 1.5rem;
  display: inline-block;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  margin-top: 2.5rem;
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

// --- COMPONENT ---

const OrderSuccessPage = () => {
  const { id: orderId } = useParams();

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Collect and Cruise</title>
      </Helmet>
      <PageWrapper>
        <SuccessIcon />
        <Title>Thank you for your order!</Title>
        <Message>
          Your order has been successfully placed. Since this is a "mock" order,
          no payment was processed, but the order has been saved to your account.
        </Message>
        <OrderId>
          Order ID: {orderId}
        </OrderId>
        <HomeButton to="/">Back to Homepage</HomeButton>
      </PageWrapper>
    </>
  );
};

export default OrderSuccessPage;