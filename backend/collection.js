// routes/collection.js
const express = require('express');
const router = express.Router();
const db = require('../db');           // your MySQL connection/export
const authenticate = require('../middleware/authenticate'); // your auth middleware

// GET /api/collection
router.get('/api/collection', authenticate, async (req, res) => {
  const userId = req.user.id; // assume authenticate sets req.user
  try {
    const [rows] = await db.execute(
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
    res.status(500).json({ error: 'Could not load collection' });
  }
});

module.exports = router;
