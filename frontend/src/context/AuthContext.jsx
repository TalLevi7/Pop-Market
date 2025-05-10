import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for the token on initial load (page refresh)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // If a token exists, set the user as authenticated
    } else {
      setIsAuthenticated(false); // Otherwise, the user is not authenticated
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token); // Store token in localStorage
    setIsAuthenticated(true); // Set the user as authenticated
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsAuthenticated(false); // Set the user as not authenticated
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
