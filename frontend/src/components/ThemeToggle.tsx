import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import our new hook

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: var(--color-text);
    background-color: var(--color-background-secondary);
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </ToggleButton>
  );
};

export default ThemeToggle;