// frontend/src/pages/ProductDetail.tsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
// --- 1. IMPORT THE NEW API FUNCTION ---
import { getProductById, createReview, hasPurchased } from '../services/api';
import type { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import Rating from '../components/Rating';

// --- (All styled-components are the same) ---
const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: 768px) {
    padding: 4rem 1rem;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
`;
const Image = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background-secondary);
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
  letter-spacing: 0.05em;
`;
const Name = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-top: 0.5rem;
  line-height: 1.2;
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
  color: #16a34a; // Green
  margin-top: 1.5rem;
  
  &.out-of-stock {
    color: #dc2626; // Red
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
  
  &:hover {
    background-color: var(--color-primary-hover);
  }

  &:disabled {
    background-color: var(--color-text-secondary);
    cursor: not-allowed;
  }
`;
const WishlistButton = styled.button<{ $isWishlisted: boolean }>`
  flex-shrink: 0;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: ${props => props.$isWishlisted ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  fill: ${props => props.$isWishlisted ? 'var(--color-primary)' : 'none'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;
const QtySelector = styled.div`
  margin-top: 1rem;
  label {
    margin-right: 0.5rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
  select {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-text);
  }
`;
const ReviewsWrapper = styled.div`
  margin-top: 4rem;
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
`;
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;
const ReviewItem = styled.div`
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  
  &:last-child {
    border-bottom: none;
  }
`;
const ReviewHeader = styled.div`
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
`;
const ReviewDate = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;
const ReviewComment = styled.p`
  color: var(--color-text);
`;
const ReviewForm = styled.form`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--color-background-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
`;
const InputGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }
  select, textarea {
    display: block;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid var(--color-border);
    padding: 0.5rem 0.75rem;
    color: var(--color-text);
    background-color: var(--color-background);
    &:focus {
      outline: 2px solid var(--color-primary);
    }
  }
`;
const SubmitButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: var(--color-primary-hover); }
  &:disabled { background-color: var(--color-text-secondary); cursor: not-allowed; }
`;
const Message = styled.div<{ $error?: boolean }>`
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: ${props => props.$error ? 'var(--color-background-secondary)' : '#f0fdf4'};
  color: ${props => props.$error ? 'var(--color-primary)' : '#15803d'};
  border: 1px solid ${props => props.$error ? 'var(--color-primary)' : '#bbf7d0'};
  margin-bottom: 1rem;
  
  [data-theme='dark'] & {
    color: ${props => props.$error ? '#fca5a5' : '#86efac'};
    background-color: var(--color-background-secondary);
    border-color: ${props => props.$error ? 'var(--color-primary)' : '#15803d'};
  }
`;

// --- COMPONENT LOGIC ---
const ProductDetail = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { id } = useParams<{ id: string }>();
  
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  
  // --- 2. NEW STATE FOR "VERIFIED PURCHASER" ---
  const [loadingPurchaseCheck, setLoadingPurchaseCheck] = useState(true);
  const [userHasPurchased, setUserHasPurchased] = useState(false);
  // --------------------------------------------

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      // 1. Fetch the product details
      const { data } = await getProductById(id);
      setProduct(data);

      // --- 3. NEW: Check if user has purchased this item ---
      if (userInfo) {
        setLoadingPurchaseCheck(true);
        try {
          // This calls your new backend route
          const { data: purchaseData } = await hasPurchased(id);
          setUserHasPurchased(purchaseData.hasPurchased);
        } catch (error) {
          setUserHasPurchased(false); // Default to false on error
        } finally {
          setLoadingPurchaseCheck(false);
        }
      } else {
        setLoadingPurchaseCheck(false); // Not logged in, so can't have purchased
      }
      
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  }, [id, userInfo]); // Re-run this logic if the user logs in/out

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // (addToCartHandler and handleWishlistClick are unchanged)
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
  
  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      if (!id) throw new Error('No Product ID');
      await createReview(id, rating, comment);
      setReviewSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      fetchProduct(); 
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <PageWrapper><p>Loading...</p></PageWrapper>;
  if (!product) return <PageWrapper><p>Product not found.</p></PageWrapper>;

  const inStock = product.stockQuantity > 0;
  const isItemWishlisted = isWishlisted(product._id);
  const hasAlreadyReviewed = product.reviews.find(
    (r) => r.user === userInfo?._id
  );

  return (
    <>
      <Helmet>
        <title>{product.name} | Collect and Cruise</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <PageWrapper>
        {/* --- (Product Grid, Image, InfoWrapper, etc. are unchanged) --- */}
        <Grid>
          <div>
            <Image src={product.imageUrl} alt={product.name} />
          </div>
          <InfoWrapper>
            <Category>{product.category}</Category>
            <Name>{product.name}</Name>
            <div style={{ marginTop: '0.5rem' }}>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <Price>₹{product.price.toFixed(2)}</Price>
            <Description>{product.description}</Description>
            <Stock className={!inStock ? 'out-of-stock' : ''}>
              {inStock ? `${product.stockQuantity} in stock` : 'Out of Stock'}
            </Stock>
            {inStock && (
              <QtySelector>
                <label htmlFor="qty">Qty:</label>
                <select 
                  id="qty" 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.stockQuantity).keys()].map(x => (
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
                  <Heart size={20} />
                </WishlistButton>
              )}
            </ButtonGroup>
          </InfoWrapper>
        </Grid>

        {/* --- 4. REVIEW SECTION (Now with "Verified Purchaser" Logic) --- */}
        <ReviewsWrapper>
          <SectionTitle>Reviews</SectionTitle>
          {product.reviews.length === 0 && <Message>No reviews yet.</Message>}
          
          <div>
            {product.reviews.map((review: Review) => (
              <ReviewItem key={review._id}>
                <ReviewHeader>{review.name}</ReviewHeader>
                <Rating value={review.rating} />
                <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                <ReviewComment>{review.comment}</ReviewComment>
              </ReviewItem>
            ))}
          </div>

          <ReviewForm onSubmit={submitReviewHandler}>
            <SectionTitle>Write a Review</SectionTitle>
            {reviewSuccess && <Message>{reviewSuccess}</Message>}
            {reviewError && <Message $error>{reviewError}</Message>}

            {userInfo ? (
              hasAlreadyReviewed ? (
                <Message>You have already reviewed this product.</Message>
              ) : loadingPurchaseCheck ? (
                <Message>Checking purchase history...</Message>
              ) : userHasPurchased ? (
                // --- 5. THIS IS THE "VERIFIED" FORM ---
                <>
                  <Message>You are a verified purchaser of this product.</Message>
                  <InputGroup>
                    <label htmlFor="rating">Rating</label>
                    <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>

                      <option value="5">5 - Excellent</option>
                    </select>
                  </InputGroup>
                  <InputGroup>
                    <label htmlFor="comment">Comment</label>
                    <textarea id="comment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
                  </InputGroup>
                  <SubmitButton disabled={reviewLoading} type="submit">
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </SubmitButton>
                </>
              ) : (
                // --- 6. USER IS LOGGED IN, BUT HAS NOT BOUGHT THE ITEM ---
                <Message>Only verified purchasers can write a review.</Message>
              )
            ) : (
              // --- 7. USER IS A GUEST ---
              <Message>
                Please <Link to="/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>log in</Link> to write a review.
              </Message>
            )}
          </ReviewForm>
        </ReviewsWrapper>
      </PageWrapper>
    </>
  );
};

export default ProductDetail;