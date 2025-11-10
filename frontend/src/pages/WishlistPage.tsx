import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { useWishlist } from '../context/WishlistContext'; // Your hook
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

// --- Styled Components ---
const PageWrapper = styled.div`
  max-width: 1280px;
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

const ProductGrid = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// --- COMPONENT ---

const WishlistPage = () => {
  // 1. Get the full state from the hook
  const { wishlist } = useWishlist();
  const { wishlistItems, loading, error } = wishlist;

  // 2. Render content based on the state
  const renderContent = () => {
    // --- THIS IS THE FIX ---
    // First, check for loading
    if (loading) {
      return <Loader />;
    }
    
    // Second, check for errors
    if (error) {
      return <Message $error>{error}</Message>;
    }
    
    // Third, check for an empty list
    // This is Line 64. It is now "safe" to check .length
    if (wishlistItems.length === 0) {
      return (
        <Message>
          Your wishlist is empty.{' '}
          <Link to="/shop" style={{ textDecoration: 'underline' }}>
            Go Shopping
          </Link>
        </Message>
      );
    }
    // -----------------------
    
    // Finally, render the grid
    return (
      <ProductGrid>
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    );
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist | Collect and Cruise</title>
      </Helmet>
      <PageWrapper>
        <Title>My Wishlist</Title>
        {renderContent()}
      </PageWrapper>
    </>
  );
};

export default WishlistPage;