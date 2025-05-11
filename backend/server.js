// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');               // your MySQL connection
const jwt = require('jsonwebtoken');      // for JWT verification
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------
// Authentication Middleware
// ---------------------
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // assuming your tokens were signed with { id: userId }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ---------------------
// Routes
// ---------------------

// Root Route (for testing)
app.get('/', (req, res) => {
  res.send('Pop Market API is running!');
});

// Fetch entire Pop Catalog
app.get('/api/catalog', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pop_catalog');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching catalog:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Fetch 3 latest active items in Market
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
    console.error('Error fetching latest market items:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Protected: Fetch the logged-in user's personal collection
app.get('/api/collection', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT 
         pc.collection_id,
         pc.acquired_date,
         p.pop_id,
         p.pop_name,
         p.category,
         p.sub_category,
         p.picture
       FROM personal_collection pc
       JOIN pop_catalog p ON pc.pop_id = p.pop_id
       WHERE pc.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching collection:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Import signup and login handlers
const { signup } = require('./signup');
const { login } = require('./login');

// Public auth routes
app.post('/api/signup', signup);
app.post('/api/login', login);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
