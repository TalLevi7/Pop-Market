const express = require('express');
const router = express.Router();
const db = require('./db');           // your MySQL connection/export
const authenticate = require('./authenticate'); // your auth middleware


// Fetch entire Pop Catalog
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pop_catalog');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching catalog:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


module.exports = router;
