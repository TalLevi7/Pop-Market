import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // For redirection
import '../styles/Collection.css';

function Collection() {
  const [collectionData, setCollectionData] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch collection data for the logged-in user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if no token is found
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/api/collection`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Sending the token as Authorization header
        },
      })
        .then(res => res.json())
        .then(data => {
          // If the response has an error field, set it to display
          if (data.error) {
            setError(data.error);
          } else {
            // If the collection is empty, we don't want to show the error message
            if (Array.isArray(data) && data.length === 0) {
              setCollectionData([]);
            } else {
              setCollectionData(data); // Set collection data if successful
            }
          }
        })
        .catch(err => {
          console.error('Error fetching collection:', err);
          setError('Failed to load collection. Please try again.');  // Show generic error if fetch fails
        });
    }
  }, [navigate]);

  return (
    <div className="collection-page">
      <h1>Your Collection</h1>

      {error && <p className="error">{error}</p>} {/* Display error if any */}

      {collectionData.length === 0 ? (
        <p>Your collection is empty. Add some Funko Pops!</p>
      ) : (
        <div className="collection-grid">
          {collectionData.map(item => (
            <div className="pop-card" key={item.collection_id}>
              <img src={item.picture} alt={item.pop_name} />
              <h3>{item.pop_name}</h3>
              <p><strong>Acquired:</strong> {new Date(item.acquired_date).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;
