import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';

const BreadcrumbNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  flex-wrap: wrap;

  a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }

  span {
    color: var(--color-text);
  }
`;

interface BreadcrumbProps {
  category: string;
  productName: string;
}

const Breadcrumb = ({ category, productName }: BreadcrumbProps) => {
  return (
    <BreadcrumbNav aria-label="breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={16} />
      <Link to="/shop">Products</Link>
      <ChevronRight size={16} />
      {category && (
        <>
          <Link to={`/shop?keyword=${encodeURIComponent(category)}`}>{category}</Link>
          <ChevronRight size={16} />
        </>
      )}
      <span aria-current="page">{productName}</span>
    </BreadcrumbNav>
  );
};

export default Breadcrumb;
