// In server.js or collection.js
const express = require('express');
const db = require('./db'); // Database connection pool
const router = express.Router();

// Fetch user's collection based on user_id (from the JWT or localStorage)
router.get('/api/collection', async (req, res) => {
  const userId = req.user_id; // User ID should be available in the authentication context or JWT

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' }); // If not authenticated, return error
  }

  const sql = `
    SELECT pc.collection_id, pc.acquired_date, p.pop_name, p.picture, p.category
    FROM personal_collection pc
    JOIN pop_catalog p ON pc.pop_id = p.pop_id
    WHERE pc.user_id = ?
    ORDER BY pc.acquired_date DESC
  `;

  try {
    const [collection] = await db.query(sql, [userId]);
    res.json(collection); // Send the collection data
  } catch (err) {
    console.error('Error fetching collection:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;
