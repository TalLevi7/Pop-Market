// src/pages/Market.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // React Router
import '../styles/Market.css';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

export default function Market() {

  const API_URL = import.meta.env.VITE_API_URL;

  // Takes a token string, returns { user_id, username, exp, ... } or null.
  const decodeJWTPayload = (token) => {
    try {
      const base64Url = token.split('.')[1]; // second segment = payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json);
    } catch (err) {
      return null;
    }
  };

  // ─── On every render, read token from localStorage ───────────────────
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  let username = null;
  let isAuthenticated = false;

  if (token) {
    const payload = decodeJWTPayload(token);
    if (
      payload &&
      payload.username &&
      typeof payload.exp === 'number'
    ) {
      // Check if token is expired (exp is in seconds)
      const nowSec = Math.floor(Date.now() / 1000);
      if (payload.exp > nowSec) {
        isAuthenticated = true;
        username = payload.username;
      } else {
        // Token expired → remove it
        localStorage.removeItem('token');
      }
    } else {
      // Malformed token → remove it
      localStorage.removeItem('token');
    }
  }

  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Filters:
  const [searchText, setSearchText]   = useState('');
  const [categoryFilter, setCategoryFilter]   = useState('');
  const [locationFilter, setLocationFilter]   = useState('');

  // Order‐by: 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'
  const [orderBy, setOrderBy]         = useState('date_desc');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/market`);
        if (!res.ok) {
          throw new Error(`Failed to load market listings: ${res.statusText}`);
        }
        const data = await res.json();
        setListings(data);
      } catch (e) {
        console.error(e);
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [API_URL]);

  const categories = useMemo(
    () => Array.from(new Set(listings.map(item => item.category))).sort(),
    [listings]
  );
  const locations = useMemo(
    () => Array.from(new Set(listings.map(item => item.location))).sort(),
    [listings]
  );

  // search + filter
  const filtered = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch =
        item.pop_name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.details.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;

      const matchesLocation =
        !locationFilter || item.location === locationFilter;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [listings, searchText, categoryFilter, locationFilter]);

  // Sort according to orderBy
  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (orderBy) {
      case 'date_asc':
        return copy.sort((a, b) =>
          new Date(a.date_uploaded) - new Date(b.date_uploaded)
        );
      case 'date_desc':
        return copy.sort((a, b) =>
          new Date(b.date_uploaded) - new Date(a.date_uploaded)
        );
      case 'price_asc':
        return copy.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price_desc':
        return copy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return copy;
    }
  }, [filtered, orderBy]);

  if (loading) {
    return <div className="market-loading">Loading listings…</div>;
  }

  if (error) {
    return <div className="market-error">Error: {error}</div>;
  }

    const handleRestrictedPageAccess = (page) => {
    if (!isAuthenticated) {
      alert(`Access to the ${page} page requires you to log in.`);
      navigate('/login'); // Redirect to login page if the user isn't authenticated
    }
  };

  return (
    <main className="market-container">
      {/* ─── Top Controls: Search/Filter (left) | Order By + Post-Ad (right) ─── */}
      <div className="market-controls">
        <div className="market-search-filter">
          <input
            type="text"
            className="market-search-input"
            placeholder="Search by name or details…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />

          <select
            className="market-filter-select"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="market-filter-select"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="market-orderpost">
          <div className="market-orderby">
            <label htmlFor="orderBySelect">Order by:</label>
            <select
              id="orderBySelect"
              value={orderBy}
              onChange={e => setOrderBy(e.target.value)}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="price_asc">Price Low → High</option>
              <option value="price_desc">Price High → Low</option>
            </select>
          </div>
        </div>

        <div className = "market-postbutton">
          <Link to="/NewListing">
            <button className="post-ad-button" onClick={() => handleRestrictedPageAccess('NewListing')}>
              + Post an Ad
            </button>
          </Link>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="market-no-results">No listings match your criteria.</div>
      ) : (
        <div className="market-grid">
          {sorted.map(item => (
            <div className="market-card" key={item.market_id}>
              <img
                className="market-card-image"
                src={item.market_picture || '/default-pop.png'}
                alt={item.pop_name}
              />

              <div className="market-card-body">
                <h3 className="pop-name">{item.pop_name}</h3>
                {item.category && (
                  <p className="pop-category">{item.category}</p>
                )}
                <p className="pop-serial">
                  <strong>Serial:</strong> {item.serial_number}
                </p>
                <p className="pop-location">
                  <strong>Location:</strong> {item.location}
                </p>
                <p className="pop-price">₪{parseFloat(item.price).toFixed(2)}</p>
                <p className="pop-date">
                  <strong>Uploaded:</strong>{' '}
                  {new Date(item.date_uploaded).toLocaleDateString('en-IL', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="pop-details">
                  {item.details ? item.details : <em>No extra details</em>}
                </p>
              </div>

              <div className="market-card-footer">
                <p className="seller-info">
                  <strong>Seller:</strong> {item.seller_username}
                </p>
                <p className="seller-contact">
                  <strong>Contact:</strong> {item.seller_email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
