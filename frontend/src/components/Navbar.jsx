import React, { useState, useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; // React Router
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import '../styles/Common.css'; // make sure to create this CSS file

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext); // Get isAuthenticated from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Logout function from AuthContext
    alert('Logged out successfully!'); // Show logout success alert
    navigate('/'); // Redirect to Home page after logout, no matter where the user is
  };

  const handleRestrictedPageAccess = (page) => {
    if (!isAuthenticated) {
      alert(`Access to the ${page} page requires you to log in.`);
      navigate('/login'); // Redirect to login page if the user isn't authenticated
    }
  };

  return (
    <header className="navbar">
      <img src="./images/popmarketlogo.png" alt="Pop-Market Logo" className="logo" />
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/market">Market</Link>
        </li>
        <li>
          <Link to="/catalog">Catalog</Link>
        </li>

        {/* Always show the links, but restrict access if not authenticated */}
        <li onClick={() => handleRestrictedPageAccess('Collection')}>
          <Link to="/collection">My Collection</Link>
        </li>
        <li onClick={() => handleRestrictedPageAccess('Wishlist')}>
          <Link to="/wishlist">Wish List</Link>
        </li>
      </ul>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <button className="logout" onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <Link to="/login">
            <button className="login">Log In</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
