// frontend/src/components/Footer.tsx

import { Link } from "react-router-dom";
import styled from "styled-components";
import { Facebook, Instagram, Twitter } from "lucide-react";

// ===== STYLED COMPONENTS =====

const FooterWrapper = styled.footer`
  background-color: var(--color-dark-surface);
  color: var(--color-text-light, #f3f4f6);
  padding-top: 3rem;
  padding-bottom: 1rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ColumnHeader = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #d1d5db;
  font-size: 0.9rem;
  margin-bottom: 0.6rem;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    transform: translateX(2px);
  }
`;

const SocialWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;

  a {
    color: #9ca3af;
    transition: all 0.3s ease;
    &:hover {
      color: white;
      transform: scale(1.15);
    }
  }
`;

const BottomBar = styled.div`
  margin-top: 3rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
`;

// ===== FOOTER COMPONENT =====

const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <Grid>
          {/* SHOP COLUMN */}
          <div>
            <ColumnHeader>Shop</ColumnHeader>
            <LinkList>
              <li>
                <FooterLink to="/shop">All Products</FooterLink>
              </li>
              <li>
                <FooterLink to="/shop?category=premium">Premium</FooterLink>
              </li>
              <li>
                <FooterLink to="/shop?category=mainline">Mainline</FooterLink>
              </li>
            </LinkList>
          </div>

          {/* COMPANY COLUMN */}
          <div>
            <ColumnHeader>Company</ColumnHeader>
            <LinkList>
              <li>
                <FooterLink to="/about">About Us</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contact</FooterLink>
              </li>
              <li>
                <FooterLink to="/careers">Careers</FooterLink>
              </li>
            </LinkList>
          </div>

          {/* SUPPORT COLUMN */}
          <div>
            <ColumnHeader>Support</ColumnHeader>
            <LinkList>
              <li>
                <FooterLink to="/faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink to="/shipping">Shipping & Returns</FooterLink>
              </li>
              <li>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </li>
            </LinkList>
          </div>

          {/* SOCIAL COLUMN */}
          <div>
            <ColumnHeader>Follow Us</ColumnHeader>
            <SocialWrapper>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={22} />
              </a>
            </SocialWrapper>
          </div>
        </Grid>

        {/* COPYRIGHT BAR */}
        <BottomBar>
          <p>
            © {new Date().getFullYear()} <strong>Collect & Cruise</strong>. All
            rights reserved.
          </p>
        </BottomBar>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
