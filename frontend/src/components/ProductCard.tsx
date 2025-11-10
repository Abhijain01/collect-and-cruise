import type { Product } from '../types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

// --- KEY FIX: Enforcing a Max Width for the Card ---
const CardWrapper = styled.div`
  /* On small screens, take up full width. */
  /* The ProductGrid controls how many columns wide it is. */
  position: relative; 
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-background);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    [data-theme='dark'] & {
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
    }
  }
`;

const CardLink = styled(Link)`
  display: block;
  overflow: hidden;
  border-radius: 0.5rem 0.5rem 0 0;
`;

// --- The element that sets the aspect ratio and prevents stretching ---
const ImageWrapper = styled.div`
  aspect-ratio: 1 / 1;
  width: 100%;
  background-color: var(--color-background-secondary);
  overflow: hidden; /* Ensures image does not leak on hover zoom */
`;

// --- The image itself ---
const Image = styled.img`
  /* FIX: Ensure the image occupies 100% of the constrained container */
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;

  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ContentWrapper = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TextInfo = styled.div`
  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }
  p {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
`;

const Price = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
`;

const WishlistButton = styled.button<{ $isWishlisted: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 99px;
  border: none;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  
  color: ${props => props.$isWishlisted ? 'var(--color-primary)' : 'var(--color-text)'};
  fill: ${props => props.$isWishlisted ? 'var(--color-primary)' : 'none'};
  
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: var(--color-primary);
  }

  [data-theme='dark'] & {
    background-color: rgba(31, 41, 55, 0.8);
  }
`;

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { userInfo } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const isItemWishlisted = isWishlisted(product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <CardWrapper>
      {userInfo && (
        <WishlistButton 
          $isWishlisted={isItemWishlisted} 
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
        >
          <Heart 
            size={20} 
            fill={isItemWishlisted ? 'var(--color-primary)' : 'none'} 
          />
        </WishlistButton>
      )}

      <CardLink to={`/product/${product._id}`}>
        <ImageWrapper>
          <Image src={product.imageUrl} alt={product.name} />
        </ImageWrapper>
        <ContentWrapper>
          <TextInfo>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
          </TextInfo>
          <Price>₹{product.price.toFixed(2)}</Price>
        </ContentWrapper>
      </CardLink>
    </CardWrapper>
  );
};

export default ProductCard;