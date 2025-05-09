import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if there's a token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set authentication status based on token presence
  }, []);

  // Login function to set the token and authentication state
  const login = (token) => {
    localStorage.setItem('token', token); // Store the token in localStorage
    setIsAuthenticated(true); // Set isAuthenticated to true
  };

  // Logout function to remove the token and update the state
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsAuthenticated(false); // Set isAuthenticated to false
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}  {/* Render the children of the AuthProvider */}
    </AuthContext.Provider>
  );
};
