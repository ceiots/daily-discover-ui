import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * A route guard component that checks for user authentication.
 * If the user is not authenticated, it redirects them to the login page,
 * preserving the page they intended to visit.
 * This version is updated to use the Redux-based useAuth hook.
 * @param {{ children: JSX.Element }} props
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // We wait for the isLoading check to complete to avoid flashes of content.
  // This is important when first loading the app and checking for a stored token.
  if (isLoading) {
    // You can replace this with a proper loading spinner component
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after a
    // successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 