import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// --- THIS IS THE FIX ---
// We have removed the unused 'Loader' import.
// -----------------------

const AdminRoute = () => {
  // Get the user info from your AuthContext
  const { userInfo } = useAuth(); 

  // We are not checking for a loading state,
  // so the Loader component is not needed.

  // 1. Check if user is logged in AND is an admin
  return userInfo && userInfo.isAdmin ? (
    // 2. If YES, show the child page (e.g., UserListScreen)
    <Outlet />
  ) : (
    // 3. If NO, redirect them to the login page
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;