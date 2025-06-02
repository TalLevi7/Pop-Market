// src/pages/Wishlist.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Wishlist.css';

export default function Wishlist() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSub, setFilterSub]           = useState('');
  const [collectionIds, setCollectionIds]   = useState([]);       // will hold pop_id numbers already in the user’s collection
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch the user's wishlist
  useEffect(() => {
    const token = localStorage.getItem('token');
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
  }, [API_URL]);

    // Load user’s collectionIds (pop_id) on mount (requires auth)
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch(`${API_URL}/api/collection`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(r => {
          if (!r.ok) throw new Error('Failed to load collection');
          return r.json();
        })
        .then(items => {
          // items: [ { collection_id, acquired_date, pop_id, pop_name, … }, … ]
          const popIds = items.map(item => item.pop_id);
          setCollectionIds(popIds);
        })
        .catch(console.error);
    }, [API_URL]);

  // Adds item from wishlist to collection
const handleAddToCollection = async (popId, popName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(`Login required to add ${popName}`);
      return navigate('/login');
    }

    // Prevent duplicates
    if (collectionIds.includes(popId)) {
      alert(`${popName} is already in your collection`);
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

    if (res.ok) {
      // Update local state so duplicates are blocked next time
      setCollectionIds(prev => [...prev, popId]);
      alert(`${popName} has been added to your collection`);
      // items added to collection from wishlist, are deleted from wishlist
      handleRemove(popId,popName,1);
    } else {
      console.error('Failed to add item');
      let errText = 'Failed to add to collection';
      try {
        const errJson = await res.json();
        errText = errJson.error || errText;
      } catch {
        /* ignore parsing failure */
      }
      alert(errText);
    }
  };


  // Remove from wishlist
const handleRemove = async (popId, popName, tocollection = 0) => {
  const token   = localStorage.getItem('token');
  if (!token) {
    alert(`Login required to remove ${popName}`);
    return;
  }  

  // call DELETE
  const res = await fetch(`${API_URL}/api/wishlist/${popId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    // remove it from local state
    setItems(prev => prev.filter(i => i.pop_id !== popId));
    if (tocollection == 0) {
      alert(`${popName} has been deleted from your wishlist`);
    }
  } else {
    console.error('Failed to remove item');
  }
};

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
              <div key={item.wish_id} className="pop-card">
                <img src={item.picture} alt={item.pop_name} />
                <h3>{item.pop_name}</h3>
                <h4>{item.serial_number}</h4>
                <p>{item.category} – {item.sub_category}</p>
                <small>
                  Added to wishlist: {new Date(item.added_date).toLocaleDateString()}
                </small>
                <div className="card-actions">
                  <button
                    className="wishlisttocollection-button"
                    onClick={() => handleAddToCollection(item.pop_id, item.pop_name)}
                  >
                    Add to collection
                  </button>
                  <button
                    className="removefromwishlist-button"
                    onClick={() => handleRemove(item.pop_id, item.pop_name)}
                  >
                    Remove this item
                  </button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
