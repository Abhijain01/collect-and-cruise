import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getProducts } from '../services/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

// Hero Section remains dark, but buttons use theme
const HeroSection = styled.div`
  position: relative;
  background-color: #111827;
  color: white;
  img {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  div.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 6rem 1rem;
  text-align: center;
  @media (min-width: 640px) {
    padding: 8rem 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  @media (min-width: 640px) {
    font-size: 3.75rem;
  }
`;

const HeroSubtitle = styled.p`
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: #d1d5db;
`;

const HeroButton = styled(Link)`
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

// This section IS themed
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

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProducts();
        setProducts(data.slice(0, 4)); // Get first 4 for "featured"
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Collect and Cruise: Premium Diecast Cars</title>
        <meta name="description" content="Shop the finest collectible vehicles, from Mainline to Premium. Your cruising adventure starts here." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection>
        <img src="/images/hero-banner.png" alt="HotWheels Collection" />
        <div className="overlay" />
        <HeroContent>
          <HeroTitle>Collect & Cruise</HeroTitle>
          <HeroSubtitle>Discover and collect the finest vehicles for your cruising adventures.</HeroSubtitle>
          <HeroButton to="/shop">Shop All Models</HeroButton>
        </HeroContent>
      </HeroSection>

      {/* Featured Products Section */}
      <PageWrapper>
        <ContentContainer>
          <SectionTitle>Featured Products</SectionTitle>
          <ProductGrid>
            {loading ? (
              <p>Loading products...</p>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </ProductGrid>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default Home;