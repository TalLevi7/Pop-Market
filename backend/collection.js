// collection.js
const express = require('express');
const router = express.Router();
const db = require('./db');           
const authenticate = require('./authenticate'); 

// GET /api/collection
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id; // assume authenticate sets req.user
  console.log("\n collection.js 10: ", userId)
  try {
    const [rows] = await db.execute(
      `SELECT 
         pc.collection_id,
         pc.acquired_date,
         p.pop_id,
         p.pop_name,
         p.serial_number,
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

// POST /api/collection — add a new pop to the user's collection
router.post('/', authenticate, async (req, res) => {
  const { pop_id } = req.body;
  db.query(
    'INSERT INTO personal_collection (user_id, pop_id) VALUES (?, ?)',
    [req.user.id, pop_id],
    (err) => {
      if (err) {
        // optional: handle duplicate entry if needed
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Added to collection' });
    }
  );
});

module.exports = router;
