import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Catalog.css';

function Catalog() {
  const [catalogData, setCatalogData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const navigate = useNavigate();  // Initialize navigate for redirection

  // Fetch catalog on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/catalog`)
      .then(res => res.json())
      .then(data => setCatalogData(data))
      .catch(err => console.error('Error fetching catalog:', err));
  }, []);

  // Unique filter options
  const categories = useMemo(() => {
    const setCat = new Set(catalogData.map(pop => pop.category));
    return Array.from(setCat);
  }, [catalogData]);

  const subCategories = useMemo(() => {
    const setSub = new Set(catalogData.map(pop => pop.sub_category));
    return Array.from(setSub);
  }, [catalogData]);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    return catalogData.filter(pop => {
      const matchesSearch = pop.pop_name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !categoryFilter || pop.category === categoryFilter;
      const matchesSub = !subCategoryFilter || pop.sub_category === subCategoryFilter;
      return matchesSearch && matchesCategory && matchesSub;
    });
  }, [catalogData, searchText, categoryFilter, subCategoryFilter]);

  const handleAddToCollection = (popName) => {
    if (!localStorage.getItem('token')) {
      alert(`You must be logged in to add ${popName} to your collection.`);
      navigate('/login');  // Redirect to login page if not authenticated
    } else {
      alert(`${popName} has been added to your collection.`);
      // Add the functionality to add the pop to the collection here
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

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={subCategoryFilter}
            onChange={e => setSubCategoryFilter(e.target.value)}
          >
            <option value="">All Sub-Categories</option>
            {subCategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="catalog-grid" id="catalog-container">
          {filteredCatalog.map(pop => (
            <div className="pop-card" key={pop.pop_id || pop.id}>
              <img src={pop.picture} alt={pop.pop_name} />
              <h3>{pop.pop_name}</h3>
              <h4>{pop.serial_number}</h4>
              <p><strong>Category:</strong> {pop.category}</p>
              <p><strong>Sub-Category:</strong> {pop.sub_category}</p>
              <div className="card-actions">
                {/* Add to collection button */}
                <button className = "addtocollection-button" onClick={() => handleAddToCollection(pop.pop_name)}>
                  Add to collection
                </button>
                <a href="/market">Sell on market</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Catalog;
