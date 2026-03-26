import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, isAuthChecked } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, role, isAuthChecked } = useSelector((s) => s.auth);

  // Still checking auth
  if (!isAuthChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && role) {
    return <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};
