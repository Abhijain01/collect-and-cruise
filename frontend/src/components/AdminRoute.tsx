import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
//
// --- THIS IS THE FIX ---
// We add the 'type' keyword because RootState is just a description, not real code.
import type { RootState } from '../store';

const AdminRoute = () => {
  // Get the user's info from your Redux state
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Check if user is logged in AND is an admin
  if (userInfo && userInfo.isAdmin) {
    return <Outlet />; // <-- Show the admin page
  } else {
    // 3. If not, redirect to the login page
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;