// frontend/src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  element: React.ReactElement;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ element, adminOnly = false }: Props) => {
  const { userInfo } = useAuth();
  if (!userInfo) {
    // not logged in
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !userInfo.isAdmin) {
    // logged in but not admin
    return <Navigate to="/" replace />;
  }
  return element;
};

export default ProtectedRoute;
