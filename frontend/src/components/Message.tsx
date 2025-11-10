import { ReactNode } from 'react';
import styled from 'styled-components';

// Define the props, including the '$error' prop
interface MessageProps {
  children: ReactNode;
  $error?: boolean; // Use '$' for transient props in styled-components
}

// Create the styled box
const MessageWrapper = styled.div<MessageProps>`
  text-align: center;
  font-size: 1rem;
  padding: 1.25rem;
  border-radius: 0.375rem;
  
  /* Use our global theme colors */
  color: ${props => props.$error ? 'var(--color-error)' : 'var(--color-success)'};
  background-color: ${props => props.$error ? 'var(--color-error-bg)' : 'var(--color-success-bg)'};
  border: 1px solid ${props => props.$error ? 'var(--color-error)' : 'var(--color-success)'};
`;

// The Message component
const Message = ({ children, $error }: MessageProps) => {
  return (
    <MessageWrapper $error={$error}>
      {children}
    </MessageWrapper>
  );
};

export default Message;