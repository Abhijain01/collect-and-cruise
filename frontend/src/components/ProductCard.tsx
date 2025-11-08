import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Product } from "../types";

const Card = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-background-secondary);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const Price = styled.p`
  color: var(--color-primary);
  font-weight: 700;
`;

const ProductCard = ({ product }: { product: Product }) => (
  <Card>
    <Link to={`/product/${product._id}`}>
      <Image src={product.imageUrl} alt={product.name} />
      <Info>
        <ProductName>{product.name}</ProductName>
        <Price>₹{product.price}</Price>
      </Info>
    </Link>
  </Card>
);

export default ProductCard;
