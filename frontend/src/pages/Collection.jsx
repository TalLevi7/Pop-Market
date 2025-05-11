// src/pages/Collection.jsx
import React, { useEffect, useState } from "react";
import "../styles/Collection.css";

export default function Collection() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const token   = localStorage.getItem("token");

    fetch(`${API_URL}/api/collection`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load collection");
        }
        return res.json();
      })
      .then(data => setItems(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="collection">
      <p>Loading your collection…</p>
    </div>
  );
  if (error) return (
    <div className="collection error">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="collection">
      <h2>Your Collection</h2>
      {items.length === 0
        ? <p className="empty">Your collection is empty. Add some Funko Pops!</p>
        : <div className="grid">
            {items.map(item => (
              <div key={item.collection_id} className="card">
                <img src={item.picture} alt={item.pop_name} />
                <div className="info">
                  <h3>{item.pop_name}</h3>
                  <p>{item.category} – {item.sub_category}</p>
                  <small>
                    Acquired:{" "}
                    {new Date(item.acquired_date)
                      .toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
