import React from 'react';
import { Link } from 'react-router-dom'; //React Router
import '../styles/Common.css'; // make sure to create this CSS file

function Navbar() {
  return (
    // <h1>NAVBAR</h1>
    <header className = "navbar">
      <img src='./images/popmarketlogo.png' alt="Pop-Market Logo" className="logo" />
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/market">Market</Link></li>
        <li><Link to="/catalog">Catalog</Link></li>
        <li><Link to="/collection">My Collection</Link></li>
        <li><Link to="/wishlist">Wish List</Link></li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login"><button className="login">Log In</button></Link>
        <Link to ="/"><button className="logout">Log Out</button></Link>
      </div>
    </header>
  );
};

export default Navbar;
