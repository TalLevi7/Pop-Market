// routes/wishlist.js
const express = require('express');
const router = express.Router();
const db = require('./db');           // your MySQL connection/export
const authenticate = require('./authenticate'); // your auth middleware

// GET /api/collection
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id; // assume authenticate sets req.user
  console.log("\n wishlist.js 10: ", userId)
  try {
    const [rows] = await db.execute(
      `SELECT 
         pc.wish_id,
         pc.added_date,
         p.pop_id,
         p.pop_name,
         p.category,
         p.sub_category,
         p.picture
       FROM wishlist pc
       JOIN pop_catalog p ON pc.pop_id = p.pop_id
       WHERE pc.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ error: 'Could not load wishlist' });
  }
});

// POST /api/collection — add a new pop to the user's collection
router.post('/', authenticate, async (req, res) => {
  const { pop_id } = req.body;
  db.query(
    'INSERT INTO wishlist (user_id, pop_id) VALUES (?, ?)',
    [req.user.id, pop_id],
    (err) => {
      if (err) {
        // optional: handle duplicate entry if needed
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Added to wishlist' });
    }
  );
});

module.exports = router;
