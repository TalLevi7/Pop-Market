import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext); // Get authentication status from context

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return element; // Allow access to the element if authenticated
};

export default PrivateRoute;
