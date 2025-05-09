import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/Layout';
import './styles/index.css';

// Pages
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import Collection from "./pages/Collection";
import ContactUs from "./pages/ContactUs";
import Home from "./pages/Home"; // formerly index.html
import Login from "./pages/Login";
import Market from "./pages/Market";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";

// Import AuthContext
import { AuthContext } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useContext(AuthContext); // Get authentication status from context

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="market" element={<Market />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="about" element={<About />} />

        {/* Protect routes with conditional rendering */}
        <Route 
          path="collection" 
          element={isAuthenticated ? <Collection /> : <Navigate to="/login" />} 
        />
        <Route 
          path="wishlist" 
          element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} 
        />

        <Route path="contactus" element={<ContactUs />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
