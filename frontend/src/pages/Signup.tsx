import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { register } from '../services/api';

// Re-using styles from Login for consistency
const FormWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 1.5rem;
  background-color: var(--color-background);
`;

const FormContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 24rem;
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

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      const { data } = await register(email, password);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Helmet><title>Create Account | Collect and Cruise</title></Helmet>
      <FormWrapper>
        <FormContainer>
          <img
            style={{ margin: '0 auto', height: '48px', width: 'auto' }}
            src="/images/logo.png"
            alt="Collect and Cruise"
          />
          <Title>Create your new account</Title>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
             <InputGroup>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <SubmitButton type="submit">Create Account</SubmitButton>
          </Form>

          <RedirectText>
            Already a member? <Link to="/login">Sign in</Link>
          </RedirectText>
        </FormContainer>
      </FormWrapper>
    </>
  );
};

export default Signup;