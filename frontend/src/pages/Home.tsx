// frontend/src/pages/Home.tsx
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { getProducts } from "../services/api";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

// --- HERO SECTION STYLES ---
const HeroSection = styled.section`
  position: relative;
  color: white;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(60%);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.03em;
  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  margin-top: 1rem;
  font-size: 1.25rem;
  color: #d1d5db;
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.9rem 2.5rem;
  font-size: 1rem;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
  }
`;

// --- FEATURED PRODUCTS SECTION ---
const PageWrapper = styled.div`
  background-color: var(--color-background);
`;

const ContentContainer = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  @media (min-width: 640px) {
    padding: 6rem 2rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
`;

const ViewAllLink = styled(Link)`
  color: var(--color-primary);
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

// --- CATEGORY SECTION ---
const CategorySection = styled.section`
  background-color: var(--color-background-secondary);
  padding: 4rem 1.5rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const CategoryCard = styled(motion(Link))`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  display: block;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  span {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    color: white;
    font-weight: 700;
    font-size: 1.2rem;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }
`;

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProducts();
        setProducts(data.slice(0, 4));
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Collect & Cruise — Premium Diecast Cars</title>
        <meta
          name="description"
          content="Shop the finest collectible cars — Mainline, Premium, and Super Treasure Hunt editions. Your passion deserves the best."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection>
        <img src="/images/hero-banner.png" alt="Diecast Cars" />
        <div className="overlay" />
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Collect & Cruise 🚗
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover limited-edition collectibles and classic masterpieces.
          </HeroSubtitle>
          <HeroButton to="/shop">Explore Now</HeroButton>
        </HeroContent>
      </HeroSection>

      {/* Category Highlights */}
      <CategorySection>
        <ContentContainer>
          <SectionTitle>Shop by Category</SectionTitle>
          <CategoryGrid>
            {[
              { name: "Mainline", image: "/images/mainline.jpg" },
              { name: "Premium", image: "/images/premium.jpg" },
              { name: "Super Treasure Hunt", image: "/images/treasure.jpg" },
            ].map((cat, idx) => (
              <CategoryCard
                key={idx}
                to={`/shop?category=${cat.name.toLowerCase()}`}
                whileHover={{ scale: 1.03 }}
              >
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <span>{cat.name}</span>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </ContentContainer>
      </CategorySection>

      {/* Featured Products */}
      <PageWrapper>
        <ContentContainer>
          <SectionHeader>
            <SectionTitle>Featured Products</SectionTitle>
            <ViewAllLink to="/shop">View All →</ViewAllLink>
          </SectionHeader>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <ProductGrid
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </ProductGrid>
          )}
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default Home;
