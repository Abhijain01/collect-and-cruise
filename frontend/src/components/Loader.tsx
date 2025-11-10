import styled, { keyframes } from 'styled-components';

// Define the spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Create the styled spinner
const Spinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border); /* Use theme color */
  border-top-color: var(--color-primary); /* Use theme color */
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// A wrapper to center the loader
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

// The Loader component
const Loader = () => {
  return (
    <LoaderWrapper>
      <Spinner />
    </LoaderWrapper>
  );
};

export default Loader;