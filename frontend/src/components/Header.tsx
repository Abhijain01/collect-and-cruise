import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchComponent from './Search'; // Import Search

// --- STYLED COMPONENTS (Full, Unabbreviated Code) ---

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  
  [data-theme='dark'] & {
    background-color: rgba(17, 24, 39, 0.9); /* Dark bg */
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  height: 4.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  flex-shrink: 0; /* Prevents logo from shrinking */
`;

// This is the navigation for Desktop
const DesktopNav = styled.nav<{ $isHidden?: boolean }>`
  display: ${props => props.$isHidden ? 'none' : 'none'}; // Still hidden on mobile
  @media (min-width: 768px) {
    display: ${props => props.$isHidden ? 'none' : 'flex'}; // Toggle on desktop
    align-items: center;
    gap: 2rem;
  }
`;

// NEW: A wrapper for the search bar on desktop
const SearchWrapper = styled.div<{ $isOpen?: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-grow: 1;
  margin: 0 2rem;
  
  @media (max-width: 767px) {
    display: none; // Handled by mobile menu
  }
`;

const NavLink = styled(Link)`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 0.2s;
  padding: 0.5rem 0;
  white-space: nowrap; /* Prevents wrapping */

  &:hover {
    color: var(--color-text);
  }
`;

// This holds all icons on the right side for Desktop
const RightIconWrapper = styled.div`
  display: none; // Hidden on mobile
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const IconButton = styled.button`
  position: relative; /* For the badge */
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0.5rem;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-text);
    background-color: var(--color-background-secondary);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// The "Hamburger" button
const MobileMenuButton = styled(IconButton)`
  display: block; // Shown on mobile
  @media (min-width: 768px) {
    display: none; // Hidden on desktop
  }
`;

// The fullscreen overlay
const MobileNavOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  z-index: 100;
  padding: 1.5rem;
  
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

// Header for the mobile menu (logo + close button)
const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem;
  border-bottom: 1px solid var(--color-border);
  margin: -1.5rem -1.5rem 0; /* Fill space */
  padding: 0 1.5rem;
`;

// Wrapper for the mobile links
const MobileNavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 2rem;
`;

// Individual mobile link
const MobileNavLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  
  &:hover {
    color: var(--color-primary);
  }
`;

// Wrapper for icons in the mobile menu
const MobileIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
`;

// --- COMPONENT ---

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  
  const cartItemCount = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistItemCount = wishlist.wishlistItems.length;

  // Effect to close mobile menu and search on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const logoutHandler = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  // Helper function to render ONLY Login/Signup/Logout
  const renderAuthLinks = (isMobile = false) => {
    const NavComponent = isMobile ? MobileNavLink : NavLink;
    
    return userInfo ? (
      <IconButton as="button" onClick={logoutHandler} style={{ fontSize: isMobile ? '1.25rem' : '1rem' }}>
        Logout
      </IconButton>
    ) : (
      <>
        <NavComponent to="/login">Login</NavComponent>
        <NavComponent to="/signup">Signup</NavComponent>
      </>
    );
  };

  // Helper function to render icons (to avoid repetition)
  const renderIcons = (isMobile = false) => (
    <>
      <ThemeToggle />
      
      {/* Show search icon only on desktop (it's built-in on mobile menu) */}
      {!isMobile && (
        <IconButton onClick={toggleSearch} aria-label="Open search">
          <Search size={20} />
        </IconButton>
      )}
      
      {userInfo && (
        <IconButton as={Link} to="/wishlist">
          <Heart size={20} />
          {wishlistItemCount > 0 && (
            <CartBadge>{wishlistItemCount}</CartBadge>
          )}
        </IconButton>
      )}
      
      <IconButton as={Link} to="/cart">
        <ShoppingCart size={20} />
        {cartItemCount > 0 && (
          <CartBadge>{cartItemCount}</CartBadge>
        )}
      </IconButton>
    </>
  );

  return (
    <>
      <HeaderWrapper>
        <Container>
          <LogoLink to="/">
            <img src="/images/logo.png" alt="Collect and Cruise Logo" style={{ height: '40px', width: 'auto' }} />
            <span>Collect & Cruise</span>
          </LogoLink>

          {/* --- Desktop Navigation --- */}
          <DesktopNav $isHidden={isSearchOpen}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            {userInfo && userInfo.isAdmin && (
              <NavLink to="/admin/upload">Admin Upload</NavLink>
            )}
          </DesktopNav>

          {/* This search bar replaces the nav */}
          <SearchWrapper $isOpen={isSearchOpen}>
            <SearchComponent onClose={toggleSearch} />
          </SearchWrapper>

          {/* --- Desktop Icons --- */}
          <RightIconWrapper>
            {renderIcons(false)}
            {/* Show auth links only if search is closed */}
            {!isSearchOpen && renderAuthLinks(false)}
          </RightIconWrapper>

          {/* --- Mobile Menu Button --- */}
          <MobileMenuButton onClick={toggleMobileMenu}>
            <Menu size={24} />
          </MobileMenuButton>
        </Container>
      </HeaderWrapper>

      {/* --- Mobile Menu Overlay --- */}
      <MobileNavOverlay $isOpen={isMobileMenuOpen}>
        <MobileNavHeader>
          <LogoLink to="/">
            <span>Collect & Cruise</span>
          </LogoLink>
          <MobileMenuButton onClick={toggleMobileMenu}>
            <X size={24} />
          </MobileMenuButton>
        </MobileNavHeader>

        {/* Add SearchComponent to Mobile Menu */}
        <div style={{ marginTop: '1.5rem' }}>
           <SearchComponent onClose={toggleMobileMenu} />
        </div>
        
        <MobileNavLinks>
          <MobileNavLink to="/">Home</MobileNavLink>
          <MobileNavLink to="/shop">Shop</MobileNavLink>
          {userInfo && userInfo.isAdmin && (
            <MobileNavLink to="/admin/upload">Admin Upload</MobileNavLink>
          )}
          {renderAuthLinks(true)}
        </MobileNavLinks>
        
        <MobileIconWrapper>
          {renderIcons()}
        </MobileIconWrapper>
      </MobileNavOverlay>
    </>
  );
};

export default Header;