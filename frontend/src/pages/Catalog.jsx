// src/pages/Catalog.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../styles/Catalog.css';

function Catalog() {
  const [catalogData, setCatalogData]   = useState([]);
  const [wishlist, setWishlist]         = useState([]);
  const [searchText, setSearchText]     = useState('');
  const [categoryFilter, setCategoryFilter]     = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Load catalog
  useEffect(() => {
    fetch(`${API_URL}/api/catalog`)
      .then(r => r.json())
      .then(data => setCatalogData(data))
      .catch(console.error);
  }, []);

  // // 2. Load wishlist on mount (requires auth)
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return; // no user
  //   fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //     .then(r => {
  //       if (!r.ok) throw new Error('Failed to load wishlist');
  //       return r.json();
  //     })
  //     .then(popIds => setWishlist(popIds))
  //     .catch(console.error);
  // }, []);

  // 3. Filters
  const categories = useMemo(
    () => Array.from(new Set(catalogData.map(p => p.category))),
    [catalogData]
  );
  const subCategories = useMemo(
    () => Array.from(new Set(catalogData.map(p => p.sub_category))),
    [catalogData]
  );
  const filtered = useMemo(
    () => catalogData.filter(p => {
      return (
        p.pop_name.toLowerCase().includes(searchText.toLowerCase()) &&
        (!categoryFilter || p.category === categoryFilter) &&
        (!subCategoryFilter || p.sub_category === subCategoryFilter)
      );
    }),
    [catalogData, searchText, categoryFilter, subCategoryFilter]
  );

  // 4. Toggle wishlist item
  // const toggleWishlist = async popId => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     alert('You must be logged in to save favorites');
  //     return navigate('/login');
  //   }

  //   const inList = wishlist.includes(popId);
  //   const url    = `${import.meta.env.VITE_API_URL}/api/wishlist${inList ? '/' + popId : ''}`;
  //   const method = inList ? 'DELETE' : 'POST';
  //   const opts   = {
  //     method,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`
  //     },
  //     ...(method === 'POST' && { body: JSON.stringify({ pop_id: popId }) })
  //   };

  //   const res = await fetch(url, opts);
  //   if (!res.ok) {
  //     const err = await res.json().catch(() => ({}));
  //     return alert(err.error || 'Wishlist update failed');
  //   }

  //   setWishlist(w =>
  //     inList ? w.filter(id => id !== popId) : [...w, popId]
  //   );
  // };

  // 5. Add to collection stub
    const handleAddToCollection = async (popId, popName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(`Login required to add ${popName}`);
      navigate('/login');
      return;
    }
    const res = await fetch(`${API_URL}/api/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ pop_id: popId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Failed to add to collection');
    } else {
      alert(`${popName} added to collection`);
    }
  };
  

  return (
    <>
      <main>
        <h1>Funko Pop Catalog</h1>

        <div className="catalog-filters">
          <input
            type="text"
            placeholder="Search Funko Pops..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={subCategoryFilter} onChange={e => setSubCategoryFilter(e.target.value)}>
            <option value="">All Sub-Categories</option>
            {subCategories.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="catalog-grid">
          {filtered.map(pop => {
            const id    = pop.pop_id || pop.id;
            const isFav = wishlist.includes(id);
            return (
              <div className="pop-card" key={id}>
                {/* Heart icon */}
                <div
                  className={`wishlist-icon${isFav ? ' filled' : ''}`}
                  onClick={() => toggleWishlist(id)}
                >
                  {isFav ? <FaHeart /> : <FaRegHeart />}
                </div>

                <img src={pop.picture} alt={pop.pop_name} />
                <h3>{pop.pop_name}</h3>
                <h4>{pop.serial_number}</h4>
                <p><strong>Category:</strong> {pop.category}</p>
                <p><strong>Sub-Category:</strong> {pop.sub_category}</p>

                <div className="card-actions">
                  <button
                    className="addtocollection-button"
                    onClick={() => handleAddToCollection(id, pop.pop_name)}
                  >
                    Add to collection
                  </button>
                  <button className="sellonmarket-button">
                    Sell on market
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

export default Catalog;
