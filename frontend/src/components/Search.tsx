// frontend/src/components/Search.tsx

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Search as SearchIcon, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { searchProducts } from '../services/api';
import type { Product } from '../types';

// --- STYLED COMPONENTS ---

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem; // Space for icons
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  background-color: var(--color-background-secondary);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: 2px solid var(--color-primary);
    background-color: var(--color-background);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  color: var(--color-text-secondary);
  &:hover {
    color: var(--color-text);
  }
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
`;

const ResultItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-background-secondary);
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 0.25rem;
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

// --- COMPONENT LOGIC ---

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // This is our custom hook in action!
  const debouncedQuery = useDebounce(query, 500); // 500ms delay

  const searchRef = useRef<HTMLDivElement>(null);

  // This effect runs when the *debounced* query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length > 1) { // Only search if 2+ chars
        setLoading(true);
        setShowResults(true);
        try {
          const { data } = await searchProducts(debouncedQuery);
          setResults(data);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <SearchWrapper ref={searchRef}>
      <SearchInput
        type="text"
        placeholder="Search for 'Porsche', 'Premium'..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
      />
      <IconWrapper>
        <SearchIcon size={18} />
        {query && (
          <ClearButton onClick={clearSearch}>
            <X size={16} />
          </ClearButton>
        )}
      </IconWrapper>

      {showResults && (debouncedQuery.length > 1) && (
        <ResultsDropdown>
          {loading ? (
            <NoResults>Searching...</NoResults>
          ) : results.length > 0 ? (
            results.map((product) => (
              <ResultItem 
                key={product._id} 
                to={`/product/${product._id}`}
                onClick={() => setShowResults(false)} // Hide on click
              >
                <img src={product.imageUrl} alt={product.name} />
                <span>{product.name}</span>
              </ResultItem>
            ))
          ) : (
            <NoResults>No results found for "{debouncedQuery}"</NoResults>
          )}
        </ResultsDropdown>
      )}
    </SearchWrapper>
  );
};