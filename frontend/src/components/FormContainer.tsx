import { ReactNode } from 'react';
import styled from 'styled-components';

// This styled-component creates a centered column for your forms.
// It replaces the functionality of the 'react-bootstrap' FormContainer.

const Container = styled.div`
  max-width: 1280px; /* Full width container */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* This centers the column */
`;

const Column = styled.div`
  width: 100%; /* Full width on mobile */

  @media (min-width: 768px) { /* 'md' breakpoint */
    width: 50%; /* 6 out of 12 columns */
  }
`;

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <Container>
      <Row>
        <Column>
          {children}
        </Column>
      </Row>
    </Container>
  );
};

export default FormContainer;
