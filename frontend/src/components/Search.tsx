import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, X } from 'lucide-react'; // <-- Import X

// --- NEW: Add an onClose prop ---
interface SearchComponentProps {
  onClose: () => void;
}

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  flex-grow: 1; /* Take up available space */
  border: 1px solid var(--color-border);
  border-radius: 99px;
  background-color: var(--color-background-secondary);
  padding-left: 0.75rem;
  
  &:focus-within {
    border-color: var(--color-primary);
  }
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  padding: 0.5rem;
  color: var(--color-text);
  outline: none;
  font-size: 1rem; /* Made a bit larger */
  width: 100%; /* Fill the form */

  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  color: var(--color-text-secondary);
  
  &:hover {
    color: var(--color-primary);
  }
`;

// --- NEW: Close Button ---
const CloseButton = styled(SearchButton)`
  margin-left: 0.5rem;
  padding: 0.75rem;
  border-radius: 50%;
  &:hover {
    background-color: var(--color-background-secondary);
  }
`;

// --- Updated Component ---
const SearchComponent = ({ onClose }: SearchComponentProps) => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${keyword}`);
      setKeyword('');
    } else {
      navigate('/shop');
    }
    onClose(); // <-- Close the search bar after submit
  };

  return (
    <SearchWrapper>
      <SearchForm onSubmit={submitHandler}>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoFocus /* Automatically focus the input */
        />
        <SearchButton type="submit" aria-label="Search">
          <Search size={18} />
        </SearchButton>
      </SearchForm>
      {/* --- NEW: Add the Close button --- */}
      <CloseButton onClick={onClose} aria-label="Close search">
        <X size={24} />
      </CloseButton>
    </SearchWrapper>
  );
};

export default SearchComponent;