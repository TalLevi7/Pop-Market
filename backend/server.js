// pop-market/backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');           // now returns a promise-based pool
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Root Route (for testing)
app.get('/', (req, res) => {
  res.send('Pop Market API is running!');
});

// API Route to Fetch Catalog Data
app.get('/api/catalog', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pop_catalog');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching catalog:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Fetch 3 latest in market
app.get('/api/latest_market', async (req, res) => {
  const sql = `
    SELECT m.*, p.pop_name, p.picture
    FROM market m
    JOIN pop_catalog p ON m.pop_id = p.pop_id
    WHERE m.status = 'active'
    ORDER BY m.market_id DESC
    LIMIT 3
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});