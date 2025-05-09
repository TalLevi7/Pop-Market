import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Protected Route Component for React Router v6
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Check if the user is authenticated

  return (
    <Route
      {...rest}
      element={
        token ? (
          <Component /> // If the user is authenticated, render the protected component
        ) : (
          <Navigate to="/login" /> // If not authenticated, redirect to login
        )
      }
    />
  );
};

export default PrivateRoute;
