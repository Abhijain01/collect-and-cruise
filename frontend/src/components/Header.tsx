import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ShoppingCart, UploadCloud, Heart, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ThemeToggle from "./ThemeToggle";
import { Search } from "./Search";
import { useState } from "react";

// ================== STYLED COMPONENTS ==================

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 1rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text);
  text-transform: uppercase;
`;

const Nav = styled.nav<{ $isOpen?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 4rem;
    left: 0;
    width: 100%;
    background: var(--color-background-secondary);
    flex-direction: column;
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border);
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
  }
`;

const NavLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
  &:hover {
    color: var(--color-text);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartIconWrapper = styled(Link)`
  position: relative;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  &:hover {
    color: var(--color-primary);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WishlistIconWrapper = styled(Link)`
  position: relative;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  &:hover {
    color: var(--color-primary);
  }
`;

const WishlistBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-weight: 500;
  &:hover {
    color: var(--color-primary);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
  }
`;

// ================== MAIN COMPONENT ==================

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistItemCount = wishlistItems.length;

  return (
    <HeaderWrapper>
      <Container>
        {/* ---------- LOGO ---------- */}
        <LogoLink to="/">
          <img
            src="/images/logo.png"
            alt="Collect & Cruise"
            style={{ height: "36px", width: "auto" }}
          />
          <span>Collect & Cruise</span>
        </LogoLink>

        {/* ---------- NAV LINKS ---------- */}
        <Nav $isOpen={menuOpen}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          {userInfo?.isAdmin && (
            <>
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <NavLink to="/admin/upload">Upload</NavLink>
              <NavLink to="/admin/orders">Orders</NavLink>
              <NavLink to="/admin/users">Users</NavLink>
            </>
          )}
        </Nav>

        {/* ---------- SEARCH ---------- */}
        <div style={{ flexGrow: 1, maxWidth: "400px", margin: "0 1rem" }}>
          <Search />
        </div>

        {/* ---------- RIGHT SIDE ICONS ---------- */}
        <IconWrapper>
          {userInfo && (
            <WishlistIconWrapper to="/wishlist">
              <Heart size={20} />
              {wishlistItemCount > 0 && (
                <WishlistBadge>{wishlistItemCount}</WishlistBadge>
              )}
            </WishlistIconWrapper>
          )}

          <CartIconWrapper to="/cart">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
          </CartIconWrapper>

          <ThemeToggle />

          {userInfo ? (
            <>
              <LogoutButton onClick={logoutHandler}>Logout</LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}

          {/* ---------- MOBILE MENU BUTTON ---------- */}
          <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={22} />
          </MobileMenuButton>
        </IconWrapper>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
