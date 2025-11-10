import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { uploadProduct } from '../services/api';
import { UserInfo } from '../types';

const FormWrapper = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background-color: var(--color-background);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
`;

const Form = styled.form`
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InputGroup = styled.div`
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }
  input, select, textarea {
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
  textarea {
    min-height: 120px;
  }
  input[type="file"] {
    padding: 0.4rem;
    background-color: var(--color-background-secondary);
  }
`;

const FullWidthInput = styled(InputGroup)`
  @media (min-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
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
  &:disabled {
    background-color: var(--color-text-secondary);
    cursor: not-allowed;
  }
`;

// Use our new semantic theme colors
const Message = styled.p<{ $error?: boolean }>`
  text-align: center;
  font-size: 0.875rem;
  padding: 1rem;
  border-radius: 0.375rem;
  color: ${props => props.$error ? 'var(--color-error)' : 'var(--color-success)'};
  background-color: ${props => props.$error ? 'var(--color-error-bg)' : 'var(--color-success-bg)'};
  grid-column: 1 / -1;
`;

const AdminUpload = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Mainline' | 'Premium' | 'Exclusive' | 'Other'>('Mainline');
  const [price, setPrice] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo: UserInfo = JSON.parse(userInfoString);
      if (!userInfo.isAdmin) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', String(price));
    formData.append('stockQuantity', String(stockQuantity));
    formData.append('image', image);

    try {
      await uploadProduct(formData);
      setMessage('Product uploaded successfully!');
      setName('');
      setDescription('');
      setCategory('Mainline');
      setPrice(0);
      setStockQuantity(1);
      setImage(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin: Upload Product | Collect and Cruise</title></Helmet>
      <FormWrapper>
        <Title>Upload New Product</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="name">Product Name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option value="Mainline">Mainline</option>
              <option value="Premium">Premium</option>
              <option value="Exclusive">Exclusive</option>
              <option value="Other">Other</option>
            </select>
          </InputGroup>

          <InputGroup>
            <label htmlFor="price">Price (₹)</label>
            <input id="price" type="number" min="0" required value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </InputGroup>

          <InputGroup>
            <label htmlFor="stock">Stock Quantity</label>
            <input id="stock" type="number" min="0" required value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} />
          </InputGroup>
          
          <FullWidthInput>
            <label htmlFor="description">Description</label>
            <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </FullWidthInput>

          <FullWidthInput>
            <label htmlFor="image">Product Image</label>
            <input id="image" type="file" accept="image/*" required onChange={handleFileChange} />
          </FullWidthInput>

          {error && <Message $error>{error}</Message>}
          {message && <Message>{message}</Message>}

          <FullWidthInput>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Product'}
            </SubmitButton>
          </FullWidthInput>
        </Form>
      </FormWrapper>
    </>
  );
};

export default AdminUpload;