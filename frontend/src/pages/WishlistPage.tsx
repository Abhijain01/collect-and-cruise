// frontend/src/pages/WishlistPage.tsx

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

// Use CSS variables
const PageWrapper = styled.div`
  background-color: var(--color-background);
`;

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1rem;
  @media (min-width: 640px) {
    padding: 6rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 4rem;
  border: 1px dashed var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background-secondary);
  color: var(--color-text-secondary);
`;

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();

  return (
    <>
      <Helmet>
        <title>My Wishlist | Collect and Cruise</title>
      </Helmet>
      <PageWrapper>
        <ContentContainer>
          <SectionTitle>My Wishlist</SectionTitle>
          {loading ? (
            <p>Loading wishlist...</p>
          ) : wishlistItems.length === 0 ? (
            <EmptyMessage>
              <p>Your wishlist is empty.</p>
              <Link to="/shop" style={{ color: 'var(--color-primary)', fontWeight: 500, marginTop: '1rem', display: 'inline-block' }}>
                Find products to save
              </Link>
            </EmptyMessage>
          ) : (
            <ProductGrid>
              {wishlistItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductGrid>
          )}
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default WishlistPage;