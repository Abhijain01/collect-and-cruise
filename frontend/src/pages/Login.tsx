import { useState, useEffect, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// --- THIS IS THE FIX ---
// Import your REAL AuthContext and FormContainer
import { useAuth } from '../context/AuthContext';
import FormContainer from '../components/FormContainer';
// -----------------------
import { toast } from 'react-toastify';

// --- Styled Components (Using Theme Variables) ---
const FormWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 1.5rem;
  background-color: var(--color-background);
`;

const Title = styled.h2`
  margin-top: 2.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
`;

const Form = styled.form`
  margin-top: 2.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }
  input {
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-border);
    padding: 0.5rem 0.75rem;
    color: var(--color-text);
    background-color: var(--color-background);
    &:focus {
      outline: 2px solid var(--color-primary);
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--color-primary-hover);
  }
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-error);
  margin-top: 1rem;
`;

const RedirectText = styled.p`
  margin-top: 2.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  a {
    color: var(--color-primary);
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;
// --- End Styled Components ---

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- THE "PROPER" CONTEXT FIX ---
  // We get the real functions from our context
  const { userInfo, loginWithCredentials } = useAuth();
  // ---------------------------------

  useEffect(() => {
    // If user is already logged in, redirect
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // --- THIS IS THE FIX ---
      // Call the login function from the context
      await loginWithCredentials(email, password);
      // -----------------------
      
      navigate('/');
      toast.success('Logged in successfully');
    } catch (err: any) {
      // Error is already toasted by the context, but we can set a local one too
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Login | Collect and Cruise</title></Helmet>
      <FormWrapper>
        <FormContainer>
          <img
            style={{ margin: '0 auto', height: '48px', width: 'auto' }}
            src="/images/logo.png"
            alt="Collect and Cruise"
          />
          <Title>Sign in to your account</Title>
        </FormContainer>

        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign in'}
            </SubmitButton>
          </Form>

          <RedirectText>
            Not a member? <Link to="/signup">Create an account</Link>
          </RedirectText>
        </FormContainer>
      </FormWrapper>
    </>
  );
};

export default Login;