import React, { useState, useEffect } from 'react'
import '../styles/Home.css';

function Home() {
  const [latestItems, setLatestItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/latest_market')
      .then(res => res.json())
      .then(data => setLatestItems(data))
      .catch(err => console.error('Error fetching latest market items:', err));
  }, []);

  return (
    <>
      <header className="header">
        <img src="/images/banner.jpeg" alt="Funko Pops Banner" className="banner" />
      </header>

      <main>
        <section className="news-section">
          <div className="box">New Releases</div>
          <div className="box">News</div>
        </section>

        <section className="latest-section">
          <h2>Latest in Pop-Market</h2>
          <div id="latest-market-container">
            {latestItems.map((item, idx) => (
              <div className="market-item" key={item.id ?? idx}>
                <img
                  src={item.picture}
                  alt={item.pop_name}
                  className="pop-image"
                />
                <h3>{item.pop_name}</h3>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ad-section">
          Advertisement
        </section>
      </main>
    </>
  );
}

export default Home;
