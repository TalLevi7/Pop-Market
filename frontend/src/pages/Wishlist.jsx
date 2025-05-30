// src/pages/wishlist.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Wishlist.css';

export default function Wishlist() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSub, setFilterSub]           = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch the user's wishlist
  useEffect(() => {
    const token   = localStorage.getItem('token');
    fetch(`${API_URL}/api/wishlist`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to load wishlist');
        }
        return res.json();
      })
      .then(data => setItems(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // adds item from wishlist to collection    
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


  // const handleRemove = async id => {
  //   const token   = localStorage.getItem('token');
  //   const res = await fetch(`${API_URL}/api/collection/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   if (res.ok) {
  //     setItems(prev => prev.filter(i => i.collection_id !== id));
  //   } else {
  //     console.error('Failed to remove item');
  //   }
  // };

  const categories    = [...new Set(items.map(i => i.category))];
  const subCategories = [...new Set(items.map(i => i.sub_category))];

  const filtered = items
    .filter(i => i.pop_name.toLowerCase().includes(search.toLowerCase()))
    .filter(i => !filterCategory || i.category === filterCategory)
    .filter(i => !filterSub      || i.sub_category === filterSub);

  if (loading) return <div className="wishlist"><p>Loading your wishlist…</p></div>;
  if (error)   return <div className="wishlist error"><p>{error}</p></div>;

  return (
    <div className="wishlist">
      <h1>Your WishList</h1>

      <div className="catalog-filters">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterSub} onChange={e => setFilterSub(e.target.value)}>
          <option value="">All Sub-Categories</option>
          {subCategories.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <p className="empty">No items match your filters.</p>
        : <div className="catalog-grid">
            {filtered.map(item => (
              <div key={item.collection_id} className="pop-card">
                <img src={item.picture} alt={item.pop_name} />
                <h3>{item.pop_name}</h3>
                <p>{item.category} – {item.sub_category}</p>
                <small>
                  Acquired: {new Date(item.acquired_date).toLocaleDateString()}
                </small>
                <div className="card-actions">
                  <button
                    className="wishlisttocollection-button"
                    onClick={() => handleAddToCollection(id, pop.pop_name)}
                  >
                    Add to collection
                  </button>
                  <button
                    className="removefromwishlist-button"
                    onClick={() => handleRemove(item.collection_id)}
                  >
                    Remove from wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
