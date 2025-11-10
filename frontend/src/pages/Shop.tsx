import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from 'react-router-dom'; // Import Link
import styled from 'styled-components';
import { getProducts } from '../services/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
// Import Loader and Message (which we fixed)
import Loader from '../components/Loader';
import Message from '../components/Message';

const PageWrapper = styled.div`
  background-color: var(--color-background);
`;

const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 60vh;
  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
`;

// --- THIS IS THE "PROPER" FIX ---
// This styled-component creates a responsive grid.
// It will show 1 column on mobile, 2 on tablet, and 4 on desktop.
// This is what stops your images from being "very big."
const ProductGrid = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr; /* 1 column by default (mobile) */
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr); /* 4 columns on desktop */
  }
`;
// ---------------------------------

// Helper function to parse URL queries
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const query = useQuery();
  const keyword = query.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Pass the keyword (if any) to the API
        const { data } = await getProducts(keyword);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]); // Re-run this effect when the keyword changes

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (products.length === 0) {
      return (
        <Message $error={false}>
          No products found {keyword && `for "${keyword}"`}. 
          <Link to="/shop" style={{ textDecoration: 'underline', marginLeft: '5px' }}>
            Clear Search
          </Link>
        </Message>
      );
    }

    return (
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </ProductGrid>
    );
  };

  return (
    <>
      <Helmet>
        <title>{keyword ? `Search results for "${keyword}"` : 'Shop All Products'} | Collect and Cruise</title>
      </Helmet>
      <PageWrapper>
        <ContentContainer>
          <SectionTitle>
            {keyword ? `Search results for "${keyword}"` : 'All Products'}
          </SectionTitle>
          {renderContent()}
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default Shop;