// frontend/src/components/ThemeToggle.tsx

import { Moon, Sun } from 'lucide-react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// Re-using the IconButton style from Header
const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary); // Use CSS variable
  padding: 0.25rem;
  border-radius: 99px;
  transition: all 0.2s;

  &:hover {
    color: var(--color-text); // Use CSS variable
    background-color: var(--color-background-secondary); // Use CSS variable
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} title={`Activate ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </ToggleButton>
  );
};

export default ThemeToggle;