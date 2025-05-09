import React from "react";
import { Routes, Route } from "react-router-dom";
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

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    // <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="market" element={<Market />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="about" element={<About />} />
        <Route path="collection" element={<Collection />} />
        <Route path="contactus" element={<ContactUs />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>
    </Routes>

  );
}

export default App;
