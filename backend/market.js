// routes/market.js
const express = require('express');
const router = express.Router();
const db = require('./db');             // your MySQL connection/export
const authenticate = require('./authenticate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads (storing in ./uploads locally)
// You can adjust storage to S3 or another folder as needed.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // e.g. image-1634258391234.jpg
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}`);
  }
});
const upload = multer({ storage });

// ------------------------------------------------------------
// GET /api/market
// Return all approved & active listings. If pop_id is NULL, use custom_pop_name/serial.
// ------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT
        m.market_id,
        m.pop_id,
        COALESCE(p.pop_name, m.custom_pop_name)    AS pop_name,
        COALESCE(p.serial_number, m.custom_serial_number) AS serial_number,
        p.category,
        m.price,
        m.date_uploaded,
        m.market_picture,
        m.details,
        m.location,
        u.username   AS seller_username,
        u.email      AS seller_email
      FROM market m
      LEFT JOIN pop_catalog p ON m.pop_id = p.pop_id
      JOIN users u             ON m.seller_id = u.user_id
      WHERE m.approved = TRUE
        AND m.status = 'active'
      ORDER BY m.date_uploaded DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching market listings:', err);
    res.status(500).json({ error: 'Could not load market listings' });
  }
});

// ------------------------------------------------------------
// POST /api/market
// Create a new listing. Handles both catalog‐existing and custom Pops.
// Expects multipart/form-data with fields:
//  • not_in_catalog ("true" / "false")
//  • pop_id (if not_in_catalog=false)
//  • custom_pop_name, custom_serial_number (if not_in_catalog=true)
//  • price, location, details
//  • image (file upload)
// ------------------------------------------------------------
router.post(
  '/',
  authenticate,
  upload.single('image'),   // Multer middleware
  async (req, res) => {
    const sellerId = req.user.id;
    const {
      not_in_catalog,
      pop_id,
      custom_pop_name,
      custom_serial_number,
      price,
      location,
      details
    } = req.body;

    // 1) Handle the uploaded image (if any)
    let imageUrl = null;
    if (req.file) {
      // For a local store, we can serve "/uploads/<filename>"
      // Make sure you set up static serving of "/uploads" in your main server file
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 2) Basic validation
    if (not_in_catalog === 'true') {
      if (!custom_pop_name || custom_pop_name.trim() === '') {
        return res.status(400).json({ error: 'Missing custom_pop_name' });
      }
      // custom_serial_number may be empty, that's OK
    } else {
      if (!pop_id) {
        return res.status(400).json({ error: 'Missing pop_id' });
      }
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    if (!location || location.trim() === '') {
      return res.status(400).json({ error: 'Missing location' });
    }

    // 3) Build and execute the INSERT
    let sql, params;
    if (not_in_catalog === 'true') {
      // Branch: custom Pop
      sql = `
        INSERT INTO market
          (
            pop_id,
            seller_id,
            price,
            location,
            market_picture,
            details,
            status,
            approved,
            custom_pop_name,
            custom_serial_number
          )
        VALUES
          (
            NULL,
            ?,
            ?,
            ?,
            ?,
            ?,
            'active',
            FALSE,
            ?,
            ?
          )
      `;
      params = [
        sellerId,
        parseFloat(Number(price).toFixed(2)),
        location,
        imageUrl,
        details || null,
        custom_pop_name.trim(),
        custom_serial_number ? custom_serial_number.trim() : null
      ];
    } else {
      // Branch: catalog‐existing Pop
      sql = `
        INSERT INTO market
          (
            pop_id,
            seller_id,
            price,
            location,
            market_picture,
            details,
            status,
            approved,
            custom_pop_name,
            custom_serial_number
          )
        VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'active',
            FALSE,
            NULL,
            NULL
          )
      `;
      params = [
        parseInt(pop_id, 10),
        sellerId,
        parseFloat(Number(price).toFixed(2)),
        location,
        imageUrl,
        details || null
      ];
    }

    try {
      const [result] = await db.execute(sql, params);
      return res.status(201).json({ market_id: result.insertId });
    } catch (err) {
      console.error('Error inserting new listing:', err);
      return res.status(500).json({ error: 'Database error creating listing' });
    }
  }
);

module.exports = router;
