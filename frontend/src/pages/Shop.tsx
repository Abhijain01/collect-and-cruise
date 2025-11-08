import { useState, useEffect } from "react";
import styled from "styled-components";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1rem;
  display: flex;
  gap: 2rem;
`;

const Sidebar = styled.aside`
  width: 250px;
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const ProductGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await getProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container>
      <Sidebar>
        <h3>Filters</h3>
        <p>Category</p>
        <ul>
          <li>Mainline</li>
          <li>Premium</li>
          <li>Super Treasure Hunt</li>
        </ul>
      </Sidebar>

      <div style={{ flex: 1 }}>
        <h1>🛍️ Shop All Models</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ProductGrid>
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </ProductGrid>
        )}
      </div>
    </Container>
  );
};

export default Shop;
