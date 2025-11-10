// --- FIX 1: 'port' is now 'import' ---
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// We are no longer importing brand icons from lucide-react

// --- (All styled-components are the same) ---
const FooterWrapper = styled.footer`
  background-color: #111827;
  color: #d1d5db;
`;
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
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
  font-weight: 600;
  text-transform: uppercase;
  color: #ffffff;
`;
const LinkList = styled.ul`
  margin-top: 1rem;
  list-style: none;
  padding-left: 0;
  
  & > li {
    margin-top: 0.5rem;
  }
`;
const FooterLink = styled(Link)`
  transition: color 0.2s;
  &:hover {
    color: #ffffff;
  }
`;
const SocialWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 1rem;
  
  a {
    color: #d1d5db;
    transition: color 0.2s;
    &:hover {
      color: #ffffff;
    }
  }
  
  /* Style for our new inline SVGs */
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;
const BottomBar = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #374151;
  padding-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
`;
// --- (End of styled-components) ---


const Footer = () => {
  return (
    <FooterWrapper>
      <Container>
        <Grid>
          {/* Shop */}
          <div>
            <ColumnHeader>Shop</ColumnHeader>
            <LinkList>
              <li><FooterLink to="/shop">All Products</FooterLink></li>
              <li><FooterLink to="/shop?category=Premium">Premium</FooterLink></li>
              <li><FooterLink to="/shop?category=Mainline">Mainline</FooterLink></li>
            </LinkList>
          </div>
          {/* Company */}
          <div>
            <ColumnHeader>Company</ColumnHeader>
            <LinkList>
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/contact">Contact</FooterLink></li>
            </LinkList>
          </div>
          {/* Support */}
          <div>
            <ColumnHeader>Support</ColumnHeader>
            <LinkList>
              <li><FooterLink to="/faq">FAQ</FooterLink></li>
              <li><FooterLink to="/shipping">Shipping & Returns</FooterLink></li>
            </LinkList>
          </div>
          
          {/* --- FIX 2: Using <a> tags and SVGs --- */}
          <div>
            <ColumnHeader>Follow Us</ColumnHeader>
            <SocialWrapper>
              <a 
                href="https://www.facebook.com/share/17y7cr6m1P/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
              >
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a 
                href="https://www.instagram.com/collectncruise__?igsh=OTJxOXg2OGcwYm42" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.314.935 20.644.523 19.854.217c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.056 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.381-.42.419-.819-.679-1.381-.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.074c-1.17-.056-1.805-.249-2.227-.413-.562-.217-.96-.477-1.381-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.074-4.85c.056-1.17.249-1.805.413-2.227.217-.562.477.96.896-1.381.42-.419.819-.679 1.381-.896.422-.164 1.057.36 2.227.413C8.415 2.172 8.797 2.16 12 2.16zm0 2.91c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162S15.403 5.07 12 5.07zm0 10.164c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zm-1.653 19.23h2.61L6.876 3.028H4.068l13.18 17.354z"/></svg>
              </a>
            </SocialWrapper>
          </div>
          {/* --------------------------------------- */}
          
        </Grid>
        <BottomBar>
          <p>&copy; {new Date().getFullYear()} Collect & Cruise. All rights reserved.</p>
        </BottomBar>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;