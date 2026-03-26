import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { getProductById } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import Loader from '../components/Loader'; 
import Message from '../components/Message'; 
import Breadcrumb from '../components/Breadcrumb';

// ... (PageWrapper, Grid, Image, InfoWrapper, Category, Name, Price, etc. are the same) ...
const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1rem;
  background-color: var(--color-background);
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Image = styled.img`
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Category = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  text-transform: uppercase;
`;
const Name = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 0.5rem;
`;
const Price = styled.p`
  font-size: 1.875rem;
  color: var(--color-text);
  margin-top: 1rem;
`;
const Description = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-top: 1.5rem;
  line-height: 1.6;
`;
const Stock = styled.p`
  font-size: 0.875rem;
  color: var(--color-success);
  margin-top: 1.5rem;
  
  &.out-of-stock {
    color: var(--color-error);
  }
`;
const QtySelector = styled.div`
  margin-top: 1.5rem;
  max-width: 200px;
  display: flex;
  align-items: center;
  gap: 1rem;

  label {
    font-weight: 500;
    color: var(--color-text-secondary);
  }
  select {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-text);
  }
`;
const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.75rem; // 12px
`;

const AddToCartButton = styled.button`
  flex-grow: 1;
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
  &:disabled { background-color: var(--color-text-secondary); cursor: not-allowed; }
`;

// --- FIX 1: Remove the 'fill' CSS property ---
const WishlistButton = styled.button<{ $isWishlisted: boolean }>`
  flex-shrink: 0;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: ${props => props.$isWishlisted ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  /* 'fill' property is gone */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;
// ------------------------------------------

const ProductDetail = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (product) {
      addToCart(product, qty);
      navigate('/cart');
    }
  };

  const handleWishlistClick = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  if (loading) return <PageWrapper><Loader /></PageWrapper>;
  if (!product) return <PageWrapper><Message $error>Product not found.</Message></PageWrapper>;

  const inStock = product.stockQuantity > 0;
  const isItemWishlisted = product ? isWishlisted(product._id) : false;

  return (
    <>
      <Helmet>
        <title>{product.name} | Collect and Cruise</title>
        <meta name="description" content={product.description} />
        
        {/* Product JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.imageUrl,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": product.category
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Collect and Cruise"
              }
            }
          })}
        </script>

        {/* BreadcrumbList JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://collect-and-cruise.vercel.app/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://collect-and-cruise.vercel.app/shop"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": product.category,
                "item": `https://collect-and-cruise.vercel.app/shop?keyword=${encodeURIComponent(product.category)}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": product.name,
                "item": window.location.href
              }
            ]
          })}
        </script>
      </Helmet>
      <PageWrapper>
        <Breadcrumb category={product.category} productName={product.name} />
        <Grid>
          <div>
            <Image src={product.imageUrl} alt={`Hot Wheels ${product.name} 1:64 diecast model car`} width="600" height="600" />
          </div>
          <InfoWrapper>
            <Category>{product.category}</Category>
            <Name>{product.name}</Name>
            <Price>₹{product.price.toFixed(2)}</Price>
            <Description>{product.description}</Description>
            <Stock className={!inStock ? 'out-of-stock' : ''}>
              {inStock ? `${product.stockQuantity} in stock` : 'Out of Stock'}
            </Stock>

            {inStock && (
              <QtySelector>
                <label htmlFor="qty">Quantity:</label>
                <select 
                  id="qty" 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(Math.min(product.stockQuantity, 10)).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </QtySelector>
            )}
            
            <ButtonGroup>
              <AddToCartButton onClick={addToCartHandler} disabled={!inStock}>
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </AddToCartButton>
              
              {userInfo && (
                <WishlistButton $isWishlisted={isItemWishlisted} onClick={handleWishlistClick}>
                  {/* --- FIX 2: Add 'fill' prop to the icon --- */}
                  <Heart 
                    size={20} 
                    fill={isItemWishlisted ? 'var(--color-primary)' : 'none'}
                  />
                  {/* ------------------------------------------- */}
                </WishlistButton>
              )}
            </ButtonGroup>
            
          </InfoWrapper>
        </Grid>
      </PageWrapper>
    </>
  );
};

export default ProductDetail;